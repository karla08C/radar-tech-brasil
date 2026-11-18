import { ExternalLink, Bookmark, Repeat } from 'lucide-react';
import { TechEvent } from '../types';
import { formatBRL, formatDateBR } from '../utils/eventUtils';
import { CountdownBadge } from './CountdownBadge';

interface TableViewProps {
  events: TechEvent[];
  onSelectEvent: (event: TechEvent) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function TableView({ events, onSelectEvent, favorites, onToggleFavorite }: TableViewProps) {
  if (events.length === 0) {
    return null;
  }

  const getCategoryConfig = (cat: string) => {
    switch (cat) {
      case 'edital_fomento':
        return { label: 'Edital de Fomento', badge: 'bg-stone-100 text-stone-800 border-stone-200' };
      case 'aceleracao':
        return { label: 'Aceleração', badge: 'bg-stone-100 text-stone-800 border-stone-200' };
      case 'bolsa_pesquisa':
        return { label: 'Bolsa P&D', badge: 'bg-stone-100 text-stone-800 border-stone-200' };
      case 'hackathon':
        return { label: 'Hackathon', badge: 'bg-stone-100 text-stone-800 border-stone-200' };
      default:
        return { label: 'Oportunidade', badge: 'bg-stone-100 text-stone-800 border-stone-200' };
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-[#f6faf8] text-stone-500  font-sans text-[10px]  border-b border-stone-200">
            <tr>
              <th className="py-3.5 px-4">Categoria</th>
              <th className="py-3.5 px-4">Edital / Chamada</th>
              <th className="py-3.5 px-3">Financiador</th>
              <th className="py-3.5 px-3">Local (UF)</th>
              <th className="py-3.5 px-3">Inscrições até</th>
              <th className="py-3.5 px-4 text-right">Subvenção / Aporte</th>
              <th className="py-3.5 px-3 text-center">Status</th>
              <th className="py-3.5 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200/80 font-sans">
            {events.map((evt) => {
              const isFav = favorites.includes(evt.id);
              const catConfig = getCategoryConfig(evt.category);

              return (
                <tr
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="hover:bg-stone-100/40 transition-colors cursor-pointer group"
                >
                  {/* Category Type */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`text-[11px] px-2 py-0.5 rounded border ${catConfig.badge}`}>
                      {catConfig.label}
                    </span>
                  </td>

                  {/* Title & Scope */}
                  <td className="py-3 px-4 max-w-[280px]">
                    <div className="font-semibold text-stone-900 group-hover:text-stone-800 transition-colors truncate font-sans">
                      {evt.title}
                    </div>
                    <div className="text-[11px] text-stone-500 truncate mt-0.5 flex items-center gap-1.5">
                      {evt.isContinuousFlow && (
                        <span className="text-emerald-700 font-sans text-[10px] flex items-center gap-1">
                          <Repeat className="w-2.5 h-2.5" />
                          <span>Fluxo Contínuo</span>
                        </span>
                      )}
                      <span>-</span>
                      <span>{evt.resourceOrigin || 'Recurso Público'}</span>
                    </div>
                  </td>

                  {/* Financiador */}
                  <td className="py-3 px-3 whitespace-nowrap text-stone-700 font-medium">
                    {evt.funder || evt.organizer}
                  </td>

                  {/* Location */}
                  <td className="py-3 px-3 whitespace-nowrap font-sans text-[11px] text-stone-500">
                    {evt.location.state === 'Online'
                      ? '100% Remoto'
                      : `${evt.location.city} (${evt.location.state})`}
                  </td>

                  {/* Registration Deadline */}
                  <td className="py-3 px-3 whitespace-nowrap font-sans text-[11px] text-stone-800">
                    {evt.isContinuousFlow ? 'Fluxo Contínuo' : formatDateBR(eventRegistrationDeadline(evt))}
                  </td>

                  {/* Grant / Prize Amount */}
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <span className="font-sans font-semibold text-emerald-700">
                      {evt.prizes.highlight || formatBRL(evt.prizes.totalValue)}
                    </span>
                  </td>

                  {/* Countdown Badge */}
                  <td className="py-3 px-3 whitespace-nowrap text-center">
                    <CountdownBadge deadline={evt.registrationDeadline} showHours={false} />
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleFavorite(evt.id)}
                        className={`p-1.5 rounded border transition-colors cursor-pointer ${
                          isFav
                            ? 'bg-amber-50/40 text-amber-800 border-amber-200/50'
                            : 'text-stone-500 hover:text-stone-900 border-stone-200 hover:bg-stone-100'
                        }`}
                        title="Salvar"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>

                      <a
                        href={evt.registrationUrl || evt.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200 transition-colors cursor-pointer"
                        title="Abrir inscrição oficial"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function eventRegistrationDeadline(evt: TechEvent): string {
  return evt.registrationDeadline;
}
