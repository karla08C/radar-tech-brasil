import { useState } from 'react';
import { Calendar, Download } from 'lucide-react';
import type { TechEvent } from '../types';
import { downloadCalendarIcs, generateGoogleCalendarUrl, getDeadlineReminder } from '../utils/calendarUtils';
import { formatDateBR } from '../utils/eventUtils';

export function CalendarReminderActions({ event }: { event: TechEvent }) {
  const [downloadError, setDownloadError] = useState(false);
  const reminder = getDeadlineReminder(event);
  const googleUrl = generateGoogleCalendarUrl(event);

  if (!reminder || !googleUrl) {
    return <p className="text-xs text-stone-500">{event.isContinuousFlow
      ? 'Este edital é de fluxo contínuo e não possui prazo fixo para criar um lembrete.'
      : 'O prazo de submissão está ausente ou inválido. Consulte o edital oficial antes de criar um lembrete.'}</p>;
  }

  const deadlineLabel = reminder.allDay ? `${formatDateBR(event.registrationDeadline)} (dia inteiro)`
    : `${reminder.start.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} (horário de Brasília)`;
  const actionClass = 'w-full py-2.5 rounded-lg bg-[#f6faf8] hover:bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-200 flex items-center justify-center gap-2 transition-colors cursor-pointer font-medium';

  return (
    <div className="space-y-3">
      <p className="text-xs text-stone-500">Lembrete do prazo de submissão: <strong className="text-stone-800">{deadlineLabel}</strong>. Horários sem fuso no cadastro são interpretados em Brasília.</p>
      <a href={googleUrl} target="_blank" rel="noopener noreferrer" className={actionClass}>
        <Calendar className="w-4 h-4" /> Salvar Prazo no Google Agenda
      </a>
      <button onClick={() => {
        try {
          setDownloadError(!downloadCalendarIcs(event));
        } catch {
          setDownloadError(true);
        }
      }} className={actionClass}>
        <Download className="w-4 h-4" /> Baixar lembrete (.ics)
      </button>
      <p className="text-xs text-stone-500">Importe o .ics no Outlook ou Apple Calendar. O arquivo inclui aviso {reminder.allDay ? 'um dia' : 'uma hora'} antes; confirme os alertas após importar. No Google Agenda, revise a notificação antes de salvar.</p>
      {downloadError && <p role="alert" className="text-xs text-amber-800">Não foi possível baixar o lembrete. Tente novamente ou use o Google Agenda.</p>}
    </div>
  );
}
