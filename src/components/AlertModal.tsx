import React, { useState } from 'react';
import { X, Bell, CheckCircle2, ShieldCheck, Mail, Trophy, MapPin } from 'lucide-react';
import { BRAZILIAN_STATES } from '../data/initialEvents';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlertModal({ isOpen, onClose }: AlertModalProps) {
  const [email, setEmail] = useState('');
  const [minPrize, setMinPrize] = useState(20000);
  const [onlyHackathons, setOnlyHackathons] = useState(true);
  const [selectedStates, setSelectedStates] = useState<string[]>(['SP', 'RJ', 'Online']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await fetch('/api/events/subscribe-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, minPrize, onlyHackathons, selectedStates }),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Alerta Ativado com Sucesso!</h3>
              <p className="text-xs text-slate-600 mt-1.5 max-w-sm mx-auto leading-relaxed">
                Enviaremos notificações para <strong className="text-indigo-600">{email}</strong> sempre que um novo hackathon ou edital com premiação acima de <strong>R$ {minPrize.toLocaleString('pt-BR')}</strong> for mapeado pelo RadarTech.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-colors"
            >
              Concluir
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  Criar Alerta de Novos Hackathons
                </h3>
                <p className="text-xs text-slate-500">
                  Receba avisos instantâneos de editais com grandes premiações
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  Seu E-mail para Notificações
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@desenvolvedor.com.br"
                  className="w-full bg-slate-50 text-slate-800 py-2.5 px-3.5 rounded-2xl border border-slate-200 focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  Premiação Mínima para Notificar
                </label>
                <select
                  value={minPrize}
                  onChange={(e) => setMinPrize(Number(e.target.value))}
                  className="w-full bg-slate-50 text-slate-800 font-semibold py-2.5 px-3.5 rounded-2xl border border-slate-200 focus:border-indigo-600 outline-none"
                >
                  <option value={0}>Qualquer valor (inclusive sem prêmio)</option>
                  <option value={10000}>A partir de R$ 10.000</option>
                  <option value={30000}>A partir de R$ 30.000</option>
                  <option value={50000}>Apenas Grandes Maratonas (R$ 50.000+)</option>
                  <option value={100000}>Exclusivo Elite (R$ 100.000+)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  Regiões de Interesse
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => toggleState('Online')}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                      selectedStates.includes('Online')
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    100% Online
                  </button>
                  {BRAZILIAN_STATES.slice(0, 10).map((st) => (
                    <button
                      key={st.uf}
                      type="button"
                      onClick={() => toggleState(st.uf)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                        selectedStates.includes(st.uf)
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st.uf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 font-semibold rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 font-bold rounded-2xl bg-slate-900 hover:bg-black text-white shadow-sm transition-all"
                >
                  {loading ? 'Cadastrando...' : 'Salvar Alerta'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
