import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Check,
  Landmark,
  ShieldCheck,
  Layers,
  Clock,
  Compass,
  Tag,
  Repeat,
  RotateCcw,
  Building,
  Target
} from 'lucide-react';
import { 
  EventFilters, 
  EventModality, 
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
  countConferences = 0,
  availableTags = [
    'Ceará',
    'FUNCAP',
    'FINEP',
    'Fundo Perdido',
    'Subvenção',
    'GovTech',
    'SaaS',
    'Inteligência Artificial',
    'Bolsas P&D',
    'Saúde',
    'AgTech',
    'FinTech',
    'PIPE'
  ],
}: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.modality !== 'all' ||
    filters.region !== 'all' ||
    filters.state !== 'all' ||
    filters.hasCashPrizeOnly ||
    filters.minPrizeValue > 0 ||
    filters.timeframe !== 'all' ||
    filters.selectedTag !== 'all' ||
    (filters.fundingType && filters.fundingType !== 'all') ||
    (filters.maturity && filters.maturity !== 'all') ||
    Boolean(filters.isContinuousFlowOnly) ||
    Boolean(filters.deadlineLimit) ||
    (filters.funder && filters.funder !== 'all') ||
    (filters.resourceOrigin && filters.resourceOrigin !== 'all') ||
    (filters.scope && filters.scope !== 'all');

  const update = (partial: Partial<EventFilters>) => {
    onChange({ ...filters, ...partial });
  };

  const totalAll = countHackathons + ((countEditais + countAceleracao) || countConferences);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-xs">
      {/* 1. Category Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {/* Todas */}
          <button
            onClick={() => onChangeMainTab('all')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              mainTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Todas as Oportunidades</span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
              mainTab === 'all' ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/60 text-slate-600'
            }`}>
              {totalAll}
            </span>
          </button>

          {/* Editais de Fomento */}
          <button
            onClick={() => onChangeMainTab('editais')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              mainTab === 'editais'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Editais FAPs / FINEP</span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
              mainTab === 'editais' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/60 text-slate-600'
            }`}>
              {countEditais || countConferences}
            </span>
          </button>

          {/* Aceleração */}
          <button
            onClick={() => onChangeMainTab('aceleracao')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              mainTab === 'aceleracao'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Aceleração de Startups</span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
              mainTab === 'aceleracao' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/60 text-slate-600'
            }`}>
              {countAceleracao}
            </span>
          </button>

          {/* Hackathons */}
          <button
            onClick={() => onChangeMainTab('hackathons')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              mainTab === 'hackathons'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Hackathons & Desafios</span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
              mainTab === 'hackathons' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/60 text-slate-600'
            }`}>
              {countHackathons}
            </span>
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => onChangeViewMode('grid')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Grade
          </button>
          <button
            onClick={() => onChangeViewMode('calendar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Calendário
          </button>
          <button
            onClick={() => onChangeViewMode('map')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mapa
          </button>
          <button
            onClick={() => onChangeViewMode('table')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tabela
          </button>
        </div>
      </div>

      {/* 2. Main Search & Quick Controls Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="filter-search-input"
            type="text"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Pesquisar por edital, órgão ou termo (ex: FUNCAP, FINEP, Ceará, Inovação)..."
            className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 focus:border-slate-400 focus:bg-white outline-none transition-all"
          />
          {filters.search && (
            <button
              onClick={() => update({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tag Selector */}
          <div className="relative">
            <select
              value={filters.selectedTag}
              onChange={(e) => update({ selectedTag: e.target.value })}
              className={`text-xs font-semibold py-2 px-3 rounded-xl border transition-all cursor-pointer outline-none ${
                filters.selectedTag !== 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <option value="all">Tags: Todas</option>
              {availableTags.map((t) => (
                <option key={t} value={t}>
                  Tag: #{t}
                </option>
              ))}
            </select>
          </div>

          {/* Fluxo Contínuo */}
          <button
            onClick={() => update({ isContinuousFlowOnly: !filters.isContinuousFlowOnly })}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              filters.isContinuousFlowOnly
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Fluxo Contínuo</span>
            {filters.isContinuousFlowOnly && <Check className="w-3.5 h-3.5 text-white" />}
          </button>

          {/* Abrangência Nacional Shortcut */}
          <button
            onClick={() => update({ scope: filters.scope === 'Nacional' ? 'all' : 'Nacional' })}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              filters.scope === 'Nacional'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Nacional</span>
            {filters.scope === 'Nacional' && <Check className="w-3.5 h-3.5 text-white" />}
          </button>

          {/* Ceará Shortcut */}
          <button
            onClick={() => update({ state: filters.state === 'CE' ? 'all' : 'CE' })}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              filters.state === 'CE'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Ceará</span>
            {filters.state === 'CE' && <Check className="w-3.5 h-3.5 text-white" />}
          </button>

          {/* Advanced Drawer Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
              showAdvanced || filters.maturity !== 'all' || filters.funder || filters.resourceOrigin !== 'all' || filters.deadlineLimit
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros Completos</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Limpar Filtros */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Redefinir todos os filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Detailed Filters Grid (Maturidade, Financiador, Origem do Recurso, Data Limite, Abrangência) */}
      <div className={`mt-4 pt-4 border-t border-slate-100 ${showAdvanced ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* Maturidade */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Maturidade
            </label>
            <select
              value={filters.maturity || 'all'}
              onChange={(e) => update({ maturity: e.target.value as any })}
              className="w-full bg-slate-50 text-slate-800 font-medium py-2 px-3 rounded-lg border border-slate-200 focus:border-slate-400 outline-none"
            >
              <option value="all">Todas as Maturidades</option>
              {MATURITY_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Financiador */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Financiador
            </label>
            <select
              value={filters.funder || 'all'}
              onChange={(e) => update({ funder: e.target.value })}
              className="w-full bg-slate-50 text-slate-800 font-medium py-2 px-3 rounded-lg border border-slate-200 focus:border-slate-400 outline-none"
            >
              <option value="all">Selecione o financiador..</option>
              {FUNDER_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Origem do Recurso */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Origem do Recurso
            </label>
            <select
              value={filters.resourceOrigin || 'all'}
              onChange={(e) => update({ resourceOrigin: e.target.value as any })}
              className="w-full bg-slate-50 text-slate-800 font-medium py-2 px-3 rounded-lg border border-slate-200 focus:border-slate-400 outline-none"
            >
              <option value="all">Selecione a origem..</option>
              {RESOURCE_ORIGIN_OPTIONS.map((ro) => (
                <option key={ro} value={ro}>
                  {ro}
                </option>
              ))}
            </select>
          </div>

          {/* Data Limite */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
              <span>Data Limite</span>
              {filters.deadlineLimit && (
                <button
                  type="button"
                  onClick={() => update({ deadlineLimit: '' })}
                  className="text-[10px] text-slate-400 hover:text-slate-700 underline"
                >
                  Limpar data
                </button>
              )}
            </label>
            <input
              type="date"
              value={filters.deadlineLimit || ''}
              onChange={(e) => update({ deadlineLimit: e.target.value })}
              className="w-full bg-slate-50 text-slate-800 font-medium py-1.5 px-3 rounded-lg border border-slate-200 focus:border-slate-400 outline-none"
            />
          </div>

          {/* Abrangência */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Abrangência
            </label>
            <select
              value={filters.scope || 'all'}
              onChange={(e) => update({ scope: e.target.value as any })}
              className="w-full bg-slate-50 text-slate-800 font-medium py-2 px-3 rounded-lg border border-slate-200 focus:border-slate-400 outline-none"
            >
              <option value="all">Todas as Abrangências</option>
              <option value="Nacional">Nacional</option>
              <option value="Estadual">Estadual</option>
              <option value="Regional">Regional</option>
            </select>
          </div>
        </div>

        {/* Maturidade Quick Pills Row */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Target className="w-3.5 h-3.5" />
            <span>Maturidade rápida:</span>
          </span>
          {MATURITY_OPTIONS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => update({ maturity: filters.maturity === level ? 'all' : level })}
              className={`text-xs px-2.5 py-1 rounded-md font-medium border transition-colors cursor-pointer ${
                filters.maturity === level
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
