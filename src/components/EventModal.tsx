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
  Building, 
  Landmark, 
  Rocket, 
  GraduationCap, 
  Code2, 
  Repeat, 
  Clock, 
  Banknote,
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
        return { label: 'Edital de Fomento', icon: Landmark };
      case 'aceleracao':
        return { label: 'Programa de Aceleração', icon: Rocket };
      case 'bolsa_pesquisa':
        return { label: 'Bolsa de P&D', icon: GraduationCap };
      case 'hackathon':
        return { label: 'Hackathon / Desafio', icon: Code2 };
      default:
        return { label: 'Oportunidade', icon: Landmark };
    }
  };

  const catConfig = getCategoryConfig();
  const HostIcon = catConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#121824] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sober Header Banner */}
        <div className="h-24 sm:h-28 w-full bg-[#182030] p-4 flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
              {catConfig.label}
            </span>

            {event.isContinuousFlow ? (
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-600/40 flex items-center gap-1">
                <Repeat className="w-2.5 h-2.5" />
                <span>Fluxo Contínuo</span>
              </span>
            ) : (
              <CountdownBadge deadline={event.registrationDeadline} />
            )}

            {isCeara && (
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                Ceará
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Challenge Header Info */}
        <div className="px-5 pt-0 pb-3 border-b border-slate-800 bg-[#121824]">
          <div className="-mt-7 mb-2 flex items-end justify-between">
            <div className="w-14 h-14 rounded-xl bg-[#0B0F17] border-2 border-[#121824] shadow-md flex items-center justify-center text-slate-200">
              <HostIcon className="w-7 h-7 text-slate-200" />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onToggleFavorite(event.id)}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-950/40 text-amber-300 border-amber-600/50'
                    : 'bg-[#0B0F17] text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
                title={isFavorite ? 'Salvo' : 'Salvar oportunidade'}
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-[#0B0F17] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                title="Copiar dados"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-slate-500" />
            <span>{funderName}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">{event.location.state === 'Online' ? '100% Remoto' : `${event.location.city} (${event.location.state})`}</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug font-['Plus_Jakarta_Sans'] mt-1">
            {event.title}
          </h2>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-800/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-1.5 px-0.5 text-xs font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-white border-b-2 border-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('prizes')}
              className={`pb-1.5 px-0.5 text-xs font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'prizes'
                  ? 'text-white border-b-2 border-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fomento & Recursos
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`pb-1.5 px-0.5 text-xs font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'rules'
                  ? 'text-white border-b-2 border-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Elegibilidade & Regras
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`pb-1.5 px-0.5 text-xs font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'timeline'
                  ? 'text-white border-b-2 border-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cronograma & Prazos
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5 font-medium">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sobre esta Chamada Pública</span>
                </h4>
                <p className="text-slate-300 leading-relaxed text-[13px] font-sans">
                  {event.description}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-[#0B0F17] border border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Subvenção / Aporte</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">{event.prizes.highlight}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Financiador</span>
                  <span className="text-xs font-semibold text-slate-200">{funderName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Abrangência</span>
                  <span className="text-xs font-semibold text-slate-200">{event.location.scope || 'Nacional'}</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-medium">
                  Áreas e Tecnologias
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0B0F17] border border-slate-800 text-slate-300"
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
              <div className="p-4 rounded-lg bg-[#0B0F17] border border-slate-800">
                <div className="flex items-center gap-2 text-slate-300 mb-1 font-mono text-xs uppercase font-medium">
                  <Banknote className="w-4 h-4 text-slate-400" />
                  <span>Montante Global & Estrutura Financeira</span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {event.prizes.highlight}
                </div>
                <p className="text-slate-400 mt-1 text-xs">
                  {event.prizes.description || 'Recursos públicos não-reembolsáveis destinados ao fomento de pesquisa, desenvolvimento e escalabilidade de negócios inovadores.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-[#0B0F17] border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Origem do Recurso</span>
                  <span className="text-sm font-semibold text-slate-200 mt-0.5 block">{event.resourceOrigin || 'Recurso Público'}</span>
                  <p className="text-[11px] text-slate-400 mt-1">Verba orçamentária oficial destinada à ciência, tecnologia e inovação.</p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0B0F17] border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Estágio Alvo (Maturidade)</span>
                  <span className="text-sm font-semibold text-slate-200 mt-0.5 block">
                    {event.maturityLevels?.join(', ') || 'Todas as etapas'}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">Compatível com projetos do estágio de validação até tração comercial.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#0B0F17] border border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Critérios de Elegibilidade & CNPJ</span>
                </h4>
                <div className="text-slate-300 space-y-2">
                  <p>- <strong>Quem pode submeter:</strong> {event.eligibility?.whoCanParticipate || 'Startups, microempresas (ME), EPPs, pesquisadores ou grupos organizados.'}</p>
                  {event.eligibility?.teamSize && (
                    <p>- <strong>Formação de Equipe:</strong> {event.eligibility.teamSize}</p>
                  )}
                  {event.eligibility?.requirements && (
                    <div>
                      <p className="mt-2 font-semibold text-slate-200">- Requisitos Obrigatórios do Edital:</p>
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
              <div className="p-4 rounded-lg bg-[#0B0F17] border border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Prazos de Inscrição & Avaliação</span>
                </h4>
                <div className="space-y-3 mt-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400 font-mono text-[11px]">Prazo Final de Envio:</span>
                    <span className="font-bold text-white font-mono text-sm">
                      {event.isContinuousFlow ? 'Fluxo Contínuo' : formatDateBR(event.registrationDeadline)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
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
                className="w-full py-2.5 rounded-lg bg-[#0B0F17] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer font-medium"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Salvar Prazo no Google Agenda</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0F141F] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Inscrições no portal oficial do órgão</span>
          </div>

          <a
            href={event.registrationUrl || event.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Acessar Edital Oficial & Submissão</span>
            <ExternalLink className="w-4 h-4 text-slate-900" />
          </a>
        </div>
      </div>
    </div>
  );
}
