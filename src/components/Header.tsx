import { Sparkles, Bookmark, Landmark, ArrowDownToLine, Bell, PlusCircle, Compass } from 'lucide-react';

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
    <header className="border-b border-white/8 bg-[#0B0E17]/90 backdrop-blur-xl sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo (Taikai Style) */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F2FE] to-[#4FACFE] flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            <span className="text-base tracking-tighter">RT</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white font-sans">
                Radar Tech Brasil
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                Network
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400">
              Plataforma de Desafios, Editais e Inovação Aberta
            </p>
          </div>
        </div>

        {/* Live Ecosystem Metric Badge (Taikai Style) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121624] border border-white/8 text-xs font-mono text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400">Total Fomento:</span>
          <span className="text-white font-sans font-bold text-taikai-gradient">{totalPrizesFormatted}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-sans font-semibold">{totalEventsCount} oportunidades</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Favorites Button */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
              showFavoritesOnly
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-[#121624] text-slate-300 border-white/8 hover:border-white/20 hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Salvos</span>
            {favoriteCount > 0 && (
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-1.5 py-0.2 rounded-md font-bold">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* AI Scanner */}
          <button
            onClick={onOpenAiScanner}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#121624] hover:bg-[#181E31] text-slate-300 hover:text-white border border-white/8 hover:border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Scanner IA</span>
          </button>

          {/* Submit Edital (Taikai Host/Cadastrar) */}
          <button
            onClick={onOpenImportModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#121624] hover:bg-[#181E31] text-slate-300 hover:text-white border border-white/8 hover:border-white/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Cadastrar</span>
          </button>

          {/* Primary CTA (Taikai Gradient Button) */}
          <button
            onClick={onOpenAlertModal}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-taikai-gradient hover:opacity-95 text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.25)] transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Bell className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
            <span>Criar Alerta</span>
          </button>
        </div>
      </div>
    </header>
  );
}
