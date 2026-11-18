import React, { useState } from 'react';
import { X, Landmark, Sparkles, Loader2, AlertCircle, Link as LinkIcon } from 'lucide-react';
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
      setErrorMsg(err.message || 'Erro ao processar edital.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/35 ">
      <div
        role="dialog" aria-modal="true" aria-label="Cadastrar edital"
        className="relative w-full max-w-lg bg-white border border-stone-200 rounded-xl shadow-xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-500 hover:text-stone-900 border border-stone-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700">
            <Landmark className="w-4 h-4 text-stone-700" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-stone-900 font-sans">
              Cadastrar edital
            </h3>
            <p className="text-xs text-stone-500 font-sans">
              Cole o link oficial ou o texto do edital para extração automática via IA
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50/40 border border-rose-200/50 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleImport} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-stone-500">
                Texto do Edital ou Resumo
              </label>
              <button
                type="button"
                onClick={fillExample}
                className="text-[11px] text-stone-700 hover:text-stone-900 underline cursor-pointer"
              >
                Preencher exemplo (FUNCAP)
              </button>
            </div>
            <textarea
              rows={5}
              aria-label="Texto do edital ou resumo"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Cole aqui trechos do regulamento, edital da FAP, valores de subvenção..."
              className="w-full p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:border-brand-600 font-sans leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[11px] text-stone-500 mb-1 flex items-center gap-1.5">
              <LinkIcon className="w-3 h-3 text-stone-500" />
              <span>Link do Edital ou Portal Oficial</span>
            </label>
            <input
              type="url"
              aria-label="Link do edital ou portal oficial"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://finep.gov.br/chamadas-publicas/edital-123"
              className="w-full px-3.5 py-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:border-brand-600"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 "
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Lendo informações do edital...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Adicionar ao Radar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
