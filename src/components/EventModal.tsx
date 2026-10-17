import { useEffect, useState } from 'react';
import { X, Trophy, Calendar, MapPin, Globe, ExternalLink, Bookmark, Share2, Award, Users, CheckCircle2, Clock, Download, Check } from 'lucide-react';
import { TechEvent } from '../types';
import { formatBRL, formatDateRange, formatDateBR, getDaysRemaining, getStatusBadge, generateGoogleCalendarUrl, downloadIcsFile } from '../utils/eventUtils';
import confetti from 'canvas-confetti';

interface EventModalProps {
  event: TechEvent | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function EventModal({ event, onClose, isFavorite, onToggleFavorite }: EventModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  const status = getStatusBadge(event.registrationDeadline, event.endDate);
  const daysLeft = getDaysRemaining(event.registrationDeadline);

  const handleShare = () => {
    const shareText = `🚀 ${event.title}\n🏆 Premiação: ${event.prizes.highlight}\n📍 Formato: ${event.modality === 'online' ? 'Online' : `${event.location.city} - ${event.location.state}`}\n🗓 Inscrições até: ${formatDateBR(event.registrationDeadline)}\n👉 Link: ${event.registrationUrl || event.websiteUrl}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5 pr-10">
          <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-xl bg-slate-100 text-slate-800">
            {event.category === 'hackathon' ? '🚀 Hackathon' : event.category.toUpperCase()}
          </span>

          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            {event.modality === 'online' ? '100% Online' : event.modality === 'presencial' ? 'Presencial' : 'Híbrido'}
          </span>

          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${status.colorClass}`}>
            {status.label}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
          {event.title}
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Organizado por <span className="text-slate-800 font-bold">{event.organizer}</span>
        </p>

        {/* Highlights Banner for Prizes */}
        <div className="my-5 p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-600" />
              Premiação em Destaque
            </span>
            {event.prizes.totalValue > 0 && (
              <span className="text-lg font-black font-mono text-emerald-700">
                {formatBRL(event.prizes.totalValue)}
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-slate-900 mt-1.5 italic">
            "{event.prizes.highlight}"
          </p>

          {/* Breakdown if exists */}
          {event.prizes.breakdown && event.prizes.breakdown.length > 0 && (
            <div className="mt-3 pt-3 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {event.prizes.breakdown.map((item, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                  <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900">{item.place}: </span>
                    <span className="text-slate-700">{item.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Perks list */}
          {event.prizes.perks && event.prizes.perks.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {event.prizes.perks.map((perk, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-amber-200 text-amber-900 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  {perk}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Sobre o Desafio & Oportunidade
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Details Grid: Location, Dates, Audience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Localização & Formato
            </span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                {event.location.state === 'Online'
                  ? '100% Remoto / Brasil'
                  : `${event.location.city} - ${event.location.state}`}
              </span>
            </div>
            {event.location.venue && (
              <p className="text-[11px] text-slate-500 mt-0.5 pl-5">
                {event.location.venue}
              </p>
            )}
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Cronograma do Evento
            </span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{formatDateRange(event.startDate, event.endDate)}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-rose-600 mt-0.5 pl-5 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Inscrições até {formatDateBR(event.registrationDeadline)}</span>
            </div>
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Público-Alvo Recomendado
            </span>
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Users className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{event.targetAudience}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 border border-slate-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {/* Toggle Favorite */}
            <button
              onClick={() => onToggleFavorite(event.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-colors ${
                isFavorite
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isFavorite ? 'Salvo' : 'Salvar'}</span>
            </button>

            {/* Google Calendar */}
            <a
              href={generateGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Google Agenda</span>
            </a>

            {/* ICS Download */}
            <button
              onClick={() => downloadIcsFile(event)}
              className="p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
              title="Baixar arquivo .ICS para Apple/Outlook"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
            </button>
          </div>

          {/* Primary Registration CTA */}
          <a
            href={event.registrationUrl || event.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={triggerCelebration}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all"
          >
            <span>Acessar Edital / Inscrição</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
