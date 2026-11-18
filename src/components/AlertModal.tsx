import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Mail, 
  Send, 
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/35 ">
      <div
        role="dialog" aria-modal="true" aria-label="Configurar alertas"
        className="relative w-full max-w-lg bg-white border border-stone-200 rounded-xl shadow-xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-500 hover:text-stone-900 border border-stone-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50/40 border border-emerald-200/40 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-900 font-sans">Alerta Registrado com Sucesso</h3>
              <p className="text-xs text-stone-500 mt-2 max-w-sm mx-auto leading-relaxed">
                Você receberá notificações via <strong className="text-stone-800 capitalize">{channel}</strong> ({contact}) quando novos editais forem publicados ou quando restarem 72 horas para submissão.
              </p>
            </div>
            <button
              onClick={onClose}
          aria-label="Fechar"
              className="px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold cursor-pointer"
            >
              Concluir
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-stone-900 font-sans">
                  Configurar Alerta de Editais
                </h3>
                <p className="text-[11px] text-stone-500 font-sans">
                  Receba avisos de novos editais e prazos finais
                </p>
              </div>
            </div>

            {/* Canal de Envio */}
            <div>
              <label className="block text-[11px] text-stone-500 mb-1.5">
                Canal de Envio
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  aria-pressed={channel === 'whatsapp'}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    channel === 'whatsapp'
                      ? 'bg-stone-200 text-stone-900 border-stone-300 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('telegram')}
                  aria-pressed={channel === 'telegram'}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    channel === 'telegram'
                      ? 'bg-stone-200 text-stone-900 border-stone-300 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  aria-pressed={channel === 'email'}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    channel === 'email'
                      ? 'bg-stone-200 text-stone-900 border-stone-300 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>E-mail</span>
                </button>
              </div>
            </div>

            {/* Input de Contato */}
            <div>
              <label className="block text-[11px] text-stone-500 mb-1">
                {channel === 'whatsapp' ? 'Número WhatsApp com DDD' : channel === 'telegram' ? 'Usuário ou Chat ID Telegram' : 'Seu E-mail'}
              </label>
              <input
                type={channel === 'email' ? 'email' : 'text'}
                required
                aria-label={channel === 'email' ? 'Seu e-mail' : channel === 'whatsapp' ? 'Número WhatsApp com DDD' : 'Usuário ou Chat ID Telegram'}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={channel === 'whatsapp' ? '(85) 99999-9999' : channel === 'telegram' ? '@usuario_telegram' : 'nome@startup.com'}
                className="w-full px-3.5 py-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:border-brand-600"
              />
            </div>

            {/* Filtros Geográficos */}
            <div>
              <label className="block text-[11px] text-stone-500 mb-1.5">
                Estados Prioritários
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['CE', 'SP', 'PE', 'MG', 'RS', 'Online', 'Nacional'].map((uf) => {
                  const isSelected = selectedStates.includes(uf);
                  return (
                    <button
                      key={uf}
                      type="button"
                      onClick={() => toggleState(uf)}
                      aria-pressed={isSelected}
                      className={`text-xs font-sans px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-stone-200 text-stone-900 border-stone-300 font-semibold'
                          : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      {uf}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Checkbox */}
            <div className="pt-2 border-t border-stone-200">
              <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyGrants}
                  onChange={(e) => setOnlyGrants(e.target.checked)}
                  className="rounded border-stone-200 bg-stone-100 text-stone-800 focus:ring-0"
                />
                <span>Notificar prioritariamente subvenção econômica e fundo perdido</span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors disabled:opacity-75 cursor-pointer "
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
