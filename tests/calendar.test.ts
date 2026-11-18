import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { INITIAL_EVENTS } from '../src/data/initialEvents';
import { CalendarReminderActions } from '../src/components/CalendarReminderActions';
import { generateCalendarIcs, generateGoogleCalendarUrl, getDeadlineReminder } from '../src/utils/calendarUtils';

const event = {
  ...INITIAL_EVENTS[0],
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  registrationDeadline: '2026-11-20T18:00:00',
  isContinuousFlow: false,
};
const now = new Date('2026-11-17T12:00:00Z');
const unfold = (content: string) => content.replace(/\r\n /g, '');

test('Google Calendar uses the submission deadline, with Brasília as the default timezone', () => {
  const url = new URL(generateGoogleCalendarUrl(event)!);
  assert.equal(url.searchParams.get('dates'), '20261120T210000Z/20261120T211500Z');
  assert.equal(url.searchParams.get('ctz'), 'America/Sao_Paulo');
  assert.equal(url.searchParams.get('text'), `Prazo de submissão: ${event.title}`);
  assert.ok(url.searchParams.get('details')!.includes(event.registrationUrl));
});

test('explicit timezone offsets preserve the instant independently of the host timezone', () => {
  for (const deadline of ['2026-11-20T18:00:00-03:00', '2026-11-20T21:00:00Z', '2026-11-20T17:00:00-04:00']) {
    const notice = { ...event, registrationDeadline: deadline };
    assert.equal(getDeadlineReminder(notice)!.start.toISOString(), '2026-11-20T21:00:00.000Z');
    assert.ok(unfold(generateCalendarIcs(notice, now)!).includes('DTSTART:20261120T210000Z\r\n'));
  }
});

test('date-only deadlines are all-day events with an exclusive next-day end across year boundaries', () => {
  const notice = { ...event, registrationDeadline: '2026-12-31' };
  const url = new URL(generateGoogleCalendarUrl(notice)!);
  assert.equal(url.searchParams.get('dates'), '20261231/20270101');
  const content = unfold(generateCalendarIcs(notice, now)!);
  assert.ok(content.includes('DTSTART;VALUE=DATE:20261231\r\n'));
  assert.ok(content.includes('DTEND;VALUE=DATE:20270101\r\n'));
  assert.ok(content.includes('TRIGGER:-P1D\r\n'));
});

test('ICS includes a stable UID, UTC timestamp, and reminder one hour before the submission time', () => {
  const content = unfold(generateCalendarIcs(event, now)!);
  assert.ok(content.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n'));
  assert.ok(content.includes(`UID:deadline-${encodeURIComponent(event.id)}@radartechbrasil.local\r\n`));
  assert.ok(content.includes('DTSTAMP:20261117T120000Z\r\n'));
  assert.ok(content.includes('DTSTART:20261120T210000Z\r\nDTEND:20261120T211500Z\r\n'));
  assert.ok(content.includes('BEGIN:VALARM\r\nACTION:DISPLAY\r\nTRIGGER:-PT1H\r\n'));
  assert.ok(content.endsWith('END:VEVENT\r\nEND:VCALENDAR\r\n'));
});

test('ICS escapes text and folds long UTF-8 lines without corrupting accents or emoji', () => {
  const title = 'Inovação, pesquisa; tecnologia \\ teste\nNova linha ' + 'Ação 🚀 '.repeat(30);
  const content = generateCalendarIcs({ ...event, title }, now)!;
  for (const line of content.split('\r\n')) assert.ok(Buffer.byteLength(line, 'utf8') <= 75);
  assert.ok(!content.includes('\uFFFD'));
  assert.ok(unfold(content).includes('SUMMARY:Prazo de submissão: Inovação\\, pesquisa\\; tecnologia \\\\ teste\\nNova linha '));
  assert.ok(unfold(content).includes('Ação 🚀 '.repeat(30)));
  assert.ok(!content.replace(/\r\n/g, '').includes('\n'));
});

test('invalid deadlines and continuous flow cannot create misleading reminders', () => {
  for (const deadline of ['', 'invalid', '2026-02-30', '2026-13-01', '2026-11-20T25:00:00', '2026-11-20T12:61:00', '2026-11-20T12:00:00+25:00']) {
    const notice = { ...event, registrationDeadline: deadline };
    assert.equal(getDeadlineReminder(notice), null);
    assert.equal(generateGoogleCalendarUrl(notice), null);
    assert.equal(generateCalendarIcs(notice, now), null);
  }
  assert.equal(generateGoogleCalendarUrl({ ...event, isContinuousFlow: true }), null);
  assert.equal(generateCalendarIcs({ ...event, isContinuousFlow: true }, now), null);
});

test('timeline renders both calendar actions for a valid deadline and explanatory text otherwise', () => {
  const markup = renderToStaticMarkup(createElement(CalendarReminderActions, { event }));
  assert.ok(markup.includes('Salvar Prazo no Google Agenda'));
  assert.ok(markup.includes('Baixar lembrete (.ics)'));
  assert.ok(markup.includes('18:00:00'));
  const continuous = renderToStaticMarkup(createElement(CalendarReminderActions, { event: { ...event, isContinuousFlow: true } }));
  assert.ok(continuous.includes('fluxo contínuo'));
  assert.ok(!continuous.includes('<a '));
});
