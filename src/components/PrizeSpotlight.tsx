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
    <section className="rounded-xl border border-stone-200 bg-white p-5 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700">
            <Trophy className="w-4 h-4 text-stone-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-semibold text-stone-900 tracking-tight font-sans">
                Oportunidades em destaque
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                Maiores aportes
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onFilterHighPrizes}
          className="inline-flex items-center gap-1.5 text-xs font-sans text-stone-700 hover:text-stone-900 transition-colors self-start sm:self-auto bg-stone-100 hover:bg-stone-200 border border-stone-200 px-3 py-1 rounded-md cursor-pointer"
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
            className="group cursor-pointer rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-50 hover:border-stone-200 p-3.5 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                  {evt.funder || evt.organizer}
                </span>
                <span className="text-[11px] text-stone-500">
                  {evt.location.state === 'Online' ? '100% Online' : evt.location.state}
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-semibold text-stone-900 leading-snug line-clamp-2 font-sans group-hover:text-stone-800 transition-colors">
                {evt.title}
              </h3>
            </div>

            <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold font-sans text-emerald-700">
                  {evt.prizes.highlight || formatBRL(evt.prizes.totalValue)}
                </span>
              </div>
              <span className="text-xs font-semibold text-stone-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Ver detalhes</span>
                <ArrowRight className="w-3 h-3 text-stone-500" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
