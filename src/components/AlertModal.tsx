import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Send, 
  Check, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlertModal({ isOpen, onClose }: AlertModalProps) {
  const [channel, setChannel] = useState<'whatsapp' | 'telegram' | 'email'>('whatsapp');
  const [contact, setContact] = useState('');
  const [selectedStates, setSelectedStates] = useState<string[]>(['CE', 'Online', 'Nacional']);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    'Impacto Social & GovTech',
    'Inteligência Artificial & Dados',
    'SaaS & B2B'
  ]);
  const [onlyGrants, setOnlyGrants] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;

    setLoading(true);
    try {
      await fetch('/api/events/subscribe-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          channel, 
          contact, 
          selectedStates, 
          selectedAreas, 
          onlyGrants 
        }),
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setIsSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleState = (uf: string) => {
    if (selectedStates.includes(uf)) {
      setSelectedStates(selectedStates.filter((s) => s !== uf));
    } else {
      setSelectedStates([...selectedStates, uf]);
    }
  };

  const toggleArea = (area: string) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter((a) => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-7 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Alerta Registrado com Sucesso</h3>
              <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                Você receberá notificações via <strong className="text-slate-900 capitalize">{channel}</strong> ({contact}) quando novos editais da FUNCAP, FINEP ou CNPq forem publicados ou quando restarem 72 horas para submissão.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors mt-2 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Alertas de Editais & Oportunidades
                </h3>
                <p className="text-xs text-slate-500">
                  Avisos automáticos de abertura de chamadas e prazos finais
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Escolha do Canal de Notificação */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Canal de Notificação
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      channel === 'whatsapp'
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('telegram')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      channel === 'telegram'
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      channel === 'email'
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>E-mail</span>
                  </button>
                </div>
              </div>

              {/* Input do Contato */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {channel === 'whatsapp' ? 'Número WhatsApp com DDD' : channel === 'telegram' ? 'Usuário @telegram ou telefone' : 'E-mail institucional ou corporativo'}
                </label>
                <input
                  type={channel === 'email' ? 'email' : 'text'}
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={channel === 'whatsapp' ? '(85) 99999-9999' : channel === 'telegram' ? '@usuario' : 'contato@empresa.com'}
                  className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 px-3.5 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Áreas de Interesse */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Áreas de Foco
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Impacto Social & GovTech',
                    'Inteligência Artificial & Dados',
                    'SaaS & B2B',
                    'Saúde & HealthTech',
                    'AgTech & BioTech',
                    'FinTech'
                  ].map((area) => (
                    <button
                      type="button"
                      key={area}
                      onClick={() => toggleArea(area)}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                        selectedAreas.includes(area)
                          ? 'bg-slate-900 border-slate-900 text-white font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {selectedAreas.includes(area) && <Check className="w-3 h-3" />}
                      <span>{area}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Estados & Abrangência */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Região de Interesse
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['CE', 'Online', 'Nacional', 'PE', 'SP', 'DF'].map((uf) => (
                    <button
                      type="button"
                      key={uf}
                      onClick={() => toggleState(uf)}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                        selectedStates.includes(uf)
                          ? 'bg-slate-900 border-slate-900 text-white font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {selectedStates.includes(uf) && <Check className="w-3 h-3" />}
                      <span>{uf === 'CE' ? 'Ceará' : uf}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro de Fundo Perdido */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={onlyGrants}
                    onChange={(e) => setOnlyGrants(e.target.checked)}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                  />
                  <span>Priorizar capital a fundo perdido (não-reembolsável) e bolsas de P&D</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Processando...</span>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5" />
                    <span>Cadastrar Alertas Gratuitos</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
