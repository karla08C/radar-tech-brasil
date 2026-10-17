import { useState } from 'react';
import { ChevronLeft, ChevronRight, Trophy, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { TechEvent } from '../types';
import { formatBRL, formatDateBR } from '../utils/eventUtils';

interface CalendarViewProps {
  events: TechEvent[];
  onSelectEvent: (event: TechEvent) => void;
}

export function CalendarView({ events, onSelectEvent }: CalendarViewProps) {
  // Current calendar month navigation (default to September 2026 or current active date)
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    // Find the earliest start date among events or use 2026-09
    return new Date(2026, 8, 1); // Month is 0-indexed (8 = September)
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

  // Map events to day numbers in this month
  const eventsByDay: { [day: number]: TechEvent[] } = {};

  events.forEach((evt) => {
    if (!evt.startDate) return;
    const parts = evt.startDate.split('-');
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
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Calendar Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            Cronograma de Eventos & Hackathons
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Navegue pelos meses para planejar sua participação e entregas de projetos
          </p>
          {/* Quick Legend */}
          <div className="flex items-center gap-3 mt-2 text-[11px] font-bold">
            <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              🚀 Hackathons
            </span>
            <span className="inline-flex items-center gap-1 text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
              🎪 Conferências & Summits
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-colors"
            title="Mês anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-900 min-w-[140px] text-center">
            {monthNames[month]} de {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-colors"
            title="Próximo mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
        {weekDayLabels.map((d, i) => (
          <div key={i} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty slots for offset */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[100px] rounded-2xl bg-slate-50/40 border border-dashed border-slate-200/60" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: totalDaysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayEvents = eventsByDay[dayNum] || [];
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={`day-${dayNum}`}
              className={`min-h-[110px] p-2.5 rounded-2xl border flex flex-col justify-between transition-all ${
                hasEvents
                  ? 'bg-white border-indigo-200 shadow-xs hover:border-indigo-300'
                  : 'bg-slate-50/60 border-slate-200/80 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${hasEvents ? 'text-slate-900' : 'text-slate-400'}`}>
                  {dayNum}
                </span>
                {hasEvents && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Event pills inside day */}
              <div className="space-y-1.5 overflow-hidden">
                {dayEvents.slice(0, 2).map((evt) => {
                  const isHackathon = evt.category === 'hackathon';
                  return (
                    <button
                      key={evt.id}
                      onClick={() => onSelectEvent(evt)}
                      className={`w-full text-left p-1.5 rounded-xl border text-[11px] leading-tight transition-all truncate group cursor-pointer ${
                        isHackathon
                          ? 'bg-indigo-50/50 hover:bg-indigo-100/60 border-indigo-200/80 text-indigo-950'
                          : 'bg-sky-50/50 hover:bg-sky-100/60 border-sky-200/80 text-sky-950'
                      }`}
                    >
                      <div className="font-bold truncate flex items-center gap-1">
                        <span>{isHackathon ? '🚀' : '🎪'}</span>
                        <span className="truncate">{evt.title}</span>
                      </div>
                      {evt.prizes.totalValue > 0 ? (
                        <div className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-0.5 mt-0.5">
                          <Trophy className="w-2.5 h-2.5 text-amber-500" />
                          {formatBRL(evt.prizes.totalValue)}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {evt.location.state === 'Online' ? 'Online' : evt.location.city}
                        </div>
                      )}
                    </button>
                  );
                })}

                {dayEvents.length > 2 && (
                  <span className="text-[10px] text-slate-500 font-semibold pl-1 block">
                    +{dayEvents.length - 2} outros
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
