import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Bookmark, 
  ExternalLink, 
  Share2, 
  Check, 
  Building2, 
  ShieldCheck, 
  Landmark,
  Rocket,
  GraduationCap,
  Code2,
  Coins,
  Cloud
} from 'lucide-react';
import { TechEvent } from '../types';
import { generateGoogleCalendarUrl } from '../utils/eventUtils';
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
  onFilterByTag,
}: EventCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `Oportunidade no Radar Tech: ${event.title}\nFomento/Aporte: ${event.prizes.highlight}\nPrazo final: ${event.registrationDeadline.split('T')[0]}\nLocal: ${event.location.city} - ${event.location.state}\nAcesse: ${event.registrationUrl || event.websiteUrl}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(event.id);
  };

  const handleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(generateGoogleCalendarUrl(event), '_blank');
  };

  const getCategoryConfig = () => {
    switch (event.category) {
      case 'edital_fomento':
        return { 
          label: 'Edital de Fomento', 
          icon: Landmark,
          className: 'bg-emerald-50 text-emerald-900 border-emerald-200' 
        };
      case 'aceleracao':
        return { 
          label: 'Aceleração de Startups', 
          icon: Rocket,
          className: 'bg-sky-50 text-sky-900 border-sky-200' 
        };
      case 'bolsa_pesquisa':
        return { 
          label: 'Bolsa de P&D', 
          icon: GraduationCap,
          className: 'bg-indigo-50 text-indigo-900 border-indigo-200' 
        };
      case 'hackathon':
        return { 
          label: 'Hackathon / Desafio', 
          icon: Code2,
          className: 'bg-slate-100 text-slate-800 border-slate-200' 
        };
      default:
        return { 
          label: 'Oportunidade', 
          icon: Landmark,
          className: 'bg-slate-100 text-slate-700 border-slate-200' 
        };
    }
  };

  const categoryConfig = getCategoryConfig();
  const CategoryIcon = categoryConfig.icon;
  const isCeara = event.location.state === 'CE';

  return (
    <div
      onClick={() => onSelect(event)}
      className="group relative cursor-pointer rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all duration-150 p-5 flex flex-col justify-between"
    >
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Category badge */}
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md border ${categoryConfig.className}`}>
              <CategoryIcon className="w-3.5 h-3.5" />
              <span>{categoryConfig.label}</span>
            </span>

            {/* Scope / Ceará badge */}
            {isCeara && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                Ceará
              </span>
            )}

            {/* Funding type */}
            {event.prizes.fundingType === 'nao_reembolsavel' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Não-Reembolsável</span>
              </span>
            )}
            {event.prizes.fundingType === 'equity_free' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
                <span>Equity-Free</span>
              </span>
            )}
            {event.prizes.fundingType === 'creditos_cloud' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                <Cloud className="w-3.5 h-3.5 text-slate-500" />
                <span>Créditos Cloud</span>
              </span>
            )}
          </div>

          <CountdownBadge deadline={event.registrationDeadline} />
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
          {event.title}
        </h3>

        {/* Organizer */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1 mb-3">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{event.organizer}</span>
        </div>

        {/* Financial highlight block */}
        <div className="my-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Aporte / Premiação
              </span>
              <span className="text-sm font-bold text-slate-900">
                {event.prizes.highlight}
              </span>
            </div>

            {event.prizes.hasCounterpart !== undefined && (
              <div className="text-right shrink-0">
                <span className="text-[10px] block text-slate-500 font-medium">Contrapartida</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                  event.prizes.hasCounterpart 
                    ? 'bg-amber-50 text-amber-900 border-amber-200' 
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {event.prizes.hasCounterpart ? `${event.prizes.counterpartPercentage || 5}%` : 'Sem contrapartida'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {event.description}
        </p>

        {/* Location & Modality metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {event.location.city} • <strong className="text-slate-700">{event.location.state}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              Prazo: <strong className="text-slate-800">{event.registrationDeadline.split('T')[0]}</strong>
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {event.tags.slice(0, 3).map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                onFilterByTag?.(tag);
              }}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              #{tag}
            </button>
          ))}
          {event.tags.length > 3 && (
            <span className="text-[11px] text-slate-400 font-medium px-1 self-center">
              +{event.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={handleFavorite}
            title={isFavorite ? 'Remover dos salvos' : 'Salvar oportunidade'}
            className={`p-2 rounded-lg transition-all ${
              isFavorite
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-600 text-amber-600' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            title="Compartilhar"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleCalendar}
            title="Adicionar ao Google Calendar"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>

        <a
          href={event.registrationUrl || event.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all"
        >
          <span>Ver Edital</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
