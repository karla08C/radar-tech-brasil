import { Trophy, ExternalLink, Calendar, MapPin, Bookmark } from 'lucide-react';
import { TechEvent } from '../types';
import { formatBRL, formatDateBR, getDaysRemaining, getStatusBadge } from '../utils/eventUtils';

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

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-4 px-5">Tipo</th>
              <th className="py-4 px-5">Evento / Desafio</th>
              <th className="py-4 px-4">Formato</th>
              <th className="py-4 px-4">Local (UF)</th>
              <th className="py-4 px-4">Data Evento</th>
              <th className="py-4 px-4">Inscrições até</th>
              <th className="py-4 px-5 text-right">Premiação</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-5 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((evt) => {
              const status = getStatusBadge(evt.registrationDeadline, evt.endDate);
              const isFav = favorites.includes(evt.id);
              const isHackathon = evt.category === 'hackathon';

              return (
                <tr
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* Category Type */}
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                        isHackathon
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-sky-50 text-sky-800 border-sky-200'
                      }`}
                    >
                      {isHackathon ? '🚀 Hackathon' : '🎪 Conferência'}
                    </span>
                  </td>

                  {/* Title & Organizer */}
                  <td className="py-3.5 px-5 max-w-[280px]">
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      {evt.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {evt.organizer}
                    </div>
                  </td>

                  {/* Modality */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                        evt.modality === 'online'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                          : evt.modality === 'presencial'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-purple-50 text-purple-700 border-purple-100'
                      }`}
                    >
                      {evt.modality === 'online' ? 'Online' : evt.modality === 'presencial' ? 'Presencial' : 'Híbrido'}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    {evt.location.state === 'Online' ? 'Remoto (BR)' : `${evt.location.city} (${evt.location.state})`}
                  </td>

                  {/* Event Dates */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    {formatDateBR(evt.startDate)}
                  </td>

                  {/* Registration Deadline */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-800">
                    {formatDateBR(evt.registrationDeadline)}
                  </td>

                  {/* Prize Amount */}
                  <td className="py-3.5 px-5 whitespace-nowrap text-right">
                    <span className="font-mono font-extrabold text-emerald-700">
                      {formatBRL(evt.prizes.totalValue)}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${status.colorClass}`}>
                      {status.label}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-5 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleFavorite(evt.id)}
                        className={`p-1.5 rounded-xl border transition-colors ${
                          isFav
                            ? 'bg-amber-50 text-amber-500 border-amber-200'
                            : 'text-slate-400 hover:text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                        title="Salvar"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>

                      <a
                        href={evt.registrationUrl || evt.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold transition-colors"
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
