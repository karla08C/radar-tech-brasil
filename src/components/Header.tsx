import { Sparkles, Bell, Bookmark, Radio, Landmark, Shield } from 'lucide-react';

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
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      {/* Top micro-banner */}
      <div className="bg-slate-900 text-slate-200 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-slate-200 font-semibold tracking-wide uppercase text-[11px]">
              Civic Tech & Fomento à Inovação
            </span>
            <span className="hidden sm:inline text-slate-400">
              • Monitoramento contínuo de editais (FUNCAP, FINEP, CNPq e FAPs estaduais)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-300">
            <span className="text-slate-200">
              <strong className="text-white">{totalPrizesFormatted}</strong> mapeados em fomento e prêmios
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-300">
              <strong className="text-white">{totalEventsCount}</strong> oportunidades ativas
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white">
            <Landmark className="w-5 h-5 text-slate-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900">
                Radar Tech Brasil
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Editais & Fomento
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-500 font-normal">
              Central de chamadas públicas, subvenção econômica e aceleração
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Favorites Button */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
              showFavoritesOnly
                ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-600 text-amber-600' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Salvos</span>
            {favoriteCount > 0 && (
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* AI Notice Scanner */}
          <button
            onClick={onOpenAiScanner}
            className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">Scanner de Editais</span>
            <span className="md:hidden">Scanner</span>
          </button>

          {/* Alerts Trigger */}
          <button
            onClick={onOpenAlertModal}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Alertas de Editais</span>
            <span className="sm:hidden">Alertas</span>
          </button>
        </div>
      </div>
    </header>
  );
}
