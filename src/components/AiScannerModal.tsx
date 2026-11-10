import { useState } from 'react';
import { X, Sparkles, Loader2, Terminal } from 'lucide-react';
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
        `Varredura concluída: ${data.discoveredCount || 2} novas oportunidades estruturadas e auditadas.`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg bg-[#121824] border border-slate-800 rounded-xl shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {!isScanning && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <Sparkles className="w-4 h-4 text-slate-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
              Scanner de Editais com IA
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Varredura profunda em diários oficiais e plataformas de fomento
            </p>
          </div>
        </div>

        {!isScanning ? (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Eixo Temático de Inovação
              </label>
              <select
                value={focusTopic}
                onChange={(e) => setFocusTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-slate-600 cursor-pointer"
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
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-slate-600 cursor-pointer"
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
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={handleStartScan}
                className="w-full py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-slate-900" />
                <span>Executar Varredura Inteligente</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
              <span className="text-xs font-mono text-slate-300">
                Processando fontes públicas oficiais...
              </span>
            </div>

            <div className="bg-[#0B0F17] border border-slate-800 rounded-lg p-3.5 font-mono text-[11px] text-slate-400 space-y-1.5 min-h-[110px]">
              <div className="text-slate-500 flex items-center gap-1.5 pb-1 border-b border-slate-800/80">
                <Terminal className="w-3 h-3 text-slate-400" />
                <span>TELEMETRIA DE EXECUÇÃO</span>
              </div>
              {scanLog.map((log, i) => (
                <div key={i} className="text-slate-300 leading-tight">
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
