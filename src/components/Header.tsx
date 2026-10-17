import { useState } from 'react';
import { Sparkles, Bell, FileText, Bookmark, Radio, Trophy, Search } from 'lucide-react';

interface HeaderProps {
  onOpenAiScanner: () => void;
  onOpenImportModal: () => void;
  onOpenAlertModal: () => void;
  favoriteCount: number;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  totalPrizesFormatted: string;
  totalEventsCount: number;
}

export function Header({
  onOpenAiScanner,
  onOpenImportModal,
  onOpenAlertModal,
  favoriteCount,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  totalPrizesFormatted,
  totalEventsCount,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top micro-banner */}
      <div className="bg-slate-50 border-b border-slate-200 py-1.5 px-4 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-indigo-600 font-bold tracking-wide uppercase text-[11px]">
              Radar Automatizado Ativo
            </span>
            <span className="hidden sm:inline text-slate-400">• Monitoramento contínuo de editais e hackathons no Brasil</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{totalPrizesFormatted} em premiações ativas</span>
            </span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline text-slate-600">
              <strong className="text-slate-900 font-bold">{totalEventsCount}</strong> oportunidades mapeadas
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <div className="w-3.5 h-3.5 border-2 border-white rotate-45"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                HACK<span className="text-indigo-600">.BR</span>
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Radar IA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
              Eventos de Tecnologia, Maratonas & Editais
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Favorites toggle */}
          <button
            id="btn-toggle-favorites"
            onClick={onToggleFavoritesOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all border ${
              showFavoritesOnly
                ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Ver meus eventos salvos"
          >
            <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-500 text-amber-500' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Salvos</span>
            {favoriteCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-200 text-amber-900 font-bold">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Import raw edital with AI */}
          <button
            id="btn-import-edital"
            onClick={onOpenImportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
            title="Importar link ou edital com IA"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Importar Edital</span>
            <span className="md:hidden">Importar</span>
          </button>

          {/* Configure Alert */}
          <button
            id="btn-alert-modal"
            onClick={onOpenAlertModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
            title="Configurar Alertas Personalizados"
          >
            <Bell className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden lg:inline">Alertas</span>
          </button>

          {/* AI Scanner Trigger */}
          <button
            id="btn-ai-scanner"
            onClick={onOpenAiScanner}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Varredura com IA</span>
          </button>
        </div>
      </div>
    </header>
  );
}
