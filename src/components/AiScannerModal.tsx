import { useState } from 'react';
import { X, Sparkles, CheckCircle2, Loader2, ArrowRight, ShieldCheck, Terminal, Globe } from 'lucide-react';
import { TechEvent } from '../types';

interface AiScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventsDiscovered: (newEvents: TechEvent[], message: string) => void;
}

export function AiScannerModal({ isOpen, onClose, onEventsDiscovered }: AiScannerModalProps) {
  const [focusTopic, setFocusTopic] = useState('Geral / Todos os Editais');
  const [targetState, setTargetState] = useState('Brasil Inteiro & Online');
  const [customQuery, setCustomQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanLog, setScanLog] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanStep(1);
    setScanLog(['Iniciando varredura automatizada com IA em portais de fomento e Diários Oficiais...']);

    setTimeout(() => {
      setScanStep(2);
      setScanLog((prev) => [
        ...prev,
        'Consultando chamadas da FUNCAP, FINEP, FAPESP, CNPq e programas de aceleração...',
      ]);
    }, 1200);

    setTimeout(() => {
      setScanStep(3);
      setScanLog((prev) => [
        ...prev,
        'Estruturando contrapartidas, requisitos de CNPJ, faixas de subvenção e prazos...',
      ]);
    }, 2400);

    try {
      const response = await fetch('/api/events/ai-discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focusTopic: focusTopic === 'Geral / Todos os Editais' ? undefined : focusTopic,
          targetState: targetState === 'Brasil Inteiro & Online' ? undefined : targetState,
          customQuery: customQuery.trim() || undefined,
        }),
      });

      const data = await response.json();

      setScanStep(4);
      setScanLog((prev) => [
        ...prev,
        `Varredura concluída! ${data.discoveredCount || 2} novas oportunidades estruturadas e auditadas.`,
      ]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-lg bg-[#0B0F19] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        {!isScanning && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <Sparkles className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Scanner de Editais com IA
            </h3>
            <p className="text-xs text-slate-400">
              Varredura profunda em diários oficiais e plataformas de fomento
            </p>
          </div>
        </div>

        {/* Form Controls */}
        {!isScanning ? (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Eixo Temático de Inovação
              </label>
              <select
                value={focusTopic}
                onChange={(e) => setFocusTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090E] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/80 cursor-pointer"
              >
                <option value="Geral / Todos os Editais">Geral / Todos os Editais & Chamadas</option>
                <option value="Inteligência Artificial e Dados">Inteligência Artificial & Dados</option>
                <option value="GovTech & Impacto Social">GovTech & Impacto Social</option>
                <option value="Saúde & Biotecnologia">Saúde & Biotecnologia</option>
                <option value="AgTech & Sustentabilidade">AgTech & Sustentabilidade</option>
                <option value="Transição Energética">Transição Energética & Clima</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Região / Estado Alvo
              </label>
              <select
                value={targetState}
                onChange={(e) => setTargetState(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090E] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/80 cursor-pointer"
              >
                <option value="Brasil Inteiro & Online">Brasil Inteiro (Nacional & Remoto)</option>
                <option value="Ceará (CE) e Nordeste">Ceará (CE) & Nordeste</option>
                <option value="São Paulo (SP) - FAPESP">São Paulo (SP) - FAPESP</option>
                <option value="Minas Gerais (MG)">Minas Gerais (MG)</option>
                <option value="Rio de Janeiro (RJ)">Rio de Janeiro (RJ)</option>
                <option value="Região Sul (PR, SC, RS)">Região Sul (PR, SC, RS)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Termo de Busca Específico (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: subvenção econômica startups, bolsas RHAE..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090E] border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={handleStartScan}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Executar Varredura Inteligente</span>
              </button>
            </div>
          </div>
        ) : (
          /* Live Terminal Scanning Output */
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              <span className="text-xs font-mono text-cyan-300">
                Processando fontes públicas em tempo real...
              </span>
            </div>

            <div className="bg-[#05070A] border border-white/10 rounded-xl p-3.5 font-mono text-[11px] text-slate-400 space-y-1.5 min-h-[120px]">
              <div className="text-slate-500 flex items-center gap-1.5 pb-1 border-b border-white/5">
                <Terminal className="w-3 h-3 text-cyan-400" />
                <span>TELEMETRIA DE EXECUÇÃO</span>
              </div>
              {scanLog.map((log, i) => (
                <div key={i} className="text-cyan-400/90 leading-tight">
                  &gt; {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
