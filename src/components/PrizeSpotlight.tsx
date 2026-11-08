import { Trophy, ArrowRight, MapPin, Calendar, Clock, DollarSign, Award, Landmark, Building, Sparkles } from 'lucide-react';
import { TechEvent } from '../types';
import { formatBRL, getDaysRemaining } from '../utils/eventUtils';
import { CountdownBadge } from './CountdownBadge';

interface PrizeSpotlightProps {
  events: TechEvent[];
  onSelectEvent: (event: TechEvent) => void;
  onFilterHighPrizes: () => void;
}

export function PrizeSpotlight({ events, onSelectEvent, onFilterHighPrizes }: PrizeSpotlightProps) {
  // Sort by prize value descending and take top 3
  const topPrizeEvents = [...events]
    .filter(e => e.prizes && e.prizes.totalValue > 0)
    .sort((a, b) => (b.prizes?.totalValue || 0) - (a.prizes?.totalValue || 0))
    .slice(0, 3);

  if (topPrizeEvents.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F19]/90 p-5 sm:p-7 mb-8 shadow-2xl backdrop-blur-xl">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Trophy className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight font-sans">
                Chamadas Estratégicas & Grandes Aportes
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                Top Fomento
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Editais públicos com maiores montantes de subvenção econômica e aceleração
            </p>
          </div>
        </div>

        <button
          onClick={onFilterHighPrizes}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300 hover:text-cyan-200 transition-colors self-start sm:self-auto bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl cursor-pointer"
        >
          <span>Ver aportes R$ 500k+</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top 3 Bento Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topPrizeEvents.map((evt, idx) => {
          const isPrimary = idx === 0;

          return (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt)}
              className="group relative cursor-pointer rounded-xl border border-white/10 bg-[#07090E] hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.1)] transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Top Banner */}
              <div className="p-4 relative border-b border-white/5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                    isPrimary 
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                      : 'bg-white/5 text-slate-300 border-white/10'
                  }`}>
                    {idx === 0 ? 'Maior Aporte Nacional' : `${idx + 1}º Maior Montante`}
                  </span>

                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {evt.location.state === 'Online' ? '100% Online' : `${evt.location.city} (${evt.location.state})`}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white leading-snug mt-3 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                  {evt.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {evt.funder || evt.organizer}
                </p>
              </div>

              {/* Lower Body: Prize Value & Deadline */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                    Subvenção Máxima Estimada
                  </div>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {evt.prizes.highlight || formatBRL(evt.prizes.totalValue)}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <CountdownBadge deadline={evt.registrationDeadline} />
                  <span className="text-xs font-mono text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspecionar</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
