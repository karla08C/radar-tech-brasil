import { Sparkles, Bookmark, Landmark, ArrowDownToLine, Bell, SlidersHorizontal } from 'lucide-react';

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
    <header className="border-b border-white/8 bg-[#06070B]/80 backdrop-blur-2xl sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600/30 via-cyan-500/20 to-transparent border border-violet-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <Landmark className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-semibold tracking-tight text-white">
                Radar Tech Brasil
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                Civic Tech
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400">
              Observatório de Fomento & Editais Públicos
            </p>
          </div>
        </div>

        {/* Live System Posture Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/8 text-[11px] font-mono text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>SISTEMA ATIVO</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 font-sans">{totalEventsCount} editais</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-sans font-medium">{totalPrizesFormatted}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Favorites Filter */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
              showFavoritesOnly
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-white/[0.04] text-slate-300 border-white/8 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Salvos</span>
            {favoriteCount > 0 && (
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-1.5 py-0.2 rounded-md">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* AI Notice Scanner */}
          <button
            onClick={onOpenAiScanner}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/8 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden sm:inline">Scanner IA</span>
          </button>

          {/* Create Alert CTA */}
          <button
            onClick={onOpenAlertModal}
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-lg shadow-violet-600/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Criar Alerta</span>
          </button>
        </div>
      </div>
    </header>
  );
}
