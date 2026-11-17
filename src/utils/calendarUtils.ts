import type { TechEvent } from '../types';

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

/** Sem fuso explícito, os horários dos editais são interpretados em Brasília (UTC-03). */
export function getDeadlineReminder(event: TechEvent) {
  if (event.isContinuousFlow) return null;
  const deadline = event.registrationDeadline;
  const match = /^(\d{4}-\d{2}-\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?)?$/i.exec(deadline ?? '');
  if (!match) return null;
  const date = new Date(`${match[1]}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== match[1]) return null;
  const allDay = match[2] === undefined;
  if (!allDay && (Number(match[2]) > 23 || Number(match[3]) > 59 || Number(match[4] ?? 0) > 59)) return null;
  const start = allDay ? date : new Date(match[5] ? deadline : `${deadline}-03:00`);
  if (!Number.isFinite(start.getTime())) return null;
  return {
    start,
    end: new Date(start.getTime() + (allDay ? DAY : 15 * MINUTE)),
    allDay,
  };
}

function formatUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function formatDay(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

function reminderTitle(event: TechEvent): string {
  return `Prazo de submissão: ${event.title}`;
}

function reminderDescription(event: TechEvent): string {
  return `${event.description}\n\nFomento: ${event.prizes.highlight}\nFinanciador: ${event.funder || event.organizer}\nInscrição: ${event.registrationUrl || event.websiteUrl}\n\nConfira o prazo e eventuais retificações no edital oficial.`;
}

export function generateGoogleCalendarUrl(event: TechEvent): string | null {
  const reminder = getDeadlineReminder(event);
  if (!reminder) return null;
  const format = reminder.allDay ? formatDay : formatUtc;
  const query = new URLSearchParams({
    action: 'TEMPLATE',
    text: reminderTitle(event),
    details: reminderDescription(event),
    dates: `${format(reminder.start)}/${format(reminder.end)}`,
    ctz: 'America/Sao_Paulo',
  });
  return `https://calendar.google.com/calendar/render?${query}`;
}

function escapeText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

/** RFC 5545: linhas de até 75 octetos, sem dividir caracteres UTF-8. */
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  let folded = '';
  let octets = 0;
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (octets + size > 75) {
      folded += '\r\n ';
      octets = 1;
    }
    folded += character;
    octets += size;
  }
  return folded;
}

export function generateCalendarIcs(event: TechEvent, now = new Date()): string | null {
  const reminder = getDeadlineReminder(event);
  if (!reminder) return null;
  const format = reminder.allDay ? formatDay : formatUtc;
  const dateParameter = reminder.allDay ? ';VALUE=DATE' : '';
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Radar Tech Brasil//Lembretes de Editais//PT-BR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:deadline-${encodeURIComponent(event.id)}@radartechbrasil.local`,
    `DTSTAMP:${formatUtc(now)}`,
    `DTSTART${dateParameter}:${format(reminder.start)}`,
    `DTEND${dateParameter}:${format(reminder.end)}`,
    `SUMMARY:${escapeText(reminderTitle(event))}`,
    `DESCRIPTION:${escapeText(reminderDescription(event))}`,
    'TRANSP:TRANSPARENT',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `TRIGGER:${reminder.allDay ? '-P1D' : '-PT1H'}`,
    `DESCRIPTION:${escapeText(reminderTitle(event))}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

export function downloadCalendarIcs(event: TechEvent): boolean {
  const content = generateCalendarIcs(event);
  if (!content) return false;
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `prazo-${(event.slug || event.id).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 100)}.ics`;
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return true;
}
