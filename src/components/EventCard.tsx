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
  Trophy,
  Coins,
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

  // Taikai Banner Patterns & Icon by Category
  const getBannerDetails = () => {
    switch (event.category) {
      case 'edital_fomento':
        return {
          bannerClass: 'bg-pattern-editais',
          icon: Landmark,
          iconColor: 'text-cyan-400',
          badgeText: 'Edital de Fomento',
          badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
        };
      case 'aceleracao':
        return {
          bannerClass: 'bg-pattern-aceleracao',
          icon: Rocket,
          iconColor: 'text-violet-400',
          badgeText: 'Aceleração',
          badgeClass: 'bg-violet-500/20 text-violet-300 border-violet-500/30'
        };
      case 'bolsa_pesquisa':
        return {
          bannerClass: 'bg-pattern-bolsas',
          icon: GraduationCap,
          iconColor: 'text-emerald-400',
          badgeText: 'Bolsa P&D',
          badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        };
      case 'hackathon':
        return {
          bannerClass: 'bg-pattern-hackathons',
          icon: Code2,
          iconColor: 'text-rose-400',
          badgeText: 'Hackathon',
          badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
        };
      default:
        return {
          bannerClass: 'bg-pattern-editais',
          icon: Landmark,
          iconColor: 'text-cyan-400',
          badgeText: 'Oportunidade',
          badgeClass: 'bg-white/10 text-slate-300 border-white/10'
        };
    }
  };

  const banner = getBannerDetails();
  const HostIcon = banner.icon;

  return (
    <div
      onClick={() => onSelect(event)}
      className="group relative cursor-pointer rounded-2xl bg-[#121624] hover:bg-[#151B2C] border border-white/8 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_10px_30px_-5px_rgba(0,242,254,0.15)] flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Taikai-Style Cover Graphic Banner */}
        <div className={`relative h-24 w-full ${banner.bannerClass} p-3 flex items-start justify-between border-b border-white/6 overflow-hidden`}>
          {/* Subtle grid mesh on banner */}
          <div className="absolute inset-0 bg-taikai-grid opacity-30 pointer-events-none" />

          {/* Left pill on banner: Category / Modality */}
          <div className="relative z-10 flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md ${banner.badgeClass}`}>
              <HostIcon className="w-3 h-3" />
              <span>{banner.badgeText}</span>
            </span>

            {isCeara && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                Ceará (CE)
              </span>
            )}
          </div>

          {/* Right pill on banner: Countdown / Status */}
          <div className="relative z-10">
            <CountdownBadge deadline={event.registrationDeadline} showHours={false} />
          </div>
        </div>

        {/* Taikai-Style Host Avatar Squircle overlapping banner */}
        <div className="px-5 pt-0 relative">
          <div className="-mt-6 mb-2.5 flex items-end justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#0B0E17] border-2 border-[#121624] group-hover:border-cyan-500/40 shadow-lg flex items-center justify-center text-cyan-400 transition-colors">
              <HostIcon className={`w-6 h-6 ${banner.iconColor}`} />
            </div>

            {/* Bookmark & Share quick buttons */}
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleFavorite}
                title={isFavorite ? 'Remover dos salvos' : 'Salvar oportunidade'}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-[#0B0E17]/80 text-slate-400 hover:text-white border-white/8 hover:border-white/20'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                title="Copiar link"
                className="p-1.5 rounded-lg bg-[#0B0E17]/80 text-slate-400 hover:text-white border-white/8 hover:border-white/20 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Organizer / Funder name */}
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Building className="w-3 h-3 text-slate-500" />
            <span className="truncate">{funderName}</span>
          </div>

          {/* Challenge Title */}
          <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2 mt-1">
            {event.title}
          </h3>

          {/* Description line */}
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Taikai-Style Prize Pool / Fomento Callout Box */}
          <div className="my-3.5 p-3 rounded-xl bg-[#0B0E17] border border-white/6 group-hover:border-cyan-500/20 transition-colors">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1 text-slate-400">
                <Coins className="w-3 h-3 text-amber-400" />
                Fomento / Aporte Estimado
              </span>
              <span className="text-slate-400">{event.resourceOrigin || 'Público'}</span>
            </div>

            <div className="text-lg font-black font-mono text-emerald-400 mt-1">
              {event.prizes.highlight}
            </div>

            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>{event.location.scope ? `Abrangência ${event.location.scope}` : 'Brasil'}</span>
              {event.isContinuousFlow && (
                <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1 font-semibold">
                  <Repeat className="w-2.5 h-2.5" />
                  <span>Fluxo Contínuo</span>
                </span>
              )}
            </div>
          </div>

          {/* Tags (Skills / Areas) */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0B0E17] text-slate-400 border border-white/6"
              >
                #{tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#0B0E17] text-slate-400">
                +{event.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Bottom Bar (Taikai CTA) */}
      <div className="px-5 py-3 border-t border-white/6 bg-[#0E121E] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="truncate">
            {event.location.state === 'Online' ? '100% Online' : `${event.location.city} (${event.location.state})`}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:translate-x-0.5 transition-transform">
          <span>Ver Desafio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
