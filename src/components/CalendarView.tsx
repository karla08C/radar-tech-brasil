import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar as CalendarIcon, Landmark, Rocket } from 'lucide-react';
import { TechEvent } from '../types';
import { formatBRL, formatDateBR } from '../utils/eventUtils';

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

  // Calculate days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Map events to deadline day numbers in this month
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
    <div className="bg-[#0B0F19]/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl mb-6 backdrop-blur-xl text-slate-200">
      {/* Calendar Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-cyan-400" />
            Cronograma de Prazos Finais & Submissões
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize as datas limites de envio para editais de fomento e chamadas públicas
          </p>
          {/* Quick Legend */}
          <div className="flex items-center gap-3 mt-2 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
              <Landmark className="w-3 h-3" />
              Editais de Fomento
            </span>
            <span className="inline-flex items-center gap-1.5 text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-500/30">
              <Rocket className="w-3 h-3" />
              Aceleração & Desafios
            </span>
          </div>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-[#07090E] border border-white/10 rounded-xl p-1">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Mês Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold font-mono text-white px-2">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Próximo Mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[10px] font-mono uppercase tracking-wider text-slate-500">
        {weekDayLabels.map((lbl) => (
          <div key={lbl} className="py-1">
            {lbl}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Leading empty slots */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="min-h-[90px] rounded-xl bg-white/[0.02] border border-white/[0.03] p-1.5 opacity-40"
          />
        ))}

        {/* Days of the month */}
        {Array.from({ length: totalDaysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayEvents = eventsByDay[dayNum] || [];
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={`day-${dayNum}`}
              className={`min-h-[90px] rounded-xl border p-2 flex flex-col justify-between transition-all ${
                hasEvents
                  ? 'bg-[#07090E] border-cyan-500/30 hover:border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.08)]'
                  : 'bg-[#07090E]/60 border-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-semibold ${hasEvents ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {dayNum}
                </span>
                {hasEvents && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                )}
              </div>

              {/* Event indicators in this cell */}
              <div className="space-y-1 mt-1">
                {dayEvents.slice(0, 2).map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => onSelectEvent(evt)}
                    className="text-[10px] font-sans truncate px-1.5 py-0.5 rounded bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/5 cursor-pointer transition-colors"
                    title={evt.title}
                  >
                    {evt.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[9px] font-mono text-slate-500 text-center">
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
