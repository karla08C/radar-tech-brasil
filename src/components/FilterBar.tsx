import { useState } from 'react';
import {
  Search,
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
  Target,
  Sparkles,
  LayoutGrid,
  Calendar,
  MapPin,
  Table
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
    filters.selectedTag !== 'all' ||
    filters.maturity !== 'all' ||
    filters.isContinuousFlowOnly ||
    filters.deadlineLimit !== '' ||
    filters.funder !== 'all' ||
    filters.resourceOrigin !== 'all' ||
    filters.scope !== 'all' ||
    filters.state !== 'all' ||
    filters.modality !== 'all' ||
    filters.timeframe !== 'all' ||
    filters.hasCashPrizeOnly ||
    filters.minPrizeValue > 0 ||
    mainTab !== 'all';

  return (
    <div className="bg-[#0B0F19]/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl mb-6 p-4 sm:p-5 text-slate-200">
      {/* Top Bar: Tabs + Search + View Modes */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Main Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#07090E] border border-white/10 self-start">
          <button
            onClick={() => onChangeMainTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              mainTab === 'all'
                ? 'bg-white/15 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            Todas as Oportunidades
          </button>

          <button
            onClick={() => onChangeMainTab('editais')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              mainTab === 'editais'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Editais de Fomento</span>
            {countEditais > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-white/10 text-slate-300">
                {countEditais}
              </span>
            )}
          </button>

          <button
            onClick={() => onChangeMainTab('aceleracao')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              mainTab === 'aceleracao'
                ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Aceleração</span>
            {countAceleracao > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-white/10 text-slate-300">
                {countAceleracao}
              </span>
            )}
          </button>

          <button
            onClick={() => onChangeMainTab('hackathons')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              mainTab === 'hackathons'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hackathons</span>
            {countHackathons > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-white/10 text-slate-300">
                {countHackathons}
              </span>
            )}
          </button>
        </div>

        {/* View Mode Toggle Controls */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <div className="flex items-center p-1 rounded-xl bg-[#07090E] border border-white/10">
            <button
              onClick={() => onChangeViewMode('grid')}
              title="Visualização em Cards"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white/15 text-white'
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
                  ? 'bg-white/15 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeViewMode('map')}
              title="Visualização em Mapa"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white/15 text-white'
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
                  ? 'bg-white/15 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Search and Quick Direct Filters */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Bar */}
        <div className="relative md:col-span-5">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por edital, chamada, órgão (ex: Inovafit, FINEP, FUNCAP)..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07090E] border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
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

        {/* Financiador Select */}
        <div className="md:col-span-3">
          <select
            value={filters.funder || 'all'}
            onChange={(e) => onChange({ ...filters, funder: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-[#07090E] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 transition-all cursor-pointer"
          >
            <option value="all">Financiador: Selecione o financiador..</option>
            {FUNDER_OPTIONS.map((funder) => (
              <option key={funder} value={funder}>
                {funder}
              </option>
            ))}
          </select>
        </div>

        {/* Abrangência Select */}
        <div className="md:col-span-2">
          <select
            value={filters.scope || 'all'}
            onChange={(e) => onChange({ ...filters, scope: e.target.value as any })}
            className="w-full px-3 py-2.5 rounded-xl bg-[#07090E] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 transition-all cursor-pointer"
          >
            <option value="all">Abrangência: Todas</option>
            <option value="Nacional">Nacional</option>
            <option value="Estadual">Estadual</option>
            <option value="Regional">Regional</option>
          </select>
        </div>

        {/* Advanced Filters Toggle & Reset Button */}
        <div className="md:col-span-2 flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              showAdvanced || hasActiveFilters
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros</span>
            {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              title="Limpar todos os filtros"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
          {/* Maturidade */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Target className="w-3 h-3 text-cyan-400" />
              <span>Maturidade da Startup / Projeto</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {MATURITY_OPTIONS.map((lvl) => {
                const isSelected = filters.maturity === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => onChange({ ...filters, maturity: isSelected ? 'all' : lvl })}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                        : 'bg-[#07090E] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5'
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
              <Building className="w-3 h-3 text-indigo-400" />
              <span>Origem do Recurso</span>
            </label>
            <select
              value={filters.resourceOrigin || 'all'}
              onChange={(e) => onChange({ ...filters, resourceOrigin: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl bg-[#07090E] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/80 cursor-pointer"
            >
              <option value="all">Selecione a origem..</option>
              {RESOURCE_ORIGIN_OPTIONS.map((orig) => (
                <option key={orig} value={orig}>
                  {orig}
                </option>
              ))}
            </select>
          </div>

          {/* Data Limite de Submissão */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Data Limite (Até)</span>
            </label>
            <input
              type="date"
              value={filters.deadlineLimit || ''}
              onChange={(e) => onChange({ ...filters, deadlineLimit: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#07090E] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/80"
            />
          </div>

          {/* Fluxo Contínuo & Timeframe */}
          <div className="flex flex-col justify-between">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Repeat className="w-3 h-3 text-emerald-400" />
              <span>Regime de Submissão</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-xl bg-[#07090E] border border-white/10 text-xs text-slate-300 cursor-pointer hover:border-white/20 transition-all">
              <input
                type="checkbox"
                checked={filters.isContinuousFlowOnly || false}
                onChange={(e) => onChange({ ...filters, isContinuousFlowOnly: e.target.checked })}
                className="rounded border-white/20 bg-slate-800 text-cyan-500 focus:ring-cyan-500/30"
              />
              <span className="font-medium">Fluxo Contínuo (Sem prazo fixo)</span>
            </label>
          </div>
        </div>
      )}

      {/* Tags Row */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
          <Tag className="w-3 h-3 text-slate-500" />
          <span>Tags:</span>
        </span>

        <button
          onClick={() => onChange({ ...filters, selectedTag: 'all' })}
          className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
            filters.selectedTag === 'all'
              ? 'bg-white/15 text-white font-semibold'
              : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
          }`}
        >
          Todas
        </button>

        {availableTags.map((tag) => {
          const isSelected = filters.selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => onChange({ ...filters, selectedTag: isSelected ? 'all' : tag })}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                  : 'bg-white/5 border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
              }`}
            >
              #{tag}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="ml-auto text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpar filtros</span>
          </button>
        )}
      </div>

      {/* Results counter indicator */}
      <div className="mt-3 pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-white/5">
        <span>
          Encontradas <strong className="text-white font-sans">{totalResultsCount}</strong> chamadas públicas de inovação
        </span>
        {filters.isContinuousFlowOnly && (
          <span className="text-emerald-400 flex items-center gap-1">
            <Repeat className="w-3 h-3" />
            <span>Exibindo chamadas em regime de fluxo contínuo</span>
          </span>
        )}
      </div>
    </div>
  );
}
