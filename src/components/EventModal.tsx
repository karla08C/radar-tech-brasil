import { useEffect, useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Award, 
  CheckCircle2, 
  Clock, 
  Check,
  ShieldCheck,
  FileText,
  Building,
  Landmark,
  Rocket,
  GraduationCap,
  Code2,
  Repeat,
  Target,
  Coins
} from 'lucide-react';
import { TechEvent } from '../types';
import { formatBRL, formatDateBR, generateGoogleCalendarUrl } from '../utils/eventUtils';
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
    const shareText = `Oportunidade: ${event.title}\nFomento/Aporte: ${event.prizes.highlight}\nFinanciador: ${event.funder || event.organizer}\nLocal: ${event.location.city} - ${event.location.state}\nInscrições até: ${formatDateBR(event.registrationDeadline)}\nLink: ${event.registrationUrl || event.websiteUrl}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCeara = event.location.state === 'CE';

  const getCategoryLabel = () => {
    switch (event.category) {
      case 'edital_fomento':
        return 'Edital de Fomento Público';
      case 'aceleracao':
        return 'Programa de Aceleração';
      case 'bolsa_pesquisa':
        return 'Bolsa de P&D Tecnológico';
      case 'hackathon':
        return 'Hackathon & Desafio de Inovação';
      default:
        return 'Oportunidade';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#0B0F19] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-7 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Badges & Countdown */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pr-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
              {getCategoryLabel()}
            </span>

            {event.isContinuousFlow && (
              <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Repeat className="w-3 h-3" />
                <span>Fluxo Contínuo</span>
              </span>
            )}

            {isCeara && (
              <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
                Ceará Tech
              </span>
            )}
          </div>

          <CountdownBadge deadline={event.registrationDeadline} />
        </div>

        {/* Title & Organization */}
        <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-tight">
          {event.title}
        </h2>

        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-400 mt-2">
          <div className="flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium text-slate-300">{event.funder || event.organizer}</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {event.location.state === 'Online'
                ? 'Submissão 100% Online'
                : `${event.location.city} - ${event.location.state}`}
            </span>
          </div>
          {event.location.scope && (
            <>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-[11px] text-cyan-400">
                Abrangência {event.location.scope}
              </span>
            </>
          )}
        </div>

        {/* Telemetry Grid (Specs do Edital) */}
        <div className="my-5 p-4 rounded-xl bg-[#07090E] border border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
              Subvenção / Aporte
            </span>
            <span className="text-base font-bold font-mono text-emerald-400 mt-0.5 block">
              {event.prizes.highlight}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
              Origem do Recurso
            </span>
            <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
              {event.resourceOrigin || 'Pública'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
              Maturidade Alvo
            </span>
            <span className="text-xs font-mono text-cyan-300 mt-0.5 block">
              {event.maturityLevels?.join(', ') || 'Todas as etapas'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
              Prazo de Inscrição
            </span>
            <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
              {event.isContinuousFlow ? 'Fluxo Contínuo' : formatDateBR(event.registrationDeadline)}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
              Formato
            </span>
            <span className="text-xs font-semibold text-slate-200 mt-0.5 block capitalize">
              {event.modality === 'online' ? '100% Remoto' : event.modality}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
              Taxa de Submissão
            </span>
            <span className="text-xs font-semibold text-emerald-400 mt-0.5 block">
              Gratuita (Edital Público)
            </span>
          </div>
        </div>

        {/* Description / Resumo */}
        <div className="mb-5">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            Resumo da Chamada Pública
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Elegibilidade & Diretrizes */}
        {event.eligibility && (
          <div className="mb-5 p-4 rounded-xl bg-white/5 border border-white/5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Critérios de Elegibilidade & Requisitos</span>
            </h4>
            <div className="text-xs text-slate-300 space-y-1">
              <p>• <strong>Público:</strong> {event.eligibility.whoCanParticipate || 'Startups, pesquisadores e empresas inovadoras'}</p>
              {event.eligibility.teamSize && <p>• <strong>Equipe:</strong> {event.eligibility.teamSize}</p>}
              {event.eligibility.requirements && (
                <div>
                  <p className="mt-1 font-semibold text-slate-300">• Diretrizes do Edital:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-400">
                    {event.eligibility.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onToggleFavorite(event.id)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isFavorite ? 'Salvo' : 'Salvar'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              onClick={() => window.open(generateGoogleCalendarUrl(event), '_blank')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agenda</span>
            </button>
          </div>

          {/* Primary Action Button */}
          <a
            href={event.registrationUrl || event.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
          >
            <span>Acessar Edital Oficial & Submissão</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
