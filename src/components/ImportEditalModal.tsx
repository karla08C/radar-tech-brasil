import React, { useState } from 'react';
import { X, FileText, Sparkles, Loader2, AlertCircle, Link as LinkIcon, Landmark } from 'lucide-react';
import { TechEvent } from '../types';

interface ImportEditalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventImported: (event: TechEvent) => void;
}

export function ImportEditalModal({ isOpen, onClose, onEventImported }: ImportEditalModalProps) {
  const [rawText, setRawText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim() && !sourceUrl.trim()) {
      setErrorMsg('Por favor, cole o link oficial do edital ou o texto do regulamento.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/events/parse-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: rawText.trim(), sourceUrl: sourceUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha ao processar texto com IA.');
      }

      onEventImported(data.event);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao processar com Gemini AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillExample = () => {
    setRawText(`CHAMADA PÚBLICA FUNCAP / INOVAFIT 2026 - SUBVENÇÃO ECONÔMICA
Inscrições abertas até 30/11/2026.
Recursos globais: R$ 12.000.000,00 destinados a micro e pequenas empresas cearenses de base tecnológica.
Subvenção máxima por projeto: R$ 350.000,00 a fundo perdido.
Áreas prioritárias: GovTech, Inteligência Artificial, Saúde Digital e Energias Renováveis.
Elegibilidade: Empresas com CNPJ ativo no Ceará há mais de 6 meses.`);
    setSourceUrl('https://www.ce.gov.br/funcap/editais');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-lg bg-[#0B0F19] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <Landmark className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Cadastrar / Ingerir Novo Edital
            </h3>
            <p className="text-xs text-slate-400">
              Cole o link oficial ou o texto do edital para extração automática via IA
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleImport} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Texto do Edital ou Resumo
              </label>
              <button
                type="button"
                onClick={fillExample}
                className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
              >
                Preencher exemplo (FUNCAP)
              </button>
            </div>
            <textarea
              rows={5}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Cole aqui trechos do regulamento, edital da FAP, valores de subvenção..."
              className="w-full p-3 rounded-xl bg-[#07090E] border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 font-sans leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
              <LinkIcon className="w-3 h-3 text-cyan-400" />
              <span>Link do Edital ou Portal Oficial</span>
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://finep.gov.br/chamadas-publicas/edital-123"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090E] border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>Extraindo Parâmetros do Edital...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Processar & Cadastrar no Radar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
