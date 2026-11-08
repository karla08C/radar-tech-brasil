import { Sparkles, Bookmark, Landmark, ShieldCheck, ArrowDownToLine, Bell } from 'lucide-react';

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
    <header className="border-b border-white/10 bg-[#07090e]/85 backdrop-blur-xl sticky top-0 z-40">
      {/* Top telemetry micro-banner */}
      <div className="bg-[#05070a] border-b border-white/5 py-1.5 px-4 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-400 font-semibold tracking-wider uppercase text-[10px]">
              CIVIC TECH INTELLIGENCE
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              Varredura de editais públicos (FUNCAP, FINEP, CNPq, FAPESP e FAPs estaduais)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>
              <strong className="text-white font-semibold font-sans">{totalPrizesFormatted}</strong>{' '}
              <span className="text-slate-400">em fomento</span>
            </span>
            <span className="text-slate-700">|</span>
            <span>
              <strong className="text-white font-semibold font-sans">{totalEventsCount}</strong>{' '}
              <span className="text-slate-400">chamadas ativas</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Landmark className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-white font-sans">
                Radar Tech Brasil
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                Civic Hub
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400">
              Observatório de Fomento, Aceleração e Inovação Pública
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Favorites Button */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
              showFavoritesOnly
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Salvos</span>
            {favoriteCount > 0 && (
              <span className="bg-white/10 text-slate-200 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* AI Notice Scanner */}
          <button
            onClick={onOpenAiScanner}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Scanner IA</span>
          </button>

          {/* Alertas */}
          <button
            onClick={onOpenAlertModal}
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Criar Alerta</span>
          </button>
        </div>
      </div>
    </header>
  );
}
