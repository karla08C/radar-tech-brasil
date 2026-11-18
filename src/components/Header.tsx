import { Sparkles, Bookmark, Landmark, Bell, PlusCircle } from 'lucide-react';

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
    <header className="border-b border-slate-800/80 bg-[#0A0E17]/95 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 border border-emerald-400/30 flex items-center justify-center text-slate-950 shadow-sm shadow-emerald-950/40">
            <Landmark className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                Radar Tech Brasil
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                Civic Tech
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-normal">
              Observatório de Fomento, Subvenção e Inovação Pública
            </p>
          </div>
        </div>

        {/* Live System Posture Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111726] border border-slate-800 text-xs font-mono text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400 uppercase text-[10px] tracking-wider">Monitoramento Ativo:</span>
          <span className="text-slate-200 font-sans font-semibold">{totalEventsCount} editais</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-sans font-bold">{totalPrizesFormatted}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Favorites Button */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showFavoritesOnly
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-xs'
                : 'bg-[#111726] text-slate-300 border-slate-800 hover:bg-[#151D30] hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Salvos</span>
            {favoriteCount > 0 && (
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold border border-amber-500/30">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* AI Scanner */}
          <button
            onClick={onOpenAiScanner}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111726] hover:bg-indigo-950/40 text-indigo-300 hover:text-indigo-200 border border-indigo-500/25 hover:border-indigo-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Scanner IA</span>
          </button>

          {/* Submit Edital */}
          <button
            onClick={onOpenImportModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#111726] hover:bg-[#151D30] text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Cadastrar</span>
          </button>

          {/* Primary CTA (Vivid emerald button with high contrast) */}
          <button
            onClick={onOpenAlertModal}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-950/40"
          >
            <Bell className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
            <span>Criar Alerta</span>
          </button>
        </div>
      </div>
    </header>
  );
}
