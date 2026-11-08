import { ExternalLink, Bookmark, Landmark, Rocket, GraduationCap, Code2, Repeat } from 'lucide-react';
import { TechEvent } from '../types';
import { formatBRL, formatDateBR, getDaysRemaining } from '../utils/eventUtils';
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
        return { label: 'Edital de Fomento', badge: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30' };
      case 'aceleracao':
        return { label: 'Aceleração', badge: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30' };
      case 'bolsa_pesquisa':
        return { label: 'Bolsa P&D', badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30' };
      case 'hackathon':
        return { label: 'Hackathon', badge: 'bg-violet-950/60 text-violet-300 border-violet-500/30' };
      default:
        return { label: 'Oportunidade', badge: 'bg-slate-900 text-slate-300 border-white/10' };
    }
  };

  return (
    <div className="bg-[#0B0F19]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl mb-6 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#07090E] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
            <tr>
              <th className="py-4 px-5">Categoria</th>
              <th className="py-4 px-5">Edital / Chamada</th>
              <th className="py-4 px-4">Financiador</th>
              <th className="py-4 px-4">Local (UF)</th>
              <th className="py-4 px-4">Inscrições até</th>
              <th className="py-4 px-5 text-right">Subvenção / Aporte</th>
              <th className="py-4 px-4 text-center">Contagem</th>
              <th className="py-4 px-5 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {events.map((evt) => {
              const isFav = favorites.includes(evt.id);
              const catConfig = getCategoryConfig(evt.category);

              return (
                <tr
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  {/* Category Type */}
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${catConfig.badge}`}>
                      {catConfig.label}
                    </span>
                  </td>

                  {/* Title & Scope */}
                  <td className="py-3.5 px-5 max-w-[280px]">
                    <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {evt.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                      {evt.isContinuousFlow && (
                        <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                          <Repeat className="w-2.5 h-2.5" />
                          <span>Fluxo Contínuo</span>
                        </span>
                      )}
                      <span>•</span>
                      <span>{evt.resourceOrigin || 'Recurso Público'}</span>
                    </div>
                  </td>

                  {/* Financiador */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 font-medium">
                    {evt.funder || evt.organizer}
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-400">
                    {evt.location.state === 'Online'
                      ? '100% Online'
                      : `${evt.location.city} (${evt.location.state})`}
                  </td>

                  {/* Registration Deadline */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-200">
                    {evt.isContinuousFlow ? 'Fluxo Contínuo' : formatDateBR(evt.registrationDeadline)}
                  </td>

                  {/* Grant / Prize Amount */}
                  <td className="py-3.5 px-5 whitespace-nowrap text-right">
                    <span className="font-mono font-bold text-emerald-400">
                      {evt.prizes.highlight || formatBRL(evt.prizes.totalValue)}
                    </span>
                  </td>

                  {/* Countdown Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-center">
                    <CountdownBadge deadline={evt.registrationDeadline} showHours={false} />
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-5 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleFavorite(evt.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isFav
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'text-slate-400 hover:text-white border-white/10 hover:bg-white/10'
                        }`}
                        title="Salvar"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>

                      <a
                        href={evt.registrationUrl || evt.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 transition-colors cursor-pointer"
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
