import { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Landmark,
  Layers,
  Clock,
  Repeat,
  RotateCcw,
  Building,
  Target,
  Sparkles,
  LayoutGrid,
  Calendar,
  MapPin,
  Table
} from 'lucide-react';
import { 
  EventFilters, 
  MaturityLevel, 
  ResourceOrigin 
} from '../types';

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

const FUNDER_OPTIONS = [
  'FUNCAP',
  'FINEP',
  'CNPq',
  'FAPESP',
  'SEBRAE',
  'FACEPE',
  'Banco do Nordeste (BNB)',
  'Google for Startups',
  'Secitece Ceará',
  'Enap / MGI'
];

const RESOURCE_ORIGIN_OPTIONS: ResourceOrigin[] = [
  'Federal',
  'Estadual',
  'Municipal',
  'Privado',
  'Internacional'
];

export function FilterBar({
  filters,
  onChange,
  onReset,
  totalResultsCount,
  viewMode,
  onChangeViewMode,
  mainTab,
  onChangeMainTab,
  countEditais = 0,
  countAceleracao = 0,
  countHackathons = 0,
  availableTags = [
    'Ceará',
    'FUNCAP',
    'FINEP',
    'Fundo Perdido',
    'Subvenção',
    'GovTech',
    'SaaS',
    'Inteligência Artificial',
  ],
}: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeFilterCount = [
    filters.selectedTag !== 'all',
    filters.maturity !== 'all',
    filters.isContinuousFlowOnly,
    filters.deadlineLimit !== '',
    filters.funder !== 'all',
    filters.resourceOrigin !== 'all',
    filters.scope !== 'all',
    filters.state !== 'all',
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0 || filters.search !== '' || mainTab !== 'all';

  return (
    <div className="bg-[#121824] border border-slate-800 rounded-xl mb-6 p-4 text-slate-200 transition-colors">
      {/* Category Pills & View Switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        {/* Category Pills */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800 overflow-x-auto">
          <button
            onClick={() => onChangeMainTab('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              mainTab === 'all'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas as Oportunidades
          </button>

          <button
            onClick={() => onChangeMainTab('editais')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              mainTab === 'editais'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-slate-300" />
            <span>Editais de Fomento</span>
            {countEditais > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-700 text-slate-200">
                {countEditais}
              </span>
            )}
          </button>

          <button
            onClick={() => onChangeMainTab('aceleracao')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              mainTab === 'aceleracao'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-slate-300" />
            <span>Aceleração</span>
            {countAceleracao > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-700 text-slate-200">
                {countAceleracao}
              </span>
            )}
          </button>

          <button
            onClick={() => onChangeMainTab('hackathons')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              mainTab === 'hackathons'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-300" />
            <span>Hackathons</span>
            {countHackathons > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-700 text-slate-200">
                {countHackathons}
              </span>
            )}
          </button>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800 self-end sm:self-auto">
          <button
            onClick={() => onChangeViewMode('grid')}
            title="Visualização em Cards"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeViewMode('table')}
            title="Visualização em Tabela"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Table className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeViewMode('map')}
            title="Visualização em Mapa"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'map'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeViewMode('calendar')}
            title="Visualização em Calendário"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar + Filter Shortcuts */}
      <div className="mt-3 flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por chamada, órgão ou área (ex: FUNCAP, Inovafit, IA, Subvenção)..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-600 transition-colors font-sans"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              x
            </button>
          )}
        </div>

        {/* Quick Tag Pills */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto">
          {availableTags.slice(0, 4).map((tag) => {
            const isSelected = filters.selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onChange({ ...filters, selectedTag: isSelected ? 'all' : tag })}
                className={`text-[11px] font-mono px-2.5 py-1.5 rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-slate-700 text-white border-slate-600 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

        {/* Advanced Filters Button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              showAdvanced || activeFilterCount > 0
                ? 'bg-slate-800 border-slate-700 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Filtros Detalhados</span>
            {activeFilterCount > 0 && (
              <span className="bg-slate-700 text-slate-200 font-mono text-[10px] px-1.5 py-0.2 rounded font-semibold">
                {activeFilterCount}
              </span>
            )}
            {showAdvanced ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              title="Limpar todos os filtros"
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Drawer */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-150">
          {/* Financiador */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3 h-3 text-slate-400" />
              <span>Financiador</span>
            </label>
            <select
              value={filters.funder || 'all'}
              onChange={(e) => onChange({ ...filters, funder: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-slate-600 cursor-pointer"
            >
              <option value="all">Todos os Financiadores</option>
              {FUNDER_OPTIONS.map((funder) => (
                <option key={funder} value={funder}>
                  {funder}
                </option>
              ))}
            </select>
          </div>

          {/* Maturidade */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Target className="w-3 h-3 text-slate-400" />
              <span>Maturidade do Projeto</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {MATURITY_OPTIONS.map((lvl) => {
                const isSelected = filters.maturity === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => onChange({ ...filters, maturity: isSelected ? 'all' : lvl })}
                    className={`px-2 py-1.5 rounded-md text-[11px] font-medium border transition-colors text-center cursor-pointer ${
                      isSelected
                        ? 'bg-slate-700 text-white border-slate-600 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Origem do Recurso */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-slate-400" />
              <span>Origem do Recurso</span>
            </label>
            <select
              value={filters.resourceOrigin || 'all'}
              onChange={(e) => onChange({ ...filters, resourceOrigin: e.target.value as any })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-slate-600 cursor-pointer"
            >
              <option value="all">Todas as Origens</option>
              {RESOURCE_ORIGIN_OPTIONS.map((orig) => (
                <option key={orig} value={orig}>
                  {orig}
                </option>
              ))}
            </select>
          </div>

          {/* Data Limite & Fluxo Contínuo */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Prazo Máximo de Envio</span>
            </label>
            <input
              type="date"
              value={filters.deadlineLimit || ''}
              onChange={(e) => onChange({ ...filters, deadlineLimit: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-slate-600 mb-2"
            />
            <label className="flex items-center gap-2 p-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={filters.isContinuousFlowOnly || false}
                onChange={(e) => onChange({ ...filters, isContinuousFlowOnly: e.target.checked })}
                className="rounded border-slate-700 bg-slate-800 text-slate-200 focus:ring-0"
              />
              <span className="text-[11px]">Apenas Fluxo Contínuo</span>
            </label>
          </div>
        </div>
      )}

      {/* Active Filter Chips Bar */}
      {activeFilterCount > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-1">
            Filtros Ativos:
          </span>

          {filters.selectedTag !== 'all' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
              #{filters.selectedTag}
              <button onClick={() => onChange({ ...filters, selectedTag: 'all' })} className="cursor-pointer hover:text-white">x</button>
            </span>
          )}

          {filters.funder !== 'all' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
              {filters.funder}
              <button onClick={() => onChange({ ...filters, funder: 'all' })} className="cursor-pointer hover:text-white">x</button>
            </span>
          )}

          {filters.maturity !== 'all' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
              Maturidade: {filters.maturity}
              <button onClick={() => onChange({ ...filters, maturity: 'all' })} className="cursor-pointer hover:text-white">x</button>
            </span>
          )}

          {filters.isContinuousFlowOnly && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
              Fluxo Contínuo
              <button onClick={() => onChange({ ...filters, isContinuousFlowOnly: false })} className="cursor-pointer hover:text-white">x</button>
            </span>
          )}

          {filters.state !== 'all' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
              Estado: {filters.state}
              <button onClick={() => onChange({ ...filters, state: 'all' })} className="cursor-pointer hover:text-white">x</button>
            </span>
          )}

          <button
            onClick={onReset}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-200 ml-auto cursor-pointer"
          >
            Limpar todos
          </button>
        </div>
      )}

      {/* Results counter indicator */}
      <div className="mt-2.5 pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-slate-800/60">
        <span>
          Exibindo <strong className="text-white font-sans">{totalResultsCount}</strong> oportunidades encontradas
        </span>
        <span className="text-slate-500">
          Base atualizada
        </span>
      </div>
    </div>
  );
}
