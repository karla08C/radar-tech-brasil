import { useEffect, useState } from 'react';
import { 
  X, 
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
import { TechEvent, ApplicationStatus } from '../types';
import { ApplicationStatusSelect } from './ApplicationStatusSelect';
import { formatBRL, formatDateBR } from '../utils/eventUtils';
import { CalendarReminderActions } from './CalendarReminderActions';
import { CountdownBadge } from './CountdownBadge';

interface EventModalProps {
  event: TechEvent | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  applicationStatus?: ApplicationStatus;
  onApplicationStatusChange: (eventId: string, status: ApplicationStatus | '') => void;
}

export function EventModal({ event, onClose, isFavorite, onToggleFavorite, applicationStatus, onApplicationStatusChange }: EventModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/35 overflow-y-auto">
      <div
        role="dialog" aria-modal="true" aria-labelledby="event-dialog-title"
        className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sober Header Banner */}
        <div className="w-full bg-white px-5 py-4 flex items-center justify-between gap-3 border-b border-stone-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-medium  px-2.5 py-0.5 rounded bg-stone-50 text-stone-700 border border-stone-200">
              {catConfig.label}
            </span>

            {event.isContinuousFlow ? (
              <span className="text-[11px] font-medium  px-2.5 py-0.5 rounded bg-emerald-50/40 text-emerald-800 border border-emerald-200/40 flex items-center gap-1">
                <Repeat className="w-2.5 h-2.5" />
                <span>Fluxo Contínuo</span>
              </span>
            ) : (
              <CountdownBadge deadline={event.registrationDeadline} />
            )}

            {isCeara && (
              <span className="text-[11px] font-medium  px-2.5 py-0.5 rounded bg-stone-50 text-stone-700 border border-stone-200">
                Ceará
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-50/80 hover:bg-stone-50 text-stone-500 hover:text-stone-900 border border-stone-200 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Challenge Header Info */}
        <div className="px-5 pt-5 pb-3 border-b border-stone-200 bg-white">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-stone-500">Detalhes da oportunidade</span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onToggleFavorite(event.id)}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-50/40 text-amber-800 border-amber-200/50'
                    : 'bg-[#f6faf8] text-stone-500 hover:text-stone-900 border-stone-200 hover:border-stone-200'
                }`}
                title={isFavorite ? 'Salvo' : 'Salvar oportunidade'}
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-[#f6faf8] hover:bg-stone-100 text-stone-500 hover:text-stone-900 border border-stone-200 hover:border-stone-200 transition-colors cursor-pointer"
                title="Copiar dados"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-xs font-sans font-medium  text-stone-500 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-stone-500" />
            <span>{funderName}</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-700">{event.location.state === 'Online' ? '100% Remoto' : `${event.location.city} (${event.location.state})`}</span>
          </div>

          <h2 id="event-dialog-title" className="text-base sm:text-lg font-semibold text-stone-900 tracking-tight leading-snug font-sans mt-1">
            {event.title}
          </h2>

          <div className="mt-3">
            <ApplicationStatusSelect eventTitle={event.title} status={applicationStatus} onChange={status => onApplicationStatusChange(event.id, status)} />
          </div>
          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-3 mt-3 pt-2 border-t border-stone-200/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-1.5 px-0.5 text-xs font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-brand-600 border-b-2 border-brand-600 font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('prizes')}
              className={`pb-1.5 px-0.5 text-xs font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'prizes'
                  ? 'text-brand-600 border-b-2 border-brand-600 font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Fomento & Recursos
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`pb-1.5 px-0.5 text-xs font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'rules'
                  ? 'text-brand-600 border-b-2 border-brand-600 font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Elegibilidade & Regras
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`pb-1.5 px-0.5 text-xs font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'timeline'
                  ? 'text-brand-600 border-b-2 border-brand-600 font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
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
                <h4 className="text-[11px] font-sans  text-stone-500 mb-1.5 flex items-center gap-1.5 font-medium">
                  <Info className="w-3.5 h-3.5 text-stone-500" />
                  <span>Sobre esta Chamada Pública</span>
                </h4>
                <p className="text-stone-700 leading-relaxed text-[13px] font-sans">
                  {event.description}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-[#f6faf8] border border-stone-200">
                <div>
                  <span className="text-[11px] text-stone-500 block">Subvenção / Aporte</span>
                  <span className="text-sm font-semibold font-sans text-emerald-700">{event.prizes.highlight}</span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-500 block">Financiador</span>
                  <span className="text-xs font-semibold text-stone-800">{funderName}</span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-500 block">Abrangência</span>
                  <span className="text-xs font-semibold text-stone-800">{event.location.scope || 'Nacional'}</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-[11px] font-sans  text-stone-500 mb-2 font-medium">
                  Áreas e Tecnologias
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-sans px-2 py-0.5 rounded bg-[#f6faf8] border border-stone-200 text-stone-700"
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
              <div className="p-4 rounded-lg bg-[#f6faf8] border border-stone-200">
                <div className="flex items-center gap-2 text-stone-700 mb-1 font-sans text-xs  font-medium">
                  <Banknote className="w-4 h-4 text-stone-500" />
                  <span>Montante Global & Estrutura Financeira</span>
                </div>
                <div className="text-2xl font-semibold font-sans text-emerald-700 mt-1">
                  {event.prizes.highlight}
                </div>
                <p className="text-stone-500 mt-1 text-xs">
                  Recursos públicos não-reembolsáveis destinados ao fomento de pesquisa, desenvolvimento e escalabilidade de negócios inovadores.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-[#f6faf8] border border-stone-200">
                  <span className="text-[11px] text-stone-500 block">Origem do Recurso</span>
                  <span className="text-sm font-semibold text-stone-800 mt-0.5 block">{event.resourceOrigin || 'Recurso Público'}</span>
                  <p className="text-[11px] text-stone-500 mt-1">Verba orçamentária oficial destinada à ciência, tecnologia e inovação.</p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#f6faf8] border border-stone-200">
                  <span className="text-[11px] text-stone-500 block">Estágio Alvo (Maturidade)</span>
                  <span className="text-sm font-semibold text-stone-800 mt-0.5 block">
                    {event.maturityLevels?.join(', ') || 'Todas as etapas'}
                  </span>
                  <p className="text-[11px] text-stone-500 mt-1">Compatível com projetos do estágio de validação até tração comercial.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#f6faf8] border border-stone-200">
                <h4 className="text-xs font-sans  text-stone-800 mb-2 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-stone-500" />
                  <span>Critérios de Elegibilidade & CNPJ</span>
                </h4>
                <div className="text-stone-700 space-y-2">
                  <p>- <strong>Quem pode submeter:</strong> {event.targetAudience || 'Startups, microempresas (ME), EPPs, pesquisadores ou grupos organizados.'}</p>
                  {event.eligibilityCriteria && event.eligibilityCriteria.length > 0 && (
                    <div>
                      <p className="mt-2 font-semibold text-stone-800">- Requisitos Obrigatórios do Edital:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-stone-500">
                        {event.eligibilityCriteria.map((req, i) => (
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
              <div className="p-4 rounded-lg bg-[#f6faf8] border border-stone-200">
                <h4 className="text-xs font-sans  text-stone-800 mb-2 flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-stone-500" />
                  <span>Prazos de Inscrição & Avaliação</span>
                </h4>
                <div className="space-y-3 mt-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="text-stone-500 font-sans text-[11px]">Prazo Final de Envio:</span>
                    <span className="font-semibold text-stone-900 font-sans text-sm">
                      {event.isContinuousFlow ? 'Fluxo Contínuo' : formatDateBR(event.registrationDeadline)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="text-stone-500 font-sans text-[11px]">Regime de Submissão:</span>
                    <span className="text-stone-800">{event.isContinuousFlow ? 'Fluxo Contínuo' : 'Edital Periódico'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-sans text-[11px]">Formato:</span>
                    <span className="text-stone-800 capitalize">{event.modality === 'online' ? '100% Remoto' : event.modality}</span>
                  </div>
                </div>
              </div>

              <CalendarReminderActions key={event.id} event={event} />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-stone-500 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Inscrições no portal oficial do órgão</span>
          </div>

          <a
            href={event.registrationUrl || event.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold  transition-colors"
          >
            <span>Acessar Edital Oficial & Submissão</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
