import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Bookmark, 
  Share2, 
  Check, 
  Landmark,
  Rocket,
  GraduationCap,
  Code2,
  Coins,
  Repeat,
  ShieldCheck,
  Building,
  Target,
  ArrowRight
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
    const shareText = `Oportunidade no Radar Tech: ${event.title}\nFomento/Aporte: ${event.prizes.highlight}\nPrazo final: ${event.registrationDeadline.split('T')[0]}\nFinanciador: ${event.funder || event.organizer}\nLocal: ${event.location.city} - ${event.location.state}\nAcesse: ${event.registrationUrl || event.websiteUrl}`;
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
          badgeClass: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30' 
        };
      case 'aceleracao':
        return { 
          label: 'Aceleração de Startups', 
          icon: Rocket,
          badgeClass: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30' 
        };
      case 'bolsa_pesquisa':
        return { 
          label: 'Bolsa de P&D', 
          icon: GraduationCap,
          badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30' 
        };
      case 'hackathon':
        return { 
          label: 'Hackathon / Desafio', 
          icon: Code2,
          badgeClass: 'bg-violet-950/60 text-violet-300 border-violet-500/30' 
        };
      default:
        return { 
          label: 'Oportunidade', 
          icon: Landmark,
          badgeClass: 'bg-slate-900 text-slate-300 border-white/10' 
        };
    }
  };

  const categoryConfig = getCategoryConfig();
  const CategoryIcon = categoryConfig.icon;
  const isCeara = event.location.state === 'CE';

  return (
    <div
      onClick={() => onSelect(event)}
      className="group relative cursor-pointer rounded-2xl bg-[#0B0F19]/90 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)] p-5 flex flex-col justify-between overflow-hidden"
    >
      {/* Ambient background glow on hover */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/0 group-hover:bg-cyan-500/5 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />

      {/* Top Meta: Category + Countdown Badge */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${categoryConfig.badgeClass}`}>
              <CategoryIcon className="w-3 h-3 shrink-0" />
              <span>{categoryConfig.label}</span>
            </span>

            {event.isContinuousFlow && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                <Repeat className="w-2.5 h-2.5" />
                <span>Fluxo Contínuo</span>
              </span>
            )}
          </div>

          <CountdownBadge deadline={event.registrationDeadline} />
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-white tracking-tight leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Organizer / Financiador & Location */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-400 mt-2">
          <div className="flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium text-slate-300">{event.funder || event.organizer}</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {isCeara ? (
                <strong className="text-cyan-400 font-medium">Ceará (CE)</strong>
              ) : event.location.state === 'Online' ? (
                '100% Online'
              ) : (
                `${event.location.city} - ${event.location.state}`
              )}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Telemetry Highlight: Recurso & Elegibilidade */}
        <div className="mt-4 p-3 rounded-xl bg-[#07090E] border border-white/5 group-hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Subvenção / Aporte:
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {event.prizes.highlight}
            </span>
          </div>

          {/* Secondary specs: Origem + Estágio */}
          <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Origem:{' '}
              <strong className="text-slate-300 font-sans">
                {event.resourceOrigin || 'Pública'}
              </strong>
            </span>
            {event.maturityLevels && event.maturityLevels.length > 0 && (
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/20">
                {event.maturityLevels.join(' • ')}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {event.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              onClick={(e) => {
                if (onFilterByTag) {
                  e.stopPropagation();
                  onFilterByTag(tag);
                }
              }}
              className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-white/5 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-white/5 text-slate-400">
              +{event.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleFavorite}
            title={isFavorite ? 'Remover dos salvos' : 'Salvar oportunidade'}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              isFavorite
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            title="Copiar dados do edital"
            className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleCalendar}
            title="Adicionar ao Google Agenda"
            className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs font-mono text-cyan-400 group-hover:translate-x-0.5 transition-transform">
          <span>Ver Raio-X</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
