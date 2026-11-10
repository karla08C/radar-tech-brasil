import { Trophy, ArrowRight, MapPin, Building } from 'lucide-react';
import { TechEvent } from '../types';
import { formatBRL } from '../utils/eventUtils';

interface PrizeSpotlightProps {
  events: TechEvent[];
  onSelectEvent: (event: TechEvent) => void;
  onFilterHighPrizes: () => void;
}

export function PrizeSpotlight({ events, onSelectEvent, onFilterHighPrizes }: PrizeSpotlightProps) {
  const topPrizeEvents = [...events]
    .filter(e => e.prizes && e.prizes.totalValue > 0)
    .sort((a, b) => (b.prizes?.totalValue || 0) - (a.prizes?.totalValue || 0))
    .slice(0, 3);

  if (topPrizeEvents.length === 0) return null;

  return (
    <section className="rounded-xl border border-slate-800 bg-[#121824] p-5 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <Trophy className="w-4 h-4 text-slate-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight font-['Plus_Jakarta_Sans']">
                Chamadas Estratégicas de Alto Valor
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Top Montantes
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onFilterHighPrizes}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white transition-colors self-start sm:self-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1 rounded-md cursor-pointer"
        >
          <span>Ver aportes R$ 500k+</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* 3 Compact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {topPrizeEvents.map((evt) => (
          <div
            key={evt.id}
            onClick={() => onSelectEvent(evt)}
            className="group cursor-pointer rounded-lg border border-slate-800 bg-[#0F141F] hover:bg-slate-900 hover:border-slate-700 p-3.5 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {evt.funder || evt.organizer}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {evt.location.state === 'Online' ? '100% Online' : evt.location.state}
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 font-['Plus_Jakarta_Sans'] group-hover:text-slate-200 transition-colors">
                {evt.title}
              </h3>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {evt.prizes.highlight || formatBRL(evt.prizes.totalValue)}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Inspecionar</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
