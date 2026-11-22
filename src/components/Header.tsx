import { Bookmark, Bell, Plus, Radar, ScanLine } from 'lucide-react';

interface HeaderProps {
  isAboutPage: boolean;
  onOpenAiScanner: () => void;
  onOpenImportModal: () => void;
  onOpenAlertModal: () => void;
  favoriteCount: number;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  totalPrizesFormatted: string;
  totalEventsCount: number;
}

export function Header({ isAboutPage, onOpenAiScanner, onOpenImportModal, onOpenAlertModal, favoriteCount, showFavoritesOnly, onToggleFavoritesOnly }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2 sm:px-6">
        <a href="#/" aria-label="Radar Tech Brasil — início" className="flex items-center gap-2 text-sm font-semibold tracking-tight text-stone-900">
          <Radar className="h-5 w-5 text-brand-600" strokeWidth={1.7} />
          <span>Radar Tech <span className="font-normal text-stone-500">Brasil</span></span>
        </a>
        <nav aria-label="Ações principais" className="flex flex-wrap items-center gap-1 sm:gap-2">
          <a href="#/sobre" aria-current={isAboutPage ? 'page' : undefined} className={`button-quiet ${isAboutPage ? 'bg-brand-50 text-brand-700' : ''}`}>Sobre o projeto</a>
          <button onClick={onToggleFavoritesOnly} aria-pressed={showFavoritesOnly} aria-label={`Oportunidades salvas (${favoriteCount})`} className={`button-quiet ${showFavoritesOnly ? 'bg-brand-50 text-brand-700' : ''}`}>
            <Bookmark className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Salvos</span>
            {favoriteCount > 0 && <span className="tabular-nums">{favoriteCount}</span>}
          </button>
          <button onClick={onOpenAiScanner} aria-label="Buscar editais com IA" className="button-quiet">
            <ScanLine className="h-3.5 w-3.5" /><span className="hidden md:inline">Buscar com IA</span>
          </button>
          <button onClick={onOpenImportModal} aria-label="Cadastrar edital" className="button-quiet">
            <Plus className="h-3.5 w-3.5" /><span className="hidden md:inline">Cadastrar</span>
          </button>
          <button onClick={onOpenAlertModal} className="button-primary">
            <Bell className="h-3.5 w-3.5" /><span>Criar alerta</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
