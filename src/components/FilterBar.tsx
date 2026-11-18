import { useState } from 'react';
import { Search, SlidersHorizontal, LayoutGrid, Calendar, MapPin, Table, X } from 'lucide-react';
import { EventFilters, MaturityLevel, ResourceOrigin } from '../types';

interface FilterBarProps {
  filters: EventFilters;
  onChange: (filters: EventFilters) => void;
  onReset: () => void;
  totalResultsCount: number;
  viewMode: 'grid' | 'calendar' | 'map' | 'table';
  onChangeViewMode: (mode: 'grid' | 'calendar' | 'map' | 'table') => void;
  mainTab: any;
  onChangeMainTab: (tab: any) => void;
  countEditais?: number;
  countAceleracao?: number;
  countHackathons: number;
  countConferences?: number;
  availableTags?: string[];
}
const MATURITY_OPTIONS: MaturityLevel[] = ['Ideação', 'Validação', 'Tração', 'Crescimento'];
const FUNDER_OPTIONS = ['FUNCAP', 'FINEP', 'CNPq', 'FAPESP', 'SEBRAE', 'FACEPE', 'Banco do Nordeste (BNB)', 'Google for Startups', 'Secitece Ceará', 'Enap / MGI'];
const RESOURCE_ORIGIN_OPTIONS: ResourceOrigin[] = ['Federal', 'Estadual', 'Municipal', 'Privado', 'Internacional'];
const fieldClass = 'mt-1.5 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700';

export function FilterBar({ filters, onChange, onReset, totalResultsCount, viewMode, onChangeViewMode, mainTab, onChangeMainTab, countEditais = 0, countAceleracao = 0, countHackathons = 0, availableTags = [] }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const activeFilterCount = [filters.selectedTag !== 'all', filters.maturity !== 'all', filters.isContinuousFlowOnly, !!filters.deadlineLimit, filters.funder !== 'all', filters.resourceOrigin !== 'all', filters.scope !== 'all', filters.state !== 'all'].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0 || filters.search !== '' || mainTab !== 'all';
  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'editais', label: 'Editais e bolsas', count: countEditais },
    { value: 'aceleracao', label: 'Aceleração', count: countAceleracao },
    { value: 'hackathons', label: 'Hackathons', count: countHackathons },
  ];
  const views = [
    { value: 'grid' as const, label: 'Visualização em Cards', icon: LayoutGrid },
    { value: 'table' as const, label: 'Visualização em Tabela', icon: Table },
    { value: 'map' as const, label: 'Visualização em Mapa', icon: MapPin },
    { value: 'calendar' as const, label: 'Visualização em Calendário', icon: Calendar },
  ];
  return (
    <section aria-label="Buscar e filtrar oportunidades" className="mb-6 space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div role="group" aria-label="Categorias" className="flex min-w-0 gap-1 overflow-x-auto">
          {categories.map(category => <button key={category.value} onClick={() => onChangeMainTab(category.value)} aria-pressed={mainTab === category.value}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-xs transition-colors ${mainTab === category.value ? 'bg-brand-50 font-semibold text-brand-700' : 'text-stone-500 hover:bg-white hover:text-stone-900'}`}>
            {category.label}{category.count !== undefined && <span className="ml-1.5 text-[10px] opacity-60">{category.count}</span>}
          </button>)}
        </div>
        <div role="group" aria-label="Modo de visualização" className="flex shrink-0 gap-1 self-end rounded-md border border-stone-200 bg-white p-0.5 sm:self-auto">
          {views.map(view => <button key={view.value} onClick={() => onChangeViewMode(view.value)} title={view.label} aria-label={view.label} aria-pressed={viewMode === view.value}
            className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${viewMode === view.value ? 'bg-brand-50 text-brand-600' : 'text-stone-400 hover:text-stone-700'}`}><view.icon className="h-3.5 w-3.5" /></button>)}
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input aria-label="Buscar oportunidades" type="search" placeholder="Busque por edital, instituição ou área de interesse" value={filters.search} onChange={e => onChange({ ...filters, search: e.target.value })}
            className="w-full rounded-md border border-stone-200 bg-white py-3 pl-10 pr-9 text-sm text-stone-800 placeholder:text-stone-400" />
          {filters.search && <button onClick={() => onChange({ ...filters, search: '' })} aria-label="Limpar busca" className="absolute right-2 top-1/2 -translate-y-1/2 icon-button"><X className="h-3.5 w-3.5" /></button>}
        </div>
        <button onClick={() => setShowAdvanced(!showAdvanced)} aria-expanded={showAdvanced} aria-controls="advanced-filters" className={`button-secondary ${activeFilterCount > 0 ? 'text-brand-600' : ''}`}>
          <SlidersHorizontal className="h-3.5 w-3.5" />Filtros{activeFilterCount > 0 && <span>({activeFilterCount})</span>}
        </button>
        {hasActiveFilters && <button onClick={onReset} className="button-quiet">Limpar filtros</button>}
      </div>
      {showAdvanced && <div id="advanced-filters" className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs text-stone-500">Financiador<select value={filters.funder || 'all'} onChange={e => onChange({ ...filters, funder: e.target.value })} className={fieldClass}>
          <option value="all">Todos os financiadores</option>{FUNDER_OPTIONS.map(funder => <option key={funder} value={funder}>{funder}</option>)}
        </select></label>
        <label className="text-xs text-stone-500">Estágio do projeto<select value={filters.maturity || 'all'} onChange={e => onChange({ ...filters, maturity: e.target.value as MaturityLevel | 'all' })} className={fieldClass}>
          <option value="all">Todos os estágios</option>{MATURITY_OPTIONS.map(level => <option key={level} value={level}>{level}</option>)}
        </select></label>
        <label className="text-xs text-stone-500">Origem do recurso<select value={filters.resourceOrigin || 'all'} onChange={e => onChange({ ...filters, resourceOrigin: e.target.value as ResourceOrigin | 'all' })} className={fieldClass}>
          <option value="all">Todas as origens</option>{RESOURCE_ORIGIN_OPTIONS.map(origin => <option key={origin} value={origin}>{origin}</option>)}
        </select></label>
        <label className="text-xs text-stone-500">Prazo de inscrição até<input type="date" value={filters.deadlineLimit || ''} onChange={e => onChange({ ...filters, deadlineLimit: e.target.value })} className={fieldClass} /></label>
        <label className="text-xs text-stone-500">Tema ou palavra-chave<select value={filters.selectedTag} onChange={e => onChange({ ...filters, selectedTag: e.target.value })} className={fieldClass}>
          <option value="all">Todos os temas</option>{availableTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </select></label>
        <label className="flex items-center gap-2 self-center text-xs text-stone-700"><input type="checkbox" checked={filters.isContinuousFlowOnly || false} onChange={e => onChange({ ...filters, isContinuousFlowOnly: e.target.checked })} className="accent-brand-600" />Somente fluxo contínuo</label>
      </div>}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-stone-500" aria-live="polite">
        <span><strong className="font-medium text-stone-800">{totalResultsCount}</strong> oportunidades encontradas</span>
        {activeFilterCount > 0 && <span className="flex flex-wrap gap-2 text-[11px]">{filters.state !== 'all' && <span>Estado: {filters.state}</span>}{filters.selectedTag !== 'all' && <span>{filters.selectedTag}</span>}{filters.funder !== 'all' && <span>{filters.funder}</span>}{filters.maturity !== 'all' && <span>{filters.maturity}</span>}</span>}
      </div>
    </section>
  );
}
