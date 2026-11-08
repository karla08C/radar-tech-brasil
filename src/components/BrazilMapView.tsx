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
  const regions: { name: BrazilianRegion; states: string[]; glow: string }[] = [
    { name: 'Nordeste', states: ['PE', 'BA', 'CE', 'PB', 'RN', 'AL', 'SE', 'PI', 'MA'], glow: 'border-cyan-500/30' },
    { name: 'Sudeste', states: ['SP', 'RJ', 'MG', 'ES'], glow: 'border-indigo-500/30' },
    { name: 'Sul', states: ['PR', 'SC', 'RS'], glow: 'border-emerald-500/30' },
    { name: 'Centro-Oeste', states: ['DF', 'GO', 'MT', 'MS'], glow: 'border-amber-500/30' },
    { name: 'Norte', states: ['AM', 'PA', 'TO', 'RO', 'AC', 'AP', 'RR'], glow: 'border-violet-500/30' },
  ];

  const onlineCount = stateStats['Online']?.count || 0;
  const onlinePrizes = stateStats['Online']?.totalPrizes || 0;

  return (
    <div className="bg-[#0B0F19]/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl mb-6 backdrop-blur-xl text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            Distribuição Territorial de Editais & Recursos (Brasil)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Clique em qualquer região ou estado para filtrar as oportunidades instantaneamente
          </p>
        </div>

        {/* 100% Online Quick Card */}
        <button
          onClick={() => onSelectState('Online')}
          className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
            selectedState === 'Online'
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
              : 'bg-[#07090E] border-white/10 text-slate-300 hover:bg-white/5'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Globe className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-white">Submissão Remota</div>
            <div className="text-[10px] font-mono text-cyan-400">
              {onlineCount} chamadas • {formatBRL(onlinePrizes)}
            </div>
          </div>
        </button>
      </div>

      {/* Regional Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {regions.map((reg) => {
          const isSelected = selectedRegion === reg.name;
          const regEvents = events.filter((e) => e.location.region === reg.name);
          const totalPrize = regEvents.reduce((acc, e) => acc + (e.prizes?.totalValue || 0), 0);

          return (
            <div
              key={reg.name}
              onClick={() => onSelectRegion(reg.name)}
              className={`p-4 rounded-xl border transition-all cursor-pointer bg-[#07090E] ${
                isSelected
                  ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-white">{reg.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-cyan-400 border border-white/5">
                  {regEvents.length} chamadas
                </span>
              </div>

              <div className="text-xs font-mono font-bold text-emerald-400 mb-3">
                {formatBRL(totalPrize)}
              </div>

              {/* State Chips */}
              <div className="flex flex-wrap gap-1">
                {reg.states.map((uf) => {
                  const count = stateStats[uf]?.count || 0;
                  const isStateActive = selectedState === uf;

                  return (
                    <button
                      key={uf}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectState(uf);
                      }}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                        isStateActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                          : count > 0
                          ? 'bg-white/10 text-slate-200 border border-white/10 hover:border-cyan-500/30'
                          : 'bg-white/5 text-slate-600 border border-transparent'
                      }`}
                      title={`${uf}: ${count} oportunidades`}
                    >
                      {uf} {count > 0 && <span className="opacity-70">({count})</span>}
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
