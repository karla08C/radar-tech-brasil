import { Trophy, ArrowRight, Sparkles, MapPin, Calendar, Clock, DollarSign, Award } from 'lucide-react';
import { TechEvent } from '../types';
import { formatBRL, getDaysRemaining, getStatusBadge } from '../utils/eventUtils';

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
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 mb-8 shadow-sm">
      {/* Subtle geometric circle accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full -mr-24 -mt-24 pointer-events-none" />

      {/* Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Premiações em Destaque 🏆
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Top Recompensas
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Hackathons com maiores premiações em dinheiro, contratação e aceleração
            </p>
          </div>
        </div>

        <button
          id="btn-filter-high-prizes"
          onClick={onFilterHighPrizes}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors self-start sm:self-auto bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3.5 py-1.5 rounded-full"
        >
          <span>Filtrar prêmios R$ 50k+</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top 3 Bento Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {topPrizeEvents.map((evt, idx) => {
          const daysLeft = getDaysRemaining(evt.registrationDeadline);
          const isPrimary = idx === 0;

          return (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt)}
              className="group relative cursor-pointer rounded-3xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Top Banner */}
              <div className={`p-5 relative ${isPrimary ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 backdrop-blur text-white">
                    {idx === 0 ? '🏆 Maior Premiação' : idx === 1 ? '🥈 2º Maior Prêmio' : '🥉 3º Maior Prêmio'}
                  </span>
                  <span className="text-[11px] font-semibold text-white/90 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-white/70" />
                    {evt.location.state === 'Online' ? '100% Online' : `${evt.location.city} (${evt.location.state})`}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-tight mt-3 line-clamp-2">
                  {evt.title}
                </h3>
              </div>

              {/* Bento Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Prize & Deadline Row */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inscrições Até</p>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">
                        {evt.registrationDeadline.split('-').reverse().join('/')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Premiação</p>
                      <p className="text-base font-extrabold text-emerald-600 font-mono tracking-tight">
                        {formatBRL(evt.prizes.totalValue)}
                      </p>
                    </div>
                  </div>

                  {/* Highlights Box */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 mb-4 border border-slate-100">
                    <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-2">
                      "{evt.prizes.highlight}"
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-2">
                    Organizado por <strong className="text-slate-700">{evt.organizer}</strong>
                  </p>
                </div>

                {/* Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEvent(evt);
                  }}
                  className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Ver Detalhes do Edital</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
