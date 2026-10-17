import { TechEvent } from '../types';

export function formatBRL(amount: number): string {
  if (!amount || amount === 0) return 'Gratuito / Sem Prêmio';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }
  return dateStr;
}

export function formatDateRange(startStr: string, endStr: string): string {
  if (!startStr) return '';
  if (!endStr || startStr === endStr) {
    return formatDateBR(startStr);
  }
  return `${formatDateBR(startStr)} até ${formatDateBR(endStr)}`;
}

export function getDaysRemaining(deadlineStr: string): number {
  if (!deadlineStr) return 999;
  const parts = deadlineStr.split('-');
  if (parts.length !== 3) return 999;
  const deadline = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 23, 59, 59);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getStatusBadge(deadlineStr: string, endDateStr: string): {
  label: string;
  colorClass: string;
  status: 'open' | 'urgent' | 'closed';
} {
  const days = getDaysRemaining(deadlineStr);
  const endDays = getDaysRemaining(endDateStr);

  if (endDays < 0) {
    return {
      label: 'Evento Encerrado',
      colorClass: 'bg-slate-100 text-slate-600 border-slate-200',
      status: 'closed',
    };
  }

  if (days < 0) {
    return {
      label: 'Inscrições Encerradas',
      colorClass: 'bg-slate-100 text-slate-600 border-slate-200',
      status: 'closed',
    };
  }

  if (days <= 3) {
    return {
      label: `Encerra em ${days === 0 ? 'poucas horas!' : `${days} dia${days > 1 ? 's' : ''}!`} 🔥`,
      colorClass: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
      status: 'urgent',
    };
  }

  if (days <= 7) {
    return {
      label: `Últimos ${days} dias de inscrição`,
      colorClass: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
      status: 'urgent',
    };
  }

  return {
    label: 'Inscrições Abertas',
    colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
    status: 'open',
  };
}

export function generateGoogleCalendarUrl(event: TechEvent): string {
  const title = encodeURIComponent(`[${event.category.toUpperCase()}] ${event.title}`);
  const details = encodeURIComponent(
    `${event.description}\n\n🏆 Premiação: ${event.prizes.highlight}\n📍 Local: ${event.location.city} - ${event.location.state} (${event.modality})\n🔗 Mais informações e Inscrições: ${event.registrationUrl || event.websiteUrl}`
  );
  const location = encodeURIComponent(
    event.modality === 'online'
      ? 'Online / Remoto'
      : `${event.location.venue || ''}, ${event.location.city} - ${event.location.state}, Brasil`
  );

  const startFormatted = event.startDate.replace(/-/g, '') + 'T090000';
  const endFormatted = (event.endDate || event.startDate).replace(/-/g, '') + 'T180000';

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startFormatted}/${endFormatted}`;
}

export function downloadIcsFile(event: TechEvent): void {
  const startFormatted = event.startDate.replace(/-/g, '') + 'T090000Z';
  const endFormatted = (event.endDate || event.startDate).replace(/-/g, '') + 'T180000Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RadarTech Brasil//PT-BR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:[${event.category.toUpperCase()}] ${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')} - Premiação: ${event.prizes.highlight}`,
    `LOCATION:${event.modality === 'online' ? 'Online' : `${event.location.city} - ${event.location.state}`}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `URL:${event.registrationUrl || event.websiteUrl}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.slug || 'evento'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
