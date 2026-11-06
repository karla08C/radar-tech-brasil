import { useState } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Rocket,
  Check,
  Landmark,
  ShieldCheck,
  Code2,
  Layers,
  Clock,
  Compass
} from 'lucide-react';
import { EventFilters, BrazilianRegion, EventModality, ThematicVertical, FundingType } from '../types';

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
}

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
    (filters.selectedVertical && filters.selectedVertical !== 'all');

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
            <span>Editais de Fomento (FAPs/FINEP)</span>
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
            <Rocket className="w-3.5 h-3.5" />
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
            <Code2 className="w-3.5 h-3.5" />
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

      {/* 2. Search Input & Region/Filter Shortcuts */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="filter-search-input"
            type="text"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Pesquisar por edital, órgão ou termo (ex: FUNCAP, FINEP, Ceará, Inteligência Artificial)..."
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

        {/* Quick Region Pills & Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Filter: Ceará */}
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

          {/* Quick Filter: Nordeste */}
          <button
            onClick={() => update({ region: filters.region === 'Nordeste' ? 'all' : 'Nordeste' })}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              filters.region === 'Nordeste'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Nordeste</span>
            {filters.region === 'Nordeste' && <Check className="w-3.5 h-3.5 text-white" />}
          </button>

          {/* Quick Pill: Fundo Perdido */}
          <button
            onClick={() => update({ fundingType: filters.fundingType === 'nao_reembolsavel' ? 'all' : 'nao_reembolsavel' })}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              filters.fundingType === 'nao_reembolsavel'
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Não-Reembolsável</span>
            {filters.fundingType === 'nao_reembolsavel' && <Check className="w-3.5 h-3.5 text-white" />}
          </button>

          {/* Quick Pill: Encerra em 7 dias */}
          <button
            onClick={() => update({ timeframe: filters.timeframe === 'ending_soon' ? 'all' : 'ending_soon' })}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              filters.timeframe === 'ending_soon'
                ? 'bg-rose-800 text-white border-rose-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Prazos até 7 dias</span>
            {filters.timeframe === 'ending_soon' && <Check className="w-3.5 h-3.5 text-white" />}
          </button>

          {/* Advanced Drawer Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
              showAdvanced || filters.state !== 'all' || filters.selectedVertical !== 'all'
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros Detalhados</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="Redefinir filtros"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Expandable Advanced Filter Options */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 text-xs">
          {/* Vertical Temática */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Área Temática
            </label>
            <select
              id="filter-vertical-select"
              value={filters.selectedVertical || 'all'}
              onChange={(e) => update({ selectedVertical: e.target.value as any })}
              className="w-full bg-slate-50 text-slate-800 font-medium py-2 px-3 rounded-lg border border-slate-200 focus:border-slate-400 outline-none"
            >
              <option value="all">Todas as Áreas</option>
              <option value="Impacto Social & GovTech">Impacto Social & GovTech</option>
              <option value="Inteligência Artificial & Dados">Inteligência Artificial & Dados</option>
              <option value="SaaS & B2B">SaaS & B2B</option>
              <option value="Saúde & HealthTech">Saúde & HealthTech</option>
              <option value="AgTech & BioTech">AgTech & BioTech</option>
              <option value="FinTech">FinTech</option>
              <option value="Educação & EdTech">Educação & EdTech</option>
            </select>
          </div>

          {/* Estado / UF */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Estado / Região
            </label>
            <select
              id="filter-state-select"
              value={filters.state}
              onChange={(e) => update({ state: e.target.value })}
              className="w-full bg-slate-50 text-slate-800 font-medium py-2 px-3 rounded-lg border border-slate-200 focus:border-slate-400 outline-none"
            >
              <option value="all">Todo o Brasil</option>
              <option value="CE">Ceará</option>
              <optgroup label="Nordeste">
                <option value="PE">Pernambuco (PE)</option>
                <option value="BA">Bahia (BA)</option>
                <option value="RN">Rio Grande do Norte (RN)</option>
                <option value="PB">Paraíba (PB)</option>
                <option value="MA">Maranhão (MA)</option>
                <option value="PI">Piauí (PI)</option>
                <option value="AL">Alagoas (AL)</option>
                <option value="SE">Sergipe (SE)</option>
              </optgroup>
              <optgroup label="Sudeste / Sul">
                <option value="SP">São Paulo (SP)</option>
                <option value="RJ">Rio de Janeiro (RJ)</option>
                <option value="MG">Minas Gerais (MG)</option>
                <option value="PR">Paraná (PR)</option>
                <option value="SC">Santa Catarina (SC)</option>
                <option value="RS">Rio Grande do Sul (RS)</option>
              </optgroup>
              <optgroup label="Centro-Oeste / Norte">
                <option value="DF">Distrito Federal (DF)</option>
                <option value="AM">Amazonas (AM)</option>
                <option value="PA">Pará (PA)</option>
              </optgroup>
            </select>
          </div>

          {/* Modalidade */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Modalidade
            </label>
            <select
              id="filter-modality-select"
              value={filters.modality}
              onChange={(e) => update({ modality: e.target.value as EventModality | 'all' })}
              className="w-full bg-slate-50 text-slate-800 font-medium py-2 px-3 rounded-lg border border-slate-200 focus:border-slate-400 outline-none"
            >
              <option value="all">Todas as Modalidades</option>
              <option value="online">100% Online / Remoto</option>
              <option value="presencial">Presencial</option>
              <option value="hibrido">Híbrido</option>
            </select>
          </div>

          {/* Ordenação */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Ordenação
            </label>
            <select
              id="filter-sort-select"
              value={filters.sortBy}
              onChange={(e) => update({ sortBy: e.target.value as any })}
              className="w-full bg-slate-50 text-slate-800 font-medium py-2 px-3 rounded-lg border border-slate-200 focus:border-slate-400 outline-none"
            >
              <option value="featured">Destaques</option>
              <option value="deadline_asc">Prazo Mais Urgente</option>
              <option value="prize_high">Maior Valor de Fomento</option>
              <option value="date_asc">Data Mais Próxima</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
