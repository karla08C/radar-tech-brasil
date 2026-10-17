import { useState } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Trophy,
  Filter,
  X,
  SlidersHorizontal,
  Sparkles,
  Globe,
  Flame,
  ChevronDown,
  ChevronUp,
  Rocket,
  Check,
} from 'lucide-react';
import { EventFilters, BrazilianRegion, EventModality } from '../types';

interface FilterBarProps {
  filters: EventFilters;
  onChange: (filters: EventFilters) => void;
  onReset: () => void;
  totalResultsCount: number;
  viewMode: 'grid' | 'calendar' | 'map' | 'table';
  onChangeViewMode: (mode: 'grid' | 'calendar' | 'map' | 'table') => void;
  mainTab: 'all' | 'hackathons' | 'events';
  onChangeMainTab: (tab: 'all' | 'hackathons' | 'events') => void;
  countHackathons: number;
  countConferences: number;
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
  countHackathons,
  countConferences,
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
    filters.selectedTag !== 'all';

  const update = (partial: Partial<EventFilters>) => {
    onChange({ ...filters, ...partial });
  };

  const totalAll = countHackathons + countConferences;

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 mb-6 shadow-xs">
      {/* 1. Primary Category Switcher Tabs: Separating Events & Hackathons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
          <button
            onClick={() => onChangeMainTab('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              mainTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>⚡ Todos</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              mainTab === 'all' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200/80 text-slate-600'
            }`}>
              {totalAll}
            </span>
          </button>

          <button
            onClick={() => onChangeMainTab('hackathons')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              mainTab === 'hackathons'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>🚀 Hackathons</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              mainTab === 'hackathons' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'
            }`}>
              {countHackathons}
            </span>
          </button>

          <button
            onClick={() => onChangeMainTab('events')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              mainTab === 'events'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>🎪 Eventos & Conferências</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              mainTab === 'events' ? 'bg-white/20 text-white' : 'bg-sky-50 text-sky-800'
            }`}>
              {countConferences}
            </span>
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shrink-0">
          <button
            onClick={() => onChangeViewMode('grid')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => onChangeViewMode('calendar')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Calendário
          </button>
          <button
            onClick={() => onChangeViewMode('map')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mapa Brasil
          </button>
          <button
            onClick={() => onChangeViewMode('table')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tabela
          </button>
        </div>
      </div>

      {/* 2. Search Input & Quick Filter Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="filter-search-input"
            type="text"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Pesquisar por título, organizador, tecnologias (ex: IA, Nubank, FinTech, SP)..."
            className="w-full bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 pl-11 pr-10 py-2.5 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
          />
          {filters.search && (
            <button
              onClick={() => update({ search: '' })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Pills & Advanced Filter Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Pill: Cash Prize */}
          <button
            onClick={() => update({ hasCashPrizeOnly: !filters.hasCashPrizeOnly })}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              filters.hasCashPrizeOnly
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Só com Dinheiro</span>
            {filters.hasCashPrizeOnly && <Check className="w-3.5 h-3.5 text-emerald-700" />}
          </button>

          {/* Quick Pill: 100% Remoto */}
          <button
            onClick={() => update({ modality: filters.modality === 'online' ? 'all' : 'online' })}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              filters.modality === 'online'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>100% Online</span>
            {filters.modality === 'online' && <Check className="w-3.5 h-3.5 text-indigo-700" />}
          </button>

          {/* Quick Pill: Urgent / Ending soon */}
          <button
            onClick={() => update({ timeframe: filters.timeframe === 'ending_soon' ? 'all' : 'ending_soon' })}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              filters.timeframe === 'ending_soon'
                ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>Encerra em 7 dias</span>
            {filters.timeframe === 'ending_soon' && <Check className="w-3.5 h-3.5 text-rose-700" />}
          </button>

          {/* Advanced Drawer Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showAdvanced || filters.state !== 'all' || filters.minPrizeValue > 0
                ? 'bg-slate-900 text-white border-slate-900'
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
              className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="Limpar todos os filtros"
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
          {/* Modalidade */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Modalidade
            </label>
            <select
              id="filter-modality-select"
              value={filters.modality}
              onChange={(e) => update({ modality: e.target.value as EventModality | 'all' })}
              className="w-full bg-slate-50 text-slate-700 font-medium py-2.5 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
            >
              <option value="all">Todas as Modalidades</option>
              <option value="online">100% Online / Remoto</option>
              <option value="presencial">Presencial no Brasil</option>
              <option value="hibrido">Híbrido (Online + Presencial)</option>
            </select>
          </div>

          {/* Estado / UF */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Localização (Estado / UF)
            </label>
            <select
              id="filter-state-select"
              value={filters.state}
              onChange={(e) => update({ state: e.target.value })}
              className="w-full bg-slate-50 text-slate-700 font-medium py-2.5 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
            >
              <option value="all">Todo o Brasil</option>
              <option value="Online">100% Online</option>
              <optgroup label="Sudeste">
                <option value="SP">São Paulo (SP)</option>
                <option value="RJ">Rio de Janeiro (RJ)</option>
                <option value="MG">Minas Gerais (MG)</option>
                <option value="ES">Espírito Santo (ES)</option>
              </optgroup>
              <optgroup label="Sul">
                <option value="PR">Paraná (PR)</option>
                <option value="SC">Santa Catarina (SC)</option>
                <option value="RS">Rio Grande do Sul (RS)</option>
              </optgroup>
              <optgroup label="Nordeste">
                <option value="PE">Pernambuco (PE)</option>
                <option value="BA">Bahia (BA)</option>
                <option value="CE">Ceará (CE)</option>
                <option value="PB">Paraíba (PB)</option>
                <option value="RN">Rio Grande do Norte (RN)</option>
              </optgroup>
              <optgroup label="Centro-Oeste">
                <option value="DF">Distrito Federal (DF)</option>
                <option value="GO">Goiás (GO)</option>
                <option value="MT">Mato Grosso (MT)</option>
                <option value="MS">Mato Grosso do Sul (MS)</option>
              </optgroup>
              <optgroup label="Norte">
                <option value="AM">Amazonas (AM)</option>
                <option value="PA">Pará (PA)</option>
                <option value="TO">Tocantins (TO)</option>
              </optgroup>
            </select>
          </div>

          {/* Período & Prazos */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Período & Prazos
            </label>
            <select
              id="filter-timeframe-select"
              value={filters.timeframe}
              onChange={(e) => update({ timeframe: e.target.value as any })}
              className="w-full bg-slate-50 text-slate-700 font-medium py-2.5 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
            >
              <option value="all">Todas as Datas</option>
              <option value="open_only">Inscrições Abertas Agora</option>
              <option value="ending_soon">Encerra em até 7 dias 🔥</option>
              <option value="this_month">Eventos deste Mês</option>
              <option value="next_3_months">Próximos 3 Meses</option>
            </select>
          </div>

          {/* Ordenação */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Ordenar Resultados Por
            </label>
            <select
              id="filter-sort-select"
              value={filters.sortBy}
              onChange={(e) => update({ sortBy: e.target.value as any })}
              className="w-full bg-slate-50 text-slate-700 font-medium py-2.5 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
            >
              <option value="featured">Destaques do Radar</option>
              <option value="prize_high">Maior Premiação (R$)</option>
              <option value="deadline_asc">Prazo Mais Urgente</option>
              <option value="date_asc">Data Mais Próxima</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
