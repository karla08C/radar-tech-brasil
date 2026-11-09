import { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Landmark,
  Layers,
  Clock,
  Tag,
  Repeat,
  RotateCcw,
  Building,
  Target,
  Sparkles,
  LayoutGrid,
  Calendar,
  MapPin,
  Table,
  X
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

  // Count active filters (excluding default values)
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
    <div className="bg-[#0C0F17]/90 border border-white/8 rounded-2xl shadow-xl backdrop-blur-xl mb-6 p-4 sm:p-5 text-slate-200 transition-all">
      {/* Level 1: Category Segmented Switcher & View Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/6">
        {/* Category Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/6 overflow-x-auto">
          <button
            onClick={() => onChangeMainTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              mainTab === 'all'
                ? 'bg-white/12 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas as Oportunidades
          </button>

          <button
            onClick={() => onChangeMainTab('editais')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              mainTab === 'editais'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-cyan-400" />
            <span>Editais de Fomento</span>
            {countEditais > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-cyan-500/10 text-cyan-300">
                {countEditais}
              </span>
            )}
          </button>

          <button
            onClick={() => onChangeMainTab('aceleracao')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              mainTab === 'aceleracao'
                ? 'bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-violet-400" />
            <span>Aceleração</span>
            {countAceleracao > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-violet-500/10 text-violet-300">
                {countAceleracao}
              </span>
            )}
          </button>

          <button
            onClick={() => onChangeMainTab('hackathons')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              mainTab === 'hackathons'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hackathons</span>
            {countHackathons > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-300">
                {countHackathons}
              </span>
            )}
          </button>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/6 self-end sm:self-auto">
          <button
            onClick={() => onChangeViewMode('grid')}
            title="Visualização em Cards"
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white/12 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeViewMode('table')}
            title="Visualização em Tabela"
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white/12 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Table className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeViewMode('map')}
            title="Visualização em Mapa Territorial"
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white/12 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeViewMode('calendar')}
            title="Visualização em Calendário"
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-white/12 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Level 2: Command Search Bar + Advanced Filters Button */}
      <div className="mt-3.5 flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por chamada, órgão ou área (ex: FUNCAP, Inovafit, IA, Subvenção)..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-all font-sans"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Filter Tag Shortcuts */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto">
          {availableTags.slice(0, 4).map((tag) => {
            const isSelected = filters.selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onChange({ ...filters, selectedTag: isSelected ? 'all' : tag })}
                className={`text-[11px] font-mono px-2.5 py-1.5 rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                    : 'bg-white/[0.03] border-white/6 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

        {/* Advanced Filters Button with Counter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              showAdvanced || activeFilterCount > 0
                ? 'bg-violet-500/15 border-violet-500/40 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                : 'bg-white/[0.04] border-white/8 text-slate-300 hover:bg-white/[0.08]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros Detalhados</span>
            {activeFilterCount > 0 && (
              <span className="bg-violet-500/30 text-violet-200 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {activeFilterCount}
              </span>
            )}
            {showAdvanced ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              title="Limpar todos os filtros"
              className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/8 hover:border-rose-500/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Level 3: Advanced Filters Drawer (Progressive Disclosure) */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-white/8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
          {/* Financiador */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3 h-3 text-cyan-400" />
              <span>Financiador</span>
            </label>
            <select
              value={filters.funder || 'all'}
              onChange={(e) => onChange({ ...filters, funder: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-white/8 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/80 cursor-pointer"
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
              <Target className="w-3 h-3 text-violet-400" />
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
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'bg-violet-500/20 text-violet-300 border-violet-500/40 font-semibold'
                        : 'bg-[#080B12] border-white/8 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Origem do Recurso & Abrangência */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-emerald-400" />
              <span>Origem do Recurso</span>
            </label>
            <select
              value={filters.resourceOrigin || 'all'}
              onChange={(e) => onChange({ ...filters, resourceOrigin: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-white/8 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/80 cursor-pointer"
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
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Prazo Máximo de Envio</span>
            </label>
            <input
              type="date"
              value={filters.deadlineLimit || ''}
              onChange={(e) => onChange({ ...filters, deadlineLimit: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-[#080B12] border border-white/8 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/80 mb-2"
            />
            <label className="flex items-center gap-2 p-1.5 rounded-lg bg-white/[0.03] border border-white/6 text-xs text-slate-300 cursor-pointer hover:border-white/10">
              <input
                type="checkbox"
                checked={filters.isContinuousFlowOnly || false}
                onChange={(e) => onChange({ ...filters, isContinuousFlowOnly: e.target.checked })}
                className="rounded border-white/20 bg-slate-800 text-cyan-500 focus:ring-cyan-500/30"
              />
              <span className="text-[11px]">Apenas Fluxo Contínuo</span>
            </label>
          </div>
        </div>
      )}

      {/* Active Filter Chips Bar (Shown only if user applied any filter) */}
      {activeFilterCount > 0 && (
        <div className="mt-3 pt-3 border-t border-white/6 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-1">
            Filtros Ativos:
          </span>

          {filters.selectedTag !== 'all' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              #{filters.selectedTag}
              <button onClick={() => onChange({ ...filters, selectedTag: 'all' })} className="cursor-pointer hover:text-white">✕</button>
            </span>
          )}

          {filters.funder !== 'all' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/30">
              {filters.funder}
              <button onClick={() => onChange({ ...filters, funder: 'all' })} className="cursor-pointer hover:text-white">✕</button>
            </span>
          )}

          {filters.maturity !== 'all' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Maturidade: {filters.maturity}
              <button onClick={() => onChange({ ...filters, maturity: 'all' })} className="cursor-pointer hover:text-white">✕</button>
            </span>
          )}

          {filters.isContinuousFlowOnly && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Fluxo Contínuo
              <button onClick={() => onChange({ ...filters, isContinuousFlowOnly: false })} className="cursor-pointer hover:text-white">✕</button>
            </span>
          )}

          {filters.state !== 'all' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Estado: {filters.state}
              <button onClick={() => onChange({ ...filters, state: 'all' })} className="cursor-pointer hover:text-white">✕</button>
            </span>
          )}

          <button
            onClick={onReset}
            className="text-[11px] font-mono text-slate-400 hover:text-rose-300 ml-auto cursor-pointer flex items-center gap-1"
          >
            <span>Limpar todos</span>
          </button>
        </div>
      )}

      {/* Results status indicator */}
      <div className="mt-2.5 pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-white/4">
        <span>
          Exibindo <strong className="text-white font-sans">{totalResultsCount}</strong> editais encontrados
        </span>
        <span className="text-slate-500">
          Atualizado hoje às 09:00 BRT
        </span>
      </div>
    </div>
  );
}
