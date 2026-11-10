import { useMemo } from 'react';
import { MapPin, Globe } from 'lucide-react';
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

  const regions: { name: BrazilianRegion; states: string[] }[] = [
    { name: 'Nordeste', states: ['PE', 'BA', 'CE', 'PB', 'RN', 'AL', 'SE', 'PI', 'MA'] },
    { name: 'Sudeste', states: ['SP', 'RJ', 'MG', 'ES'] },
    { name: 'Sul', states: ['PR', 'SC', 'RS'] },
    { name: 'Centro-Oeste', states: ['DF', 'GO', 'MT', 'MS'] },
    { name: 'Norte', states: ['AM', 'PA', 'TO', 'RO', 'AC', 'AP', 'RR'] },
  ];

  const onlineCount = stateStats['Online']?.count || 0;
  const onlinePrizes = stateStats['Online']?.totalPrizes || 0;

  return (
    <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 sm:p-6 mb-6 text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-['Plus_Jakarta_Sans']">
            <MapPin className="w-5 h-5 text-slate-300" />
            Distribuição Territorial de Editais & Recursos (Brasil)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Clique em qualquer região ou estado para filtrar as oportunidades
          </p>
        </div>

        {/* Online Quick Card */}
        <button
          onClick={() => onSelectState('Online')}
          className={`px-3.5 py-2 rounded-lg border flex items-center gap-2.5 transition-colors cursor-pointer ${
            selectedState === 'Online'
              ? 'bg-slate-800 border-slate-600 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="w-7 h-7 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <Globe className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-white">Submissão Remota</div>
            <div className="text-[10px] font-mono text-slate-400">
              {onlineCount} chamadas • {formatBRL(onlinePrizes)}
            </div>
          </div>
        </button>
      </div>

      {/* Regional Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {regions.map((reg) => {
          const isSelected = selectedRegion === reg.name;
          const regEvents = events.filter((e) => e.location.region === reg.name);
          const totalPrize = regEvents.reduce((acc, e) => acc + (e.prizes?.totalValue || 0), 0);

          return (
            <div
              key={reg.name}
              onClick={() => onSelectRegion(reg.name)}
              className={`p-3.5 rounded-lg border transition-colors cursor-pointer bg-slate-900 ${
                isSelected
                  ? 'border-slate-600 bg-slate-800/80'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-white font-['Plus_Jakarta_Sans']">{reg.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {regEvents.length} chamadas
                </span>
              </div>

              <div className="text-xs font-mono font-bold text-emerald-400 mb-2.5">
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
                      className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        isStateActive
                          ? 'bg-white text-slate-900 font-bold'
                          : count > 0
                          ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600'
                          : 'bg-slate-950 text-slate-600 border border-transparent'
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
