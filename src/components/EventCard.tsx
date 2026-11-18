import { useState, type MouseEvent } from 'react';
import { Bookmark, Share2, Check, ArrowUpRight, MapPin } from 'lucide-react';
import { TechEvent, ApplicationStatus } from '../types';
import { ApplicationStatusSelect } from './ApplicationStatusSelect';
import { CountdownBadge } from './CountdownBadge';

interface EventCardProps {
  key?: string;
  event: TechEvent;
  onSelect: (event: TechEvent) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onFilterByTag?: (tag: string) => void;
  applicationStatus?: ApplicationStatus;
  onApplicationStatusChange: (eventId: string, status: ApplicationStatus | '') => void;
}

const categoryLabels: Record<string, string> = {
  edital_fomento: 'Edital de fomento', aceleracao: 'Aceleração', bolsa_pesquisa: 'Bolsa de pesquisa', hackathon: 'Hackathon',
};

export function EventCard({ event, onSelect, isFavorite, onToggleFavorite, applicationStatus, onApplicationStatusChange }: EventCardProps) {
  const [copied, setCopied] = useState(false);
  const handleShare = async (e: MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`Oportunidade: ${event.title}\nFomento: ${event.prizes.highlight}\nFinanciador: ${event.funder || event.organizer}\nPrazo: ${event.registrationDeadline.split('T')[0]}\nAcesse: ${event.registrationUrl || event.websiteUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { setCopied(false); }
  };

  return (
    <article className="group flex h-full min-w-0 flex-col rounded-lg border border-stone-200 bg-white transition-colors hover:border-brand-600/40">
      <div className="flex items-center justify-between gap-2 px-5 pt-5">
        <span className="text-[11px] font-medium text-brand-600">{categoryLabels[event.category] || 'Oportunidade'}</span>
        {event.isContinuousFlow ? <span className="text-[11px] text-stone-500">Fluxo contínuo</span> : <CountdownBadge deadline={event.registrationDeadline} showHours={false} />}
      </div>
      <div className="flex flex-1 flex-col px-5 pt-4">
        <p className="truncate text-xs text-stone-500">{event.funder || event.organizer}</p>
        <button onClick={() => onSelect(event)} className="mt-1.5 text-left text-[15px] font-semibold leading-relaxed tracking-tight text-stone-900 hover:text-brand-600">
          {event.title}
        </button>
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-stone-500">{event.description}</p>
        <div className="mb-4 mt-auto pt-5">
          <p className="text-[11px] text-stone-500">Aporte ou benefício</p>
          <p className="mt-1 text-sm font-semibold leading-relaxed text-stone-900">{event.prizes.highlight}</p>
        </div>
        <div className="mb-4 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-stone-500">
          {event.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}
        </div>
        <div className="border-t border-stone-100 py-3">
          <ApplicationStatusSelect eventTitle={event.title} status={applicationStatus} onChange={status => onApplicationStatusChange(event.id, status)} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-stone-100 px-5 py-3">
        <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-stone-500"><MapPin className="h-3 w-3 shrink-0" /><span className="truncate">{event.location.state === 'Online' ? 'Remoto' : `${event.location.city}, ${event.location.state}`}</span></span>
        <div className="flex items-center gap-1">
          <button onClick={() => onToggleFavorite(event.id)} aria-label={isFavorite ? `Remover ${event.title} dos salvos` : `Salvar ${event.title}`} aria-pressed={isFavorite} title={isFavorite ? 'Remover dos salvos' : 'Salvar oportunidade'} className={`icon-button ${isFavorite ? 'text-brand-600' : ''}`}><Bookmark className={`h-3.5 w-3.5 ${isFavorite ? 'fill-brand-100' : ''}`} /></button>
          <button onClick={handleShare} aria-label={`Copiar dados de ${event.title}`} title={copied ? 'Copiado' : 'Copiar dados'} className="icon-button">{copied ? <Check className="h-3.5 w-3.5 text-brand-600" /> : <Share2 className="h-3.5 w-3.5" />}</button>
          <button onClick={() => onSelect(event)} aria-label={`Ver detalhes de ${event.title}`} title="Ver detalhes" className="icon-button"><ArrowUpRight className="h-4 w-4" /></button>
        </div>
      </div>
    </article>
  );
}
