import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Landmark, Rocket } from 'lucide-react';
import { TechEvent } from '../types';
import { formatDateBR } from '../utils/eventUtils';

interface CalendarViewProps {
  events: TechEvent[];
  onSelectEvent: (event: TechEvent) => void;
}

export function CalendarView({ events, onSelectEvent }: CalendarViewProps) {
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    return new Date();
  });

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsByDay: { [day: number]: TechEvent[] } = {};

  events.forEach((evt) => {
    const deadline = evt.registrationDeadline;
    if (!deadline) return;
    const parts = deadline.split('T')[0].split('-');
    if (parts.length === 3) {
      const evtYear = Number(parts[0]);
      const evtMonth = Number(parts[1]) - 1;
      const evtDay = Number(parts[2]);

      if (evtYear === year && evtMonth === month) {
        if (!eventsByDay[evtDay]) eventsByDay[evtDay] = [];
        eventsByDay[evtDay].push(evt);
      }
    }
  });

  const weekDayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 mb-6 text-stone-800">
      {/* Calendar Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-stone-200">
        <div>
          <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2 font-sans">
            <CalendarIcon className="w-5 h-5 text-stone-700" />
            Calendário de inscrições
          </h3>
          <p className="text-xs text-stone-500 mt-0.5 font-sans">
            Consulte os prazos de inscrição de cada oportunidade.
          </p>
          <div className="flex items-center gap-3 mt-2 text-[11px] font-sans">
            <span className="inline-flex items-center gap-1.5 text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              <Landmark className="w-3 h-3 text-stone-500" />
              Editais de Fomento
            </span>
            <span className="inline-flex items-center gap-1.5 text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              <Rocket className="w-3 h-3 text-stone-500" />
              Aceleração & Desafios
            </span>
          </div>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-stone-50 border border-stone-200 rounded-lg p-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Mês Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold font-sans text-stone-900 px-2">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Próximo Mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-[11px] text-stone-500 font-medium">
        {weekDayLabels.map((lbl) => (
          <div key={lbl} className="py-1">
            {lbl}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="min-h-[80px] rounded-lg bg-stone-50/40 border border-stone-200/40 p-1.5 opacity-30"
          />
        ))}

        {Array.from({ length: totalDaysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayEvents = eventsByDay[dayNum] || [];
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={`day-${dayNum}`}
              className={`min-h-[80px] rounded-lg border p-1.5 flex flex-col justify-between transition-colors ${
                hasEvents
                  ? 'bg-stone-50 border-stone-200 hover:border-stone-300'
                  : 'bg-stone-50/60 border-stone-200/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-sans font-semibold ${hasEvents ? 'text-stone-900' : 'text-stone-500'}`}>
                  {dayNum}
                </span>
                {hasEvents && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </div>

              <div className="space-y-1 mt-1">
                {dayEvents.slice(0, 2).map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => onSelectEvent(evt)}
                    className="text-[11px] truncate px-1.5 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border border-stone-200 cursor-pointer transition-colors"
                    title={evt.title}
                  >
                    {evt.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[9px] font-sans text-stone-500 text-center">
                    +{dayEvents.length - 2} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
