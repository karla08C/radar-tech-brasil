import { useEffect, useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Check, 
  ShieldCheck, 
  FileText, 
  Building, 
  Landmark, 
  Rocket, 
  GraduationCap, 
  Code2, 
  Repeat, 
  Coins, 
  Clock, 
  Layers, 
  Award, 
  Users, 
  CheckCircle2,
  Info
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
  const [activeTab, setActiveTab] = useState<'overview' | 'prizes' | 'rules' | 'timeline'>('overview');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Reset to overview tab when a new event is opened
  useEffect(() => {
    setActiveTab('overview');
  }, [event?.id]);

  if (!event) return null;

  const handleShare = () => {
    const shareText = `Oportunidade: ${event.title}\nFomento: ${event.prizes.highlight}\nFinanciador: ${event.funder || event.organizer}\nLocal: ${event.location.city} - ${event.location.state}\nInscrições até: ${formatDateBR(event.registrationDeadline)}\nLink: ${event.registrationUrl || event.websiteUrl}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCeara = event.location.state === 'CE';
  const funderName = event.funder || event.organizer;

  const getCategoryConfig = () => {
    switch (event.category) {
      case 'edital_fomento':
        return { label: 'Edital de Fomento', icon: Landmark, color: 'from-[#00F2FE] to-[#4FACFE]' };
      case 'aceleracao':
        return { label: 'Programa de Aceleração', icon: Rocket, color: 'from-violet-500 to-indigo-600' };
      case 'bolsa_pesquisa':
        return { label: 'Bolsa de P&D', icon: GraduationCap, color: 'from-emerald-400 to-teal-500' };
      case 'hackathon':
        return { label: 'Hackathon / Desafio', icon: Code2, color: 'from-rose-500 to-orange-500' };
      default:
        return { label: 'Oportunidade', icon: Landmark, color: 'from-cyan-400 to-blue-500' };
    }
  };

  const catConfig = getCategoryConfig();
  const HostIcon = catConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#05070A]/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#121624] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Taikai-Style Header Banner */}
        <div className="relative h-28 sm:h-32 w-full bg-gradient-to-r from-[#0C1222] via-[#161F36] to-[#0C1222] p-5 flex items-start justify-between border-b border-white/8">
          <div className="absolute inset-0 bg-taikai-grid opacity-30 pointer-events-none" />

          {/* Category & Status Badges */}
          <div className="relative z-10 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {catConfig.label}
            </span>

            {event.isContinuousFlow ? (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Repeat className="w-2.5 h-2.5" />
                <span>Fluxo Contínuo</span>
              </span>
            ) : (
              <CountdownBadge deadline={event.registrationDeadline} />
            )}

            {isCeara && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                Ceará
              </span>
            )}
          </div>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="relative z-10 p-2 rounded-xl bg-[#0B0E17]/80 hover:bg-[#0B0E17] text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Challenge Main Header Info */}
        <div className="px-6 pt-0 pb-4 border-b border-white/8 bg-[#121624]">
          <div className="-mt-8 mb-3 flex items-end justify-between">
            <div className="w-16 h-16 rounded-2xl bg-[#0B0E17] border-2 border-[#121624] shadow-xl flex items-center justify-center text-cyan-400">
              <HostIcon className="w-8 h-8 text-cyan-400" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(event.id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-[#0B0E17] text-slate-400 hover:text-white border-white/8 hover:border-white/20'
                }`}
                title={isFavorite ? 'Salvo' : 'Salvar oportunidade'}
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-[#0B0E17] hover:bg-[#181E31] text-slate-400 hover:text-white border border-white/8 hover:border-white/20 transition-all cursor-pointer"
                title="Copiar link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-slate-500" />
            <span>{funderName}</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400">{event.location.state === 'Online' ? '100% Remoto' : `${event.location.city} (${event.location.state})`}</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight mt-1">
            {event.title}
          </h2>

          {/* Taikai-Style Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-white/6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 px-1 text-xs font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-cyan-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#00F2FE]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('prizes')}
              className={`pb-2 px-1 text-xs font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                activeTab === 'prizes'
                  ? 'text-cyan-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#00F2FE]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fomento & Recursos
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`pb-2 px-1 text-xs font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                activeTab === 'rules'
                  ? 'text-cyan-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#00F2FE]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Elegibilidade & Regras
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`pb-2 px-1 text-xs font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                activeTab === 'timeline'
                  ? 'text-cyan-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#00F2FE]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cronograma & Prazos
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sobre esta Chamada Pública</span>
                </h4>
                <p className="text-slate-300 leading-relaxed text-[13px]">
                  {event.description}
                </p>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#0B0E17] border border-white/6">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Subvenção / Aporte</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">{event.prizes.highlight}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Financiador</span>
                  <span className="text-xs font-semibold text-slate-200">{funderName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Abrangência</span>
                  <span className="text-xs font-semibold text-cyan-300">{event.location.scope || 'Nacional'}</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Áreas e Tecnologias Focadas
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#0B0E17] border border-white/8 text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prizes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0B0E17] border border-cyan-500/20">
                <div className="flex items-center gap-2 text-cyan-400 mb-1 font-mono text-xs uppercase font-bold">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Montante Global & Estrutura Financeira</span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-400 mt-2">
                  {event.prizes.highlight}
                </div>
                <p className="text-slate-400 mt-1">
                  {event.prizes.description || 'Recursos públicos não-reembolsáveis destinados ao fomento de pesquisa, desenvolvimento e escalabilidade de negócios inovadores.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0B0E17] border border-white/6">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Origem do Recurso</span>
                  <span className="text-sm font-semibold text-slate-200 mt-0.5 block">{event.resourceOrigin || 'Recurso Público'}</span>
                  <p className="text-[11px] text-slate-500 mt-1">Verba orçamentária oficial destinada à ciência, tecnologia e inovação.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0B0E17] border border-white/6">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Estágio Alvo (Maturidade)</span>
                  <span className="text-sm font-semibold text-cyan-300 mt-0.5 block">
                    {event.maturityLevels?.join(', ') || 'Todas as etapas'}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">Compatível com projetos do estágio de validação até tração comercial.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0B0E17] border border-white/6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Critérios de Elegibilidade & CNPJ</span>
                </h4>
                <div className="text-slate-300 space-y-2">
                  <p>• <strong>Quem pode submeter:</strong> {event.eligibility?.whoCanParticipate || 'Startups, microempresas (ME), EPPs, pesquisadores ou grupos organizados.'}</p>
                  {event.eligibility?.teamSize && (
                    <p>• <strong>Formação de Equipe:</strong> {event.eligibility.teamSize}</p>
                  )}
                  {event.eligibility?.requirements && (
                    <div>
                      <p className="mt-2 font-semibold text-slate-200">• Requisitos Obrigatórios do Edital:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-400">
                        {event.eligibility.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0B0E17] border border-white/6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5 font-bold">
                  <Clock className="w-4 h-4" />
                  <span>Prazos de Inscrição & Avaliação</span>
                </h4>
                <div className="space-y-3 mt-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/6">
                    <span className="text-slate-400 font-mono text-[11px]">Prazo Final de Envio:</span>
                    <span className="font-bold text-white font-mono text-sm">
                      {event.isContinuousFlow ? 'Fluxo Contínuo (Sem encerramento fixo)' : formatDateBR(event.registrationDeadline)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/6">
                    <span className="text-slate-400 font-mono text-[11px]">Regime de Submissão:</span>
                    <span className="text-slate-200">{event.isContinuousFlow ? 'Fluxo Contínuo' : 'Edital Periódico'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-mono text-[11px]">Formato:</span>
                    <span className="text-slate-200 capitalize">{event.modality === 'online' ? '100% Remoto' : event.modality}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.open(generateGoogleCalendarUrl(event), '_blank')}
                className="w-full py-2.5 rounded-xl bg-[#0B0E17] hover:bg-[#161D30] text-slate-300 hover:text-white border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer font-medium"
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Salvar Prazo no Google Agenda</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer (Taikai Primary Action) */}
        <div className="p-4 sm:p-5 border-t border-white/8 bg-[#0E121E] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Inscrições diretas no portal do financiador</span>
          </div>

          <a
            href={event.registrationUrl || event.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-taikai-gradient hover:opacity-95 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all active:scale-[0.98]"
          >
            <span>Acessar Edital Oficial & Submissão</span>
            <ExternalLink className="w-4 h-4 text-slate-950" />
          </a>
        </div>
      </div>
    </div>
  );
}
