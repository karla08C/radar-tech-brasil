import React, { useState } from 'react';
import { 
  Bookmark, 
  Share2, 
  Check, 
  MapPin, 
  Repeat,
  ArrowRight,
  Landmark,
  Rocket,
  GraduationCap,
  Code2,
  Building,
  Banknote
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

  const getCategoryDetails = () => {
    switch (event.category) {
      case 'edital_fomento':
        return {
          bannerClass: 'bg-banner-fomento',
          icon: Landmark,
          badgeText: 'Edital de Fomento',
        };
      case 'aceleracao':
        return {
          bannerClass: 'bg-banner-aceleracao',
          icon: Rocket,
          badgeText: 'Aceleração',
        };
      case 'bolsa_pesquisa':
        return {
          bannerClass: 'bg-banner-bolsas',
          icon: GraduationCap,
          badgeText: 'Bolsa P&D',
        };
      case 'hackathon':
        return {
          bannerClass: 'bg-banner-hackathons',
          icon: Code2,
          badgeText: 'Hackathon',
        };
      default:
        return {
          bannerClass: 'bg-banner-fomento',
          icon: Landmark,
          badgeText: 'Oportunidade',
        };
    }
  };

  const cat = getCategoryDetails();
  const HostIcon = cat.icon;

  return (
    <div
      onClick={() => onSelect(event)}
      className="group cursor-pointer rounded-xl bg-[#121824] hover:bg-[#162030] border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Sober Header Banner */}
        <div className={`h-20 w-full ${cat.bannerClass} p-3 flex items-start justify-between`}>
          {/* Category pill */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700">
              <HostIcon className="w-3 h-3 text-slate-400" />
              <span>{cat.badgeText}</span>
            </span>

            {isCeara && (
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700">
                CE
              </span>
            )}
          </div>

          {/* Status */}
          <CountdownBadge deadline={event.registrationDeadline} showHours={false} />
        </div>

        {/* Content Body */}
        <div className="px-4 pt-0 pb-2">
          {/* Host Avatar & Top Controls */}
          <div className="-mt-6 mb-2 flex items-end justify-between">
            <div className="w-11 h-11 rounded-lg bg-[#0F141F] border border-slate-700 flex items-center justify-center text-slate-300 shadow-xs">
              <HostIcon className="w-5 h-5 text-slate-300" />
            </div>

            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleFavorite}
                title={isFavorite ? 'Remover dos salvos' : 'Salvar oportunidade'}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-950/40 text-amber-300 border-amber-600/50'
                    : 'bg-[#0F141F] text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                title="Copiar dados"
                className="p-1.5 rounded-lg bg-[#0F141F] text-slate-400 hover:text-white border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Funder Name */}
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Building className="w-3 h-3 text-slate-500" />
            <span className="truncate">{funderName}</span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-[15px] font-bold text-white tracking-tight leading-snug font-['Plus_Jakarta_Sans'] group-hover:text-slate-200 transition-colors line-clamp-2 mt-1">
            {event.title}
          </h3>

          {/* Financial Value Box */}
          <div className="my-3 p-3 rounded-lg bg-[#0B0F17] border border-slate-800/80">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1">
                <Banknote className="w-3 h-3 text-slate-400" />
                Subvenção / Aporte
              </span>
              <span className="text-slate-400">{event.resourceOrigin || 'Público'}</span>
            </div>

            <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
              {event.prizes.highlight}
            </div>

            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>{event.location.scope ? `Abrangência ${event.location.scope}` : 'Brasil'}</span>
              {event.isContinuousFlow && (
                <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1 font-medium">
                  <Repeat className="w-2.5 h-2.5" />
                  <span>Fluxo Contínuo</span>
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B0F17] text-slate-400 border border-slate-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-2.5 border-t border-slate-800 bg-[#0F141F] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="truncate">
            {event.location.state === 'Online' ? '100% Remoto' : `${event.location.city} (${event.location.state})`}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
          <span>Ver Raio-X</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}
