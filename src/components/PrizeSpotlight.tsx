import { Trophy, ArrowRight, MapPin, Building, Sparkles } from 'lucide-react';
import { TechEvent } from '../types';
import { formatBRL } from '../utils/eventUtils';
import { CountdownBadge } from './CountdownBadge';

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
    <section className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-[#0C0F17]/90 p-5 sm:p-6 mb-6 shadow-xl backdrop-blur-xl">
      <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Trophy className="w-4 h-4 text-violet-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                Chamadas Estratégicas de Alto Valor
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">
                Top Montantes
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onFilterHighPrizes}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300 hover:text-cyan-200 transition-colors self-start sm:self-auto bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 rounded-lg cursor-pointer"
        >
          <span>Ver aportes R$ 500k+</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* 3 Compact Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {topPrizeEvents.map((evt, idx) => (
          <div
            key={evt.id}
            onClick={() => onSelectEvent(evt)}
            className="group relative cursor-pointer rounded-xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/40 p-4 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/6">
                  {evt.funder || evt.organizer}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {evt.location.state === 'Online' ? '100% Online' : evt.location.state}
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors">
                {evt.title}
              </h3>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/6 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {evt.prizes.highlight || formatBRL(evt.prizes.totalValue)}
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Inspecionar</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
