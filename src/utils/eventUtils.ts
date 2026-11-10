import { TechEvent } from '../types';

export function formatBRL(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `R$ ${millions.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} mi`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    return `R$ ${thousands.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}k`;
  }
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

export function formatDateBR(dateString: string): string {
  if (!dateString) return '';
  const dateOnly = dateString.split('T')[0];
  const parts = dateOnly.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}

export function formatDateRange(start: string, end?: string): string {
  if (!start) return '';
  const formattedStart = formatDateBR(start);
  if (!end || end === start) {
    return formattedStart;
  }
  const formattedEnd = formatDateBR(end);
  return `${formattedStart} - ${formattedEnd}`;
}

export function getDaysRemaining(deadline: string): number {
  if (!deadline) return 0;
  const target = deadline.includes('T')
    ? new Date(deadline).getTime()
    : new Date(`${deadline}T23:59:59`).getTime();
  const now = new Date().getTime();
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getStatusBadge(deadline: string, isContinuous?: boolean): {
  label: string;
  colorClass: string;
  status: 'open' | 'urgent' | 'closed' | 'continuous';
} {
  if (isContinuous) {
    return {
      label: 'Fluxo Contínuo',
      colorClass: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30',
      status: 'continuous',
    };
  }

  const days = getDaysRemaining(deadline);

  if (days < 0) {
    return {
      label: 'Inscrições Encerradas',
      colorClass: 'bg-slate-900 text-slate-400 border-slate-800',
      status: 'closed',
    };
  }

  if (days <= 2) {
    return {
      label: days === 0 ? 'Encerra hoje' : `Encerra em ${days} dia${days > 1 ? 's' : ''}`,
      colorClass: 'bg-rose-950/40 text-rose-300 border-rose-500/30',
      status: 'urgent',
    };
  }

  if (days <= 7) {
    return {
      label: `Restam ${days} dias`,
      colorClass: 'bg-amber-950/40 text-amber-300 border-amber-500/30',
      status: 'urgent',
    };
  }

  return {
    label: 'Inscrições Abertas',
    colorClass: 'bg-slate-900 text-slate-300 border-slate-800',
    status: 'open',
  };
}

export function generateGoogleCalendarUrl(event: TechEvent): string {
  const title = encodeURIComponent(`[${event.category.toUpperCase()}] ${event.title}`);
  const details = encodeURIComponent(
    `${event.description}\n\nFomento: ${event.prizes.highlight}\nFinanciador: ${event.funder || event.organizer}\nLocal: ${event.location.city} - ${event.location.state} (${event.modality})\nMais informações e Inscrições: ${event.registrationUrl || event.websiteUrl}`
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
