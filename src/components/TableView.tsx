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
        return { label: 'Edital de Fomento', badge: 'bg-slate-800 text-slate-200 border-slate-700' };
      case 'aceleracao':
        return { label: 'Aceleração', badge: 'bg-slate-800 text-slate-200 border-slate-700' };
      case 'bolsa_pesquisa':
        return { label: 'Bolsa P&D', badge: 'bg-slate-800 text-slate-200 border-slate-700' };
      case 'hackathon':
        return { label: 'Hackathon', badge: 'bg-slate-800 text-slate-200 border-slate-700' };
      default:
        return { label: 'Oportunidade', badge: 'bg-slate-800 text-slate-200 border-slate-700' };
    }
  };

  return (
    <div className="bg-[#121824] border border-slate-800 rounded-xl overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#0B0F17] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
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
          <tbody className="divide-y divide-slate-800/80 font-sans">
            {events.map((evt) => {
              const isFav = favorites.includes(evt.id);
              const catConfig = getCategoryConfig(evt.category);

              return (
                <tr
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  {/* Category Type */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${catConfig.badge}`}>
                      {catConfig.label}
                    </span>
                  </td>

                  {/* Title & Scope */}
                  <td className="py-3 px-4 max-w-[280px]">
                    <div className="font-semibold text-white group-hover:text-slate-200 transition-colors truncate font-['Plus_Jakarta_Sans']">
                      {evt.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                      {evt.isContinuousFlow && (
                        <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                          <Repeat className="w-2.5 h-2.5" />
                          <span>Fluxo Contínuo</span>
                        </span>
                      )}
                      <span>-</span>
                      <span>{evt.resourceOrigin || 'Recurso Público'}</span>
                    </div>
                  </td>

                  {/* Financiador */}
                  <td className="py-3 px-3 whitespace-nowrap text-slate-300 font-medium">
                    {evt.funder || evt.organizer}
                  </td>

                  {/* Location */}
                  <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-400">
                    {evt.location.state === 'Online'
                      ? '100% Remoto'
                      : `${evt.location.city} (${evt.location.state})`}
                  </td>

                  {/* Registration Deadline */}
                  <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-200">
                    {evt.isContinuousFlow ? 'Fluxo Contínuo' : formatDateBR(eventRegistrationDeadline(evt))}
                  </td>

                  {/* Grant / Prize Amount */}
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <span className="font-mono font-bold text-emerald-400">
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
                            ? 'bg-amber-950/40 text-amber-300 border-amber-600/50'
                            : 'text-slate-400 hover:text-white border-slate-700 hover:bg-slate-800'
                        }`}
                        title="Salvar"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>

                      <a
                        href={evt.registrationUrl || evt.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
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
