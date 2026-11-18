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
    <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 mb-6 text-stone-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
        <div>
          <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2 font-sans">
            <MapPin className="w-5 h-5 text-stone-700" />
            Oportunidades por região
          </h3>
          <p className="text-xs text-stone-500 mt-0.5 font-sans">
            Clique em qualquer região ou estado para filtrar as oportunidades
          </p>
        </div>

        {/* Online Quick Card */}
        <button
          onClick={() => onSelectState('Online')}
          className={`px-3.5 py-2 rounded-lg border flex items-center gap-2.5 transition-colors cursor-pointer ${
            selectedState === 'Online'
              ? 'bg-stone-100 border-stone-300 text-stone-900'
              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
          }`}
        >
          <div className="w-7 h-7 rounded-md bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700">
            <Globe className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-stone-900">Oportunidades remotas</div>
            <div className="text-[11px] text-stone-500">
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
              className={`p-3.5 rounded-lg border transition-colors cursor-pointer bg-stone-50 ${
                isSelected
                  ? 'border-stone-300 bg-stone-100/80'
                  : 'border-stone-200 hover:border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-sm text-stone-900 font-sans">{reg.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                  {regEvents.length} chamadas
                </span>
              </div>

              <div className="text-xs font-sans font-semibold text-emerald-700 mb-2.5">
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
                      className={`text-[11px] px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        isStateActive
                          ? 'bg-white text-stone-900 font-semibold'
                          : count > 0
                          ? 'bg-stone-100 text-stone-800 border border-stone-200 hover:border-stone-300'
                          : 'bg-stone-100 text-stone-500 border border-transparent'
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
