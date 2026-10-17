import React, { useState } from 'react';
import { Calendar, MapPin, Trophy, Bookmark, ExternalLink, Share2, Clock, Check, Sparkles, Building2, Tag } from 'lucide-react';
import { TechEvent } from '../types';
import { formatBRL, formatDateRange, getDaysRemaining, getStatusBadge, generateGoogleCalendarUrl, downloadIcsFile } from '../utils/eventUtils';

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

  const status = getStatusBadge(event.registrationDeadline, event.endDate);
  const daysLeft = getDaysRemaining(event.registrationDeadline);
  const isHackathon = event.category === 'hackathon';

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `${isHackathon ? '🚀 Hackathon' : '🎪 Evento'}: ${event.title}\n${isHackathon ? `🏆 Premiação: ${event.prizes.highlight}` : `📍 Local: ${event.location.city} - ${event.location.state}`}\n🗓 Data: ${formatDateRange(event.startDate, event.endDate)}\n👉 Saiba mais: ${event.registrationUrl || event.websiteUrl}`;
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

  const getCategoryLabel = () => {
    switch (event.category) {
      case 'hackathon':
        return '🚀 Hackathon';
      case 'conference':
        return '🎪 Conferência';
      case 'summit':
        return '🌐 Summit Tech';
      case 'bootcamp':
        return '⚡ Imersão / Maratona';
      case 'meetup':
        return '👥 Meetup';
      default:
        return '📌 Evento Tech';
    }
  };

  return (
    <div
      onClick={() => onSelect(event)}
      className="group relative cursor-pointer rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-400/80 hover:shadow-md transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Category badge */}
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${
                isHackathon
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
                  : 'bg-sky-50 text-sky-800 border-sky-200/80'
              }`}
            >
              {getCategoryLabel()}
            </span>

            {/* Modality badge */}
            <span
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-xl border ${
                event.modality === 'online'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                  : event.modality === 'presencial'
                  ? 'bg-amber-50 text-amber-800 border-amber-200/80'
                  : 'bg-purple-50 text-purple-700 border-purple-200/80'
              }`}
            >
              {event.modality === 'online' ? '100% Remoto' : event.modality === 'presencial' ? 'Presencial' : 'Híbrido'}
            </span>

            {/* AI Discovered badge if applicable */}
            {event.isAutomatedDiscovery && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                IA
              </span>
            )}
          </div>

          {/* Favorite toggle button */}
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-xl transition-colors ${
              isFavorite
                ? 'bg-amber-50 text-amber-500 border border-amber-200'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isFavorite ? 'Remover dos favoritos' : 'Salvar evento'}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Dynamic Highlight Box: Prize for Hackathons vs Networking/Tracks for Conferences */}
        {isHackathon ? (
          <div className="my-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                Premiação Total
              </span>
              {event.prizes.totalValue > 0 && (
                <span className="text-sm sm:text-base font-black text-emerald-600 font-mono tracking-tight">
                  {formatBRL(event.prizes.totalValue)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 font-medium mt-1 line-clamp-1 italic">
              "{event.prizes.highlight}"
            </p>
          </div>
        ) : (
          <div className="my-2.5 p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100/80">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                Conferência & Networking
              </span>
              <span className="text-[11px] font-bold text-sky-800">
                {event.location.state === 'Online' ? 'Edição Online' : event.location.city}
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium mt-1 line-clamp-1">
              {event.location.venue ? `📍 ${event.location.venue}` : event.description}
            </p>
          </div>
        )}

        {/* Event Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mt-2">
          {event.title}
        </h3>

        {/* Organizer */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{event.organizer}</span>
        </div>

        {/* Location & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {event.location.state === 'Online'
                ? 'Remoto / Brasil'
                : `${event.location.city} - ${event.location.state}`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{formatDateRange(event.startDate, event.endDate)}</span>
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
              className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/60 transition-colors"
            >
              #{tag}
            </button>
          ))}
          {event.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 px-1 py-0.5">
              +{event.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer / Status & Action Buttons */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        {/* Status Badge */}
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${status.colorClass}`}>
          {daysLeft >= 0 && daysLeft <= 14
            ? `Inscrições até ${event.registrationDeadline.split('-').reverse().slice(0, 2).join('/')}`
            : status.label}
        </span>

        {/* Quick Action Icons */}
        <div className="flex items-center gap-1.5">
          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Copiar resumo e link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          {/* Add to Google Calendar */}
          <button
            onClick={handleCalendar}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Adicionar ao Google Agenda"
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>

          {/* Direct Link */}
          <a
            href={event.registrationUrl || event.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl bg-slate-900 hover:bg-black text-white transition-colors ml-1"
          >
            <span>{isHackathon ? 'Inscrever' : 'Acessar'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
