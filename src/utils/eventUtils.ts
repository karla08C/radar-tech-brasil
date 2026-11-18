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
      colorClass: 'bg-emerald-50/40 text-emerald-800 border-emerald-200/30',
      status: 'continuous',
    };
  }

  const days = getDaysRemaining(deadline);

  if (days < 0) {
    return {
      label: 'Inscrições Encerradas',
      colorClass: 'bg-stone-50 text-stone-500 border-stone-200',
      status: 'closed',
    };
  }

  if (days <= 2) {
    return {
      label: days === 0 ? 'Encerra hoje' : `Encerra em ${days} dia${days > 1 ? 's' : ''}`,
      colorClass: 'bg-rose-50/40 text-rose-700 border-rose-200/30',
      status: 'urgent',
    };
  }

  if (days <= 7) {
    return {
      label: `Restam ${days} dias`,
      colorClass: 'bg-amber-50/40 text-amber-800 border-amber-500/30',
      status: 'urgent',
    };
  }

  return {
    label: 'Inscrições Abertas',
    colorClass: 'bg-stone-50 text-stone-700 border-stone-200',
    status: 'open',
  };
}

export { generateGoogleCalendarUrl } from './calendarUtils';
