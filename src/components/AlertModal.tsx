import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Mail, 
  MessageSquare, 
  Send, 
  Check, 
  ShieldCheck,
  Smartphone
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-lg bg-[#0B0F19] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Alerta Registrado com Sucesso</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                Você receberá notificações via <strong className="text-cyan-300 capitalize">{channel}</strong> ({contact}) quando novos editais da FUNCAP, FINEP ou CNPq forem publicados ou quando restarem 72 horas para submissão.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Concluir
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Configurar Alerta de Editais
                </h3>
                <p className="text-[11px] text-slate-400">
                  Receba avisos instantâneos de novos editais e prazos finais
                </p>
              </div>
            </div>

            {/* Canal de Notificação */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Canal de Envio
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    channel === 'whatsapp'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                      : 'bg-[#07090E] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('telegram')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    channel === 'telegram'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : 'bg-[#07090E] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    channel === 'email'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.15)]'
                      : 'bg-[#07090E] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>E-mail</span>
                </button>
              </div>
            </div>

            {/* Input de Contato */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                {channel === 'whatsapp' ? 'Número WhatsApp com DDD' : channel === 'telegram' ? 'Usuário ou Chat ID Telegram' : 'Seu E-mail'}
              </label>
              <input
                type={channel === 'email' ? 'email' : 'text'}
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={channel === 'whatsapp' ? '(85) 99999-9999' : channel === 'telegram' ? '@usuario_telegram' : 'nome@startup.com'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090E] border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>

            {/* Filtros Geográficos */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Estados & Abrangência Prioritários
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['CE', 'SP', 'PE', 'MG', 'RS', 'Online', 'Nacional'].map((uf) => {
                  const isSelected = selectedStates.includes(uf);
                  return (
                    <button
                      key={uf}
                      type="button"
                      onClick={() => toggleState(uf)}
                      className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                          : 'bg-[#07090E] border-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {uf}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Checkbox Apenas Fomento a Fundo Perdido */}
            <div className="pt-2 border-t border-white/10">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyGrants}
                  onChange={(e) => setOnlyGrants(e.target.checked)}
                  className="rounded border-white/20 bg-slate-800 text-cyan-500 focus:ring-cyan-500/30"
                />
                <span>Notificar prioritariamente subvenção econômica e fundo perdido</span>
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-75 cursor-pointer"
              >
                {loading ? 'Registrando...' : 'Ativar Monitoramento'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
