import React, { useState } from 'react';
import { X, FileText, Sparkles, Loader2, CheckCircle2, AlertCircle, Link as LinkIcon } from 'lucide-react';
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
      setErrorMsg('Por favor, cole o link oficial do evento ou o texto do edital/regulamento.');
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
    setRawText(`HACKATHON EMBRAER TECH CHALLENGE 2026
Inscrições abertas de 01/09/2026 até 30/09/2026.
Evento 100% online de 10 a 12 de Outubro de 2026.
Premiação total: R$ 85.000 no PIX para as 3 melhores equipes:
- 1º Lugar: R$ 50.000 + Vaga na fábrica de inovação EmbraerX
- 2º Lugar: R$ 25.000
- 3º Lugar: R$ 10.000
Desafio focado em aviônica inteligente, descarbonização e mobilidade aérea urbana com IA. Aberto para programadores, engenheiros e designers de todo o Brasil.`);
    setSourceUrl('https://embraer.com/inovacao');
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

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Importar Edital / Link com IA
            </h3>
            <p className="text-xs text-slate-500">
              Cole o texto ou edital de um hackathon para extração automática
            </p>
          </div>
        </div>

        <form onSubmit={handleImport} className="space-y-4 text-xs">
          {/* URL Input */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
              Link Oficial da Página ou Inscrição (Opcional)
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://exemplo.com.br/hackathon"
              className="w-full bg-slate-50 text-slate-800 py-2.5 px-3 rounded-2xl border border-slate-200 focus:border-indigo-600 outline-none"
            />
          </div>

          {/* Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold uppercase tracking-wider text-slate-400">
                Texto do Edital, Post ou Regulamento
              </label>
              <button
                type="button"
                onClick={fillExample}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold underline"
              >
                Preencher exemplo
              </button>
            </div>
            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Cole aqui a descrição do evento, datas de inscrição, valores dos prêmios, organizadores, tecnologias ou regras..."
              className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-200 focus:border-indigo-600 outline-none leading-relaxed font-sans"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 font-semibold rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 font-bold rounded-2xl bg-slate-900 hover:bg-black text-white shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Extraindo com IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Estruturar com Gemini</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
