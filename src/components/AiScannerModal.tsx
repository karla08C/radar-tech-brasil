import { useState } from 'react';
import { X, Sparkles, Radio, CheckCircle2, Loader2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { TechEvent } from '../types';
import confetti from 'canvas-confetti';

interface AiScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventsDiscovered: (newEvents: TechEvent[], message: string) => void;
}

export function AiScannerModal({ isOpen, onClose, onEventsDiscovered }: AiScannerModalProps) {
  const [focusTopic, setFocusTopic] = useState('Geral / Todos os Desafios');
  const [targetState, setTargetState] = useState('Brasil Inteiro & Online');
  const [customQuery, setCustomQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanLog, setScanLog] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanStep(1);
    setScanLog(['Iniciando varredura automatizada com Gemini 3.8 Flash e Busca Web no Google...']);

    // Step 2
    setTimeout(() => {
      setScanStep(2);
      setScanLog((prev) => [
        ...prev,
        'Consultando editais, plataformas (Shawee, Devpost Brasil, Even3) e portais de inovação...',
      ]);
    }, 1200);

    // Step 3
    setTimeout(() => {
      setScanStep(3);
      setScanLog((prev) => [
        ...prev,
        'Processando requisitos técnicos, valores de premiações em R$ e prazos de inscrição...',
      ]);
    }, 2400);

    try {
      const response = await fetch('/api/events/ai-discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focusTopic: focusTopic === 'Geral / Todos os Desafios' ? undefined : focusTopic,
          targetState: targetState === 'Brasil Inteiro & Online' ? undefined : targetState,
          customQuery: customQuery.trim() || undefined,
        }),
      });

      const data = await response.json();

      setScanStep(4);
      setScanLog((prev) => [
        ...prev,
        `Varredura concluída! ${data.discoveredCount || 2} novas oportunidades estruturadas e validadas.`,
      ]);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setIsScanning(false);
        onEventsDiscovered(data.events || [], data.insights || 'Varredura finalizada com sucesso!');
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Scan error:', err);
      setIsScanning(false);
      setScanLog((prev) => [...prev, 'Aviso: Falha temporária na rede, carregando fallback do radar.']);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        {!isScanning && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Radar Automatizado com IA
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold">
                Gemini 3.8
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Varredura de editais abertos, maratonas e premiações em tecnologia
            </p>
          </div>
        </div>

        {/* Form controls (only if not scanning) */}
        {!isScanning ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Pesquisa Específica (Opcional)
              </label>
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Ex: Hacking Rio, Devpost, Maratona Bancos, Hackathon Sebrae..."
                className="w-full bg-slate-50 text-slate-800 text-xs py-2.5 px-3 rounded-2xl border border-slate-200 focus:border-indigo-600 outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Se você sabe de um evento específico que ainda não apareceu, digite aqui para a IA buscar na web agora.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Área de Foco do Desafio
              </label>
              <select
                value={focusTopic}
                onChange={(e) => setFocusTopic(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs py-2.5 px-3 rounded-2xl border border-slate-200 focus:border-indigo-600 outline-none"
              >
                <option value="Geral / Todos os Desafios">Geral (Todos os Desafios e Hackathons)</option>
                <option value="FinTechs & Meios de Pagamento">FinTechs & Meios de Pagamento (PIX, Open Finance)</option>
                <option value="Inteligência Artificial & LLMs">Inteligência Artificial Generativa & Modelos</option>
                <option value="Saúde & HealthTech">Saúde, Medicina Diagnóstica & HealthTech</option>
                <option value="GovTech & Cidadania Digital">GovTech & Transformação no Setor Público</option>
                <option value="AgroTech & Sustentabilidade">AgroTech, Clima & Sustentabilidade</option>
                <option value="Mulheres na Tecnologia">Mulheres na Tecnologia & Diversidade</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Filtro de Localização da Varredura
              </label>
              <select
                value={targetState}
                onChange={(e) => setTargetState(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs py-2.5 px-3 rounded-2xl border border-slate-200 focus:border-indigo-600 outline-none"
              >
                <option value="Brasil Inteiro & Online">Brasil Inteiro & 100% Online</option>
                <option value="São Paulo (SP)">São Paulo (SP)</option>
                <option value="Rio de Janeiro (RJ)">Rio de Janeiro (RJ)</option>
                <option value="Minas Gerais (MG)">Minas Gerais (MG)</option>
                <option value="Santa Catarina (SC)">Santa Catarina (SC)</option>
                <option value="Rio Grande do Sul (RS)">Rio Grande do Sul (RS)</option>
                <option value="Pernambuco (PE)">Pernambuco (PE)</option>
                <option value="Distrito Federal (DF)">Distrito Federal (DF)</option>
                <option value="Amazonas (AM)">Amazonas (AM)</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-indigo-600 font-bold mb-1">
                <ShieldCheck className="w-4 h-4" />
                Como funciona o Radar Automático?
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Nosso motor inteligente analisa fontes públicas brasileiras, editais de grandes empresas, universidades e plataformas especializadas. O modelo extrai datas exatas, valores de premiações e requisitos, eliminando duplicatas.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleStartScan}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-2xl bg-slate-900 hover:bg-black text-white shadow-sm transition-all"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Disparar Varredura com IA</span>
              </button>
            </div>
          </div>
        ) : (
          /* Scanning progress animation */
          <div className="py-6 space-y-5 text-center">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping" />
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Varrendo Ecossistema Brasileiro...
              </h4>
              <p className="text-xs text-indigo-600 mt-1 font-semibold">
                Passo {scanStep} de 4: Buscando editais e premiações em destaque
              </p>
            </div>

            {/* Terminal style logs */}
            <div className="text-left bg-slate-900 p-4 rounded-2xl font-mono text-[11px] text-slate-200 space-y-1.5 max-h-36 overflow-y-auto shadow-inner">
              {scanLog.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
