import { useMemo } from 'react';
import { MapPin, Trophy, Globe, ArrowRight, Building, Sparkles } from 'lucide-react';
import { TechEvent, BrazilianRegion } from '../types';
import { formatBRL } from '../utils/eventUtils';
import { BRAZILIAN_STATES } from '../data/initialEvents';

interface BrazilMapViewProps {
  events: TechEvent[];
  onSelectState: (uf: string) => void;
  onSelectRegion: (region: BrazilianRegion) => void;
  selectedState: string;
  selectedRegion: BrazilianRegion | 'all';
}

export function BrazilMapView({
  events,
  onSelectState,
  onSelectRegion,
  selectedState,
  selectedRegion,
}: BrazilMapViewProps) {
  // Aggregate stats per state
  const stateStats = useMemo(() => {
    const map: { [uf: string]: { count: number; totalPrizes: number; events: TechEvent[] } } = {};

    BRAZILIAN_STATES.forEach((s) => {
      map[s.uf] = { count: 0, totalPrizes: 0, events: [] };
    });
    map['Online'] = { count: 0, totalPrizes: 0, events: [] };

    events.forEach((evt) => {
      const uf = evt.location.state;
      if (!map[uf]) {
        map[uf] = { count: 0, totalPrizes: 0, events: [] };
      }
      map[uf].count += 1;
      map[uf].totalPrizes += evt.prizes?.totalValue || 0;
      map[uf].events.push(evt);
    });

    return map;
  }, [events]);

  // Regional breakdown
  const regions: { name: BrazilianRegion; states: string[]; color: string }[] = [
    { name: 'Sudeste', states: ['SP', 'RJ', 'MG', 'ES'], color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30' },
    { name: 'Sul', states: ['PR', 'SC', 'RS'], color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30' },
    { name: 'Nordeste', states: ['PE', 'BA', 'CE', 'PB', 'RN', 'AL', 'SE', 'PI', 'MA'], color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30' },
    { name: 'Centro-Oeste', states: ['DF', 'GO', 'MT', 'MS'], color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30' },
    { name: 'Norte', states: ['AM', 'PA', 'TO', 'RO', 'AC', 'AP', 'RR'], color: 'from-cyan-500/20 to-sky-500/10 border-cyan-500/30' },
  ];

  const onlineCount = stateStats['Online']?.count || 0;
  const onlinePrizes = stateStats['Online']?.totalPrizes || 0;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            Distribuição de Hackathons pelo Brasil 🇧🇷
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Clique em qualquer região ou estado para filtrar as oportunidades instantaneamente
          </p>
        </div>

        {/* 100% Online Quick Card */}
        <button
          onClick={() => onSelectState('Online')}
          className={`px-4 py-2.5 rounded-2xl border flex items-center gap-3 transition-all ${
            selectedState === 'Online'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            selectedState === 'Online' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
          }`}>
            <Globe className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold">100% Online (Todo o Brasil)</div>
            <div className={`text-[11px] font-bold ${
              selectedState === 'Online' ? 'text-indigo-100' : 'text-indigo-600'
            }`}>
              {onlineCount} eventos • {formatBRL(onlinePrizes)}
            </div>
          </div>
        </button>
      </div>

      {/* Regional Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map((reg) => {
          // Calculate sum of events and prizes in this region
          let regionEventsCount = 0;
          let regionPrizes = 0;

          reg.states.forEach((uf) => {
            regionEventsCount += stateStats[uf]?.count || 0;
            regionPrizes += stateStats[uf]?.totalPrizes || 0;
          });

          const isSelected = selectedRegion === reg.name;

          return (
            <div
              key={reg.name}
              className={`rounded-2xl border p-5 transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <button
                  onClick={() => onSelectRegion(reg.name)}
                  className="text-left group"
                >
                  <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                    {reg.name}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-indigo-600" />
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {regionEventsCount} {regionEventsCount === 1 ? 'evento ativo' : 'eventos ativos'}
                  </p>
                </button>

                <span className="text-xs font-extrabold font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl">
                  {formatBRL(regionPrizes)}
                </span>
              </div>

              {/* State Pills in this region */}
              <div className="flex flex-wrap gap-1.5">
                {reg.states.map((uf) => {
                  const info = stateStats[uf];
                  const hasEvents = info && info.count > 0;
                  const isStateActive = selectedState === uf;

                  return (
                    <button
                      key={uf}
                      onClick={() => onSelectState(uf)}
                      className={`text-xs px-2.5 py-1 rounded-xl font-semibold transition-all border ${
                        isStateActive
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                          : hasEvents
                          ? 'bg-slate-50 hover:bg-indigo-50 text-slate-800 border-slate-200 hover:border-indigo-200'
                          : 'bg-white text-slate-400 border-slate-200/60 hover:border-slate-300'
                      }`}
                      title={`${uf}: ${info?.count || 0} eventos`}
                    >
                      <span>{uf}</span>
                      {hasEvents && (
                        <span className={`ml-1 text-[10px] px-1 py-0.2 rounded-full ${
                          isStateActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700 font-bold'
                        }`}>
                          {info.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
