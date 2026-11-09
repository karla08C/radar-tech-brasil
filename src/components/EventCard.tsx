import React, { useState } from 'react';
import { 
  Bookmark, 
  Share2, 
  Check, 
  MapPin, 
  Repeat,
  ArrowRight,
  Landmark,
  Building
} from 'lucide-react';
import { TechEvent } from '../types';
import { CountdownBadge } from './CountdownBadge';

interface EventCardProps {
  key?: string;
  event: TechEvent;
  onSelect: (event: TechEvent) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onFilterByTag?: (tag: string) => void;
}

export function EventCard({
  event,
  onSelect,
  isFavorite,
  onToggleFavorite,
}: EventCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `Oportunidade: ${event.title}\nFomento: ${event.prizes.highlight}\nFinanciador: ${event.funder || event.organizer}\nPrazo: ${event.registrationDeadline.split('T')[0]}\nAcesse: ${event.registrationUrl || event.websiteUrl}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(event.id);
  };

  const isCeara = event.location.state === 'CE';
  const funderName = event.funder || event.organizer;

  return (
    <div
      onClick={() => onSelect(event)}
      className="group relative cursor-pointer rounded-2xl bg-[#0C0F17]/90 hover:bg-[#111624] border border-white/8 hover:border-violet-500/40 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] overflow-hidden"
    >
      {/* Subtle hover gradient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/0 group-hover:bg-violet-500/5 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />

      <div>
        {/* Top Header: Funder Pill + Status Countdown */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/[0.04] text-slate-300 border border-white/8">
              <Building className="w-3 h-3 text-cyan-400" />
              <span>{funderName}</span>
            </span>

            {isCeara && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                CE
              </span>
            )}
          </div>

          <CountdownBadge deadline={event.registrationDeadline} showHours={false} />
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-[15px] font-semibold text-white tracking-tight leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Financial Value Anchor (The key decision metric) */}
        <div className="my-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/6 group-hover:border-white/10 transition-colors">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Aporte / Subvenção Prevista
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
            {event.prizes.highlight}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>{event.resourceOrigin ? `Recurso ${event.resourceOrigin}` : 'Público'}</span>
            {event.isContinuousFlow ? (
              <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                <Repeat className="w-2.5 h-2.5" />
                <span>Fluxo Contínuo</span>
              </span>
            ) : (
              <span className="text-slate-400 text-[10px] font-mono">
                Até {event.registrationDeadline.split('T')[0]}
              </span>
            )}
          </div>
        </div>

        {/* Location & Modality single line */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="truncate">
            {event.location.state === 'Online'
              ? 'Submissão 100% Online'
              : `${event.location.city} - ${event.location.state}`}
          </span>
          {event.location.scope && (
            <span className="text-slate-500 font-mono text-[10px]">
              • {event.location.scope}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Actions + Direct CTA */}
      <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleFavorite}
            title={isFavorite ? 'Remover dos salvos' : 'Salvar oportunidade'}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              isFavorite
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/6'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            title="Copiar dados"
            className="p-1.5 rounded-lg bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/6 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs font-mono text-cyan-400 group-hover:translate-x-0.5 transition-transform">
          <span>Raio-X do Edital</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
