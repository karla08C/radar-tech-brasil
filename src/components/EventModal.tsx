import { useEffect, useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Award, 
  Users, 
  CheckCircle2, 
  Clock, 
  Check,
  ShieldCheck,
  FileText,
  Building2,
  Landmark,
  Rocket,
  GraduationCap,
  Code2
} from 'lucide-react';
import { TechEvent } from '../types';
import { formatBRL, formatDateRange, formatDateBR, generateGoogleCalendarUrl } from '../utils/eventUtils';
import { CountdownBadge } from './CountdownBadge';

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

  const handleShare = () => {
    const shareText = `Oportunidade: ${event.title}\nFomento/Aporte: ${event.prizes.highlight}\nLocal: ${event.location.city} - ${event.location.state}\nInscrições até: ${formatDateBR(event.registrationDeadline)}\nLink: ${event.registrationUrl || event.websiteUrl}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCeara = event.location.state === 'CE';

  const getCategoryLabel = () => {
    switch (event.category) {
      case 'edital_fomento':
        return 'Edital de Fomento';
      case 'aceleracao':
        return 'Aceleração de Startups';
      case 'bolsa_pesquisa':
        return 'Bolsa de P&D';
      case 'hackathon':
        return 'Hackathon / Desafio';
      default:
        return 'Oportunidade';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-7 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Badges & Countdown */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pr-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-900 text-white">
              {getCategoryLabel()}
            </span>

            {isCeara && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                Ceará
              </span>
            )}

            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              {event.modality === 'online' ? '100% Online' : event.modality === 'presencial' ? 'Presencial' : 'Híbrido'}
            </span>
          </div>

          <CountdownBadge deadline={event.registrationDeadline} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-slate-900 leading-snug">
          {event.title}
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5 font-medium">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span>Órgão / Organizador: <strong className="text-slate-800">{event.organizer}</strong></span>
        </div>

        {/* Financial Highlights */}
        <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Aporte / Fomento por Proposta
              </span>
              <span className="text-base font-bold text-slate-900">
                {event.prizes.highlight}
              </span>
            </div>

            {event.prizes.totalValue > 0 && (
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Orçamento Global</span>
                <span className="text-xs font-bold text-slate-700">
                  {formatBRL(event.prizes.totalValue)}
                </span>
              </div>
            )}
          </div>

          {/* Breakdown if exists */}
          {event.prizes.breakdown && event.prizes.breakdown.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {event.prizes.breakdown.map((item, i) => (
                <div key={i} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                  <Award className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">{item.place}: </span>
                    <span className="text-slate-600">{item.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Perks list */}
          {event.prizes.perks && event.prizes.perks.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
              {event.prizes.perks.map((perk, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  {perk}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Raio-X de Elegibilidade */}
        {event.eligibilityCriteria && event.eligibilityCriteria.length > 0 && (
          <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span>Critérios de Elegibilidade</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {event.eligibilityCriteria.map((criterion, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Description */}
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Descrição do Edital / Programa
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Details Grid: Location, Dates, Audience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Abrangência Territorial
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>
                {event.location.city} • {event.location.state} ({event.location.region})
              </span>
            </div>
            {event.location.venue && (
              <p className="text-[11px] text-slate-500 mt-0.5 pl-5">
                Plataforma: {event.location.venue}
              </p>
            )}
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Cronograma de Submissão
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{formatDateRange(event.startDate, event.endDate)}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-0.5 pl-5 font-medium">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Prazo final: {formatDateBR(event.registrationDeadline)}</span>
            </div>
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Público-Alvo
            </span>
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{event.targetAudience}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                isFavorite
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-600 text-amber-600' : ''}`} />
              <span>{isFavorite ? 'Salvo' : 'Salvar'}</span>
            </button>

            {/* Google Calendar */}
            <a
              href={generateGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Google Calendar</span>
            </a>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Compartilhar'}</span>
            </button>
          </div>

          {/* Primary CTA */}
          <div className="flex items-center gap-2">
            {event.officialNoticePdfUrl && (
              <a
                href={event.officialNoticePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Edital Completo</span>
              </a>
            )}

            <a
              href={event.registrationUrl || event.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              <span>Acessar Inscrição</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
