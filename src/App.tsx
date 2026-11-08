import { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Trophy,
  Calendar,
  MapPin,
  Bookmark,
  Filter,
  Loader2,
  ArrowDownToLine,
  Rocket,
  ArrowRight,
  ArrowLeft,
  Landmark,
  ShieldCheck,
  Code2,
  Target
} from 'lucide-react';
import { TechEvent, EventFilters, BrazilianRegion } from './types';
import { INITIAL_EVENTS } from './data/initialEvents';
import { formatBRL, getDaysRemaining } from './utils/eventUtils';
import { Header } from './components/Header';
import { PrizeSpotlight } from './components/PrizeSpotlight';
import { StatsBanner } from './components/StatsBanner';
import { FilterBar } from './components/FilterBar';
import { EventCard } from './components/EventCard';
import { EventModal } from './components/EventModal';
import { CalendarView } from './components/CalendarView';
import { BrazilMapView } from './components/BrazilMapView';
import { TableView } from './components/TableView';
import { AiScannerModal } from './components/AiScannerModal';
import { ImportEditalModal } from './components/ImportEditalModal';
import { AlertModal } from './components/AlertModal';

const DEFAULT_FILTERS: EventFilters = {
  search: '',
  category: 'all',
  modality: 'all',
  region: 'all',
  state: 'all',
  hasCashPrizeOnly: false,
  minPrizeValue: 0,
  timeframe: 'all',
  selectedTag: 'all',
  maturity: 'all',
  isContinuousFlowOnly: false,
  deadlineLimit: '',
  funder: 'all',
  resourceOrigin: 'all',
  scope: 'all',
  sortBy: 'featured',
};

export default function App() {
  const [events, setEvents] = useState<TechEvent[]>(() => {
    const saved = localStorage.getItem('radartech_custom_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const ids = new Set(parsed.map((e: TechEvent) => e.id));
        const missingInitial = INITIAL_EVENTS.filter(e => !ids.has(e.id));
        return [...parsed, ...missingInitial];
      } catch (e) {
        return INITIAL_EVENTS;
      }
    }
    return INITIAL_EVENTS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('radartech_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [mainTab, setMainTab] = useState<'all' | 'editais' | 'aceleracao' | 'hackathons'>('all');
  const [filters, setFilters] = useState<EventFilters>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar' | 'map' | 'table'>('grid');
  const [selectedEvent, setSelectedEvent] = useState<TechEvent | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Modals state
  const [isAiScannerOpen, setIsAiScannerOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const [isSyncing, setIsSyncing] = useState(false);

  // Sync favorites to local storage
  useEffect(() => {
    localStorage.setItem('radartech_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Fetch and synchronize initial events from backend
  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.events) && data.events.length > 0) {
          setEvents((prev) => {
            const map = new Map<string, TechEvent>();
            prev.forEach((e) => map.set(e.id, e));
            data.events.forEach((e: TechEvent) => {
              if (!map.has(e.id)) {
                map.set(e.id, e);
              }
            });
            const merged = Array.from(map.values());
            localStorage.setItem('radartech_custom_events', JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch((err) => console.log('Aviso: usando base local de editais', err));
  }, []);

  const handleSyncLiveEvents = async () => {
    setIsSyncing(true);
    showToast('Sincronizando editais e chamadas públicas oficiais...');
    try {
      const res = await fetch('/api/events/sync-live', { method: 'POST' });
      const data = await res.json();
      if (data.success && Array.isArray(data.events)) {
        setEvents((prev) => {
          const map = new Map<string, TechEvent>();
          data.events.forEach((e: TechEvent) => map.set(e.id, e));
          prev.forEach((e) => {
            if (!map.has(e.id)) map.set(e.id, e);
          });
          const merged = Array.from(map.values());
          localStorage.setItem('radartech_custom_events', JSON.stringify(merged));
          return merged;
        });
        showToast(data.message || 'Sincronização concluída com sucesso!');
      }
    } catch (err) {
      console.error(err);
      showToast('Editais sincronizados.');
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
      showToast('Oportunidade removida dos salvos.');
    } else {
      setFavorites([...favorites, id]);
      showToast('Oportunidade salva com sucesso.');
    }
  };

  const handleEventsDiscovered = (newEvents: TechEvent[], message: string) => {
    if (newEvents && newEvents.length > 0) {
      setEvents((prev) => {
        const merged = [...newEvents, ...prev];
        localStorage.setItem('radartech_custom_events', JSON.stringify(merged));
        return merged;
      });
      showToast(message);
    }
  };

  const handleEventImported = (newEvent: TechEvent) => {
    setEvents((prev) => {
      const merged = [newEvent, ...prev];
      localStorage.setItem('radartech_custom_events', JSON.stringify(merged));
      return merged;
    });
    setSelectedEvent(newEvent);
    showToast(`Edital "${newEvent.title}" cadastrado com sucesso.`);
  };

  // Total active prizes formatted
  const totalPrizeSum = useMemo(() => {
    return events.reduce((acc, evt) => acc + (evt.prizes?.totalValue || 0), 0);
  }, [events]);

  // Lista dinâmica de tags disponíveis
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => e.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [events]);

  // Filtered and Sorted Events
  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        // Favorites only check
        if (showFavoritesOnly && !favorites.includes(evt.id)) {
          return false;
        }

        // Search text
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase();
          const matchTitle = evt.title.toLowerCase().includes(q);
          const matchDesc = evt.description.toLowerCase().includes(q);
          const matchOrg = evt.organizer.toLowerCase().includes(q);
          const matchFunder = evt.funder?.toLowerCase().includes(q);
          const matchTags = evt.tags.some((t) => t.toLowerCase().includes(q));
          const matchLocation = `${evt.location.city} ${evt.location.state}`.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchOrg && !matchFunder && !matchTags && !matchLocation) {
            return false;
          }
        }

        // Modality
        if (filters.modality !== 'all' && evt.modality !== filters.modality) {
          return false;
        }

        // Category
        if (filters.category !== 'all' && evt.category !== filters.category) {
          return false;
        }

        // Main Tab Separation
        if (mainTab === 'editais' && evt.category !== 'edital_fomento' && evt.category !== 'bolsa_pesquisa') {
          return false;
        }
        if (mainTab === 'aceleracao' && evt.category !== 'aceleracao') {
          return false;
        }
        if (mainTab === 'hackathons' && evt.category !== 'hackathon') {
          return false;
        }

        // Region
        if (filters.region !== 'all') {
          if (evt.location.region !== filters.region) {
            return false;
          }
        }

        // State (UF)
        if (filters.state !== 'all') {
          if (filters.state === 'Online') {
            if (evt.modality !== 'online' && evt.location.state !== 'Online') {
              return false;
            }
          } else if (evt.location.state !== filters.state) {
            return false;
          }
        }

        // Cash Prize Only
        if (filters.hasCashPrizeOnly) {
          if (!evt.prizes.hasCashPrize || evt.prizes.totalValue <= 0) {
            return false;
          }
        }

        // Min Prize Value
        if (filters.minPrizeValue > 0) {
          if ((evt.prizes.totalValue || 0) < filters.minPrizeValue) {
            return false;
          }
        }

        // Timeframe
        if (filters.timeframe !== 'all') {
          const daysLeft = getDaysRemaining(evt.registrationDeadline);

          if (filters.timeframe === 'open_only') {
            if (daysLeft < 0) return false;
          } else if (filters.timeframe === 'ending_soon') {
            if (daysLeft < 0 || daysLeft > 7) return false;
          } else if (filters.timeframe === 'this_month') {
            const now = new Date();
            const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            if (!evt.startDate.startsWith(currentMonthStr)) {
              return false;
            }
          } else if (filters.timeframe === 'next_3_months') {
            if (daysLeft < 0 || daysLeft > 90) return false;
          }
        }

        // Tag filter
        if (filters.selectedTag !== 'all') {
          if (!evt.tags.includes(filters.selectedTag)) {
            return false;
          }
        }

        // Novo Filtro: Fluxo Contínuo
        if (filters.isContinuousFlowOnly && !evt.isContinuousFlow) {
          return false;
        }

        // Novo Filtro: Data Limite
        if (filters.deadlineLimit && filters.deadlineLimit.trim() !== '') {
          const evtDeadline = evt.registrationDeadline.split('T')[0];
          if (evtDeadline > filters.deadlineLimit) {
            return false;
          }
        }

        // Novo Filtro: Maturidade (Ideação, Validação, Tração, Crescimento)
        if (filters.maturity && filters.maturity !== 'all') {
          if (!evt.maturityLevels || !evt.maturityLevels.includes(filters.maturity)) {
            return false;
          }
        }

        // Novo Filtro: Financiador
        if (filters.funder && filters.funder !== 'all') {
          const fLower = filters.funder.toLowerCase();
          const matchFunder = evt.funder?.toLowerCase().includes(fLower);
          const matchOrg = evt.organizer.toLowerCase().includes(fLower);
          const matchTag = evt.tags.some(t => t.toLowerCase() === fLower);
          if (!matchFunder && !matchOrg && !matchTag) {
            return false;
          }
        }

        // Novo Filtro: Origem do Recurso (Federal, Estadual, Municipal, etc)
        if (filters.resourceOrigin && filters.resourceOrigin !== 'all') {
          if (evt.resourceOrigin !== filters.resourceOrigin) {
            return false;
          }
        }

        // Novo Filtro: Abrangência (Nacional, Estadual, Regional)
        if (filters.scope && filters.scope !== 'all') {
          if (evt.location.scope !== filters.scope) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'prize_high') {
          return (b.prizes?.totalValue || 0) - (a.prizes?.totalValue || 0);
        }
        if (filters.sortBy === 'deadline_asc') {
          return a.registrationDeadline.localeCompare(b.registrationDeadline);
        }
        if (filters.sortBy === 'date_asc') {
          return a.startDate.localeCompare(b.startDate);
        }
        // Default 'featured'
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.prizes?.totalValue || 0) - (a.prizes?.totalValue || 0);
      });
  }, [events, filters, showFavoritesOnly, favorites, mainTab]);

  const countEditais = useMemo(() => {
    return events.filter((e) => e.category === 'edital_fomento' || e.category === 'bolsa_pesquisa').length;
  }, [events]);

  const countAceleracao = useMemo(() => {
    return events.filter((e) => e.category === 'aceleracao').length;
  }, [events]);

  const countHackathons = useMemo(() => {
    return events.filter((e) => e.category === 'hackathon').length;
  }, [events]);

  const handleFilterHighPrizes = () => {
    setFilters({
      ...filters,
      minPrizeValue: 500000,
      sortBy: 'prize_high',
    });
    setViewMode('grid');
  };

  const handleFilterEndingSoon = () => {
    setFilters({
      ...filters,
      timeframe: 'ending_soon',
      sortBy: 'deadline_asc',
    });
    setViewMode('grid');
  };

  const handleFilterByTag = (tag: string) => {
    setFilters({
      ...filters,
      selectedTag: tag,
    });
    setViewMode('grid');
  };

  const handleSelectStateFromMap = (uf: string) => {
    setFilters({
      ...filters,
      state: uf,
      region: 'all',
    });
    setViewMode('grid');
  };

  const handleSelectRegionFromMap = (region: BrazilianRegion) => {
    setFilters({
      ...filters,
      region: region,
      state: 'all',
    });
    setViewMode('grid');
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white bg-cyera-grid relative">
      {/* Ambient Radial Mesh Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 radial-glow-cyan pointer-events-none -z-0" />

      {/* Global Header */}
      <Header
        onOpenAiScanner={() => setIsAiScannerOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenAlertModal={() => setIsAlertModalOpen(true)}
        favoriteCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
        totalPrizesFormatted={formatBRL(totalPrizeSum)}
        totalEventsCount={events.length}
      />

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B0F19] border border-cyan-500/30 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl shadow-cyan-500/10 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 backdrop-blur-xl">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Title & Mission (Cyera Enterprise Style) */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>OBSERVATÓRIO NACIONAL DE INOVAÇÃO & FOMENTO</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Editais Abertos, Subvenção & Aceleração
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Plataforma cívica que rastreia, classifica e audita chamadas públicas da FUNCAP, FINEP, CNPq e FAPs estaduais. Filtre por financiador, maturidade, origem do recurso e prazos em tempo real.
            </p>
          </div>

          {/* Quick Actions / Sync CTA */}
          <div className="self-start md:self-auto flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSyncLiveEvents}
              disabled={isSyncing}
              title="Sincronizar editais oficiais em tempo real"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-xs font-semibold text-white transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-75 cursor-pointer active:scale-[0.98]"
            >
              {isSyncing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ArrowDownToLine className="w-3.5 h-3.5" />
              )}
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Editais'}</span>
            </button>

            <button
              onClick={() => setIsAiScannerOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scanner de Editais</span>
            </button>
          </div>
        </div>

        {/* High-Level Numbers Banner */}
        <StatsBanner
          events={events}
          onFilterEndingSoon={handleFilterEndingSoon}
          onFilterHighPrizes={handleFilterHighPrizes}
          onFilterEditais={() => {
            setMainTab('editais');
            setViewMode('grid');
          }}
          onFilterAceleracao={() => {
            setMainTab('aceleracao');
            setViewMode('grid');
          }}
          onFilterCeara={() => {
            setFilters({ ...filters, state: 'CE' });
            setViewMode('grid');
          }}
        />

        {/* Featured Prizes Showcase */}
        {!showFavoritesOnly && filters.minPrizeValue === 0 && filters.search === '' && (
          <PrizeSpotlight
            events={events}
            onSelectEvent={setSelectedEvent}
            onFilterHighPrizes={handleFilterHighPrizes}
          />
        )}

        {/* Filter Bar com todos os novos filtros */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() => {
            setFilters(DEFAULT_FILTERS);
            setMainTab('all');
          }}
          totalResultsCount={filteredEvents.length}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          mainTab={mainTab}
          onChangeMainTab={setMainTab}
          countEditais={countEditais}
          countAceleracao={countAceleracao}
          countHackathons={countHackathons}
          availableTags={availableTags}
        />

        {/* Favorites only filter banner */}
        {showFavoritesOnly && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>
                Exibindo apenas suas <strong>{favorites.length}</strong> oportunidades salvas.
              </span>
            </div>
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className="text-xs font-mono text-amber-300 hover:underline cursor-pointer"
            >
              Ver todas as oportunidades
            </button>
          </div>
        )}

        {/* Active Content View: Grid, Calendar, Map, or Table */}
        {viewMode === 'calendar' ? (
          <CalendarView events={filteredEvents} onSelectEvent={setSelectedEvent} />
        ) : viewMode === 'map' ? (
          <BrazilMapView
            events={events}
            onSelectState={handleSelectStateFromMap}
            onSelectRegion={handleSelectRegionFromMap}
            selectedState={filters.state}
            selectedRegion={filters.region}
          />
        ) : viewMode === 'table' ? (
          <TableView
            events={filteredEvents}
            onSelectEvent={setSelectedEvent}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          /* Grid View */
          <div>
            {filteredEvents.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16 px-4 rounded-2xl bg-[#0B0F19]/90 border border-white/10 my-4 shadow-2xl">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center mx-auto mb-3">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white">
                  Nenhum edital encontrado para os parâmetros selecionados
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Tente ajustar a data limite, estágio de maturidade ou financiador selecionado.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                  <button
                    onClick={() => {
                      setFilters(DEFAULT_FILTERS);
                      setMainTab('all');
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    Limpar todos os filtros
                  </button>
                  <button
                    onClick={handleSyncLiveEvents}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors cursor-pointer"
                  >
                    {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowDownToLine className="w-3.5 h-3.5" />}
                    <span>Sincronizar Editais</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Grid Results */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredEvents.map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    onSelect={setSelectedEvent}
                    isFavorite={favorites.includes(evt.id)}
                    onToggleFavorite={toggleFavorite}
                    onFilterByTag={handleFilterByTag}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#05070A] py-8 px-4 sm:px-6 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Radar Tech Brasil</span>
            <span>•</span>
            <span className="text-slate-400">Observatório Cívico de Fomento à Inovação, Editais e Aceleração</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className="hover:text-cyan-400 font-mono transition-colors cursor-pointer"
            >
              Criar Alerta
            </button>
            <span>•</span>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="hover:text-cyan-400 font-mono transition-colors cursor-pointer"
            >
              Cadastrar Edital
            </button>
          </div>
        </div>
      </footer>

      {/* Full Details Modal */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        isFavorite={selectedEvent ? favorites.includes(selectedEvent.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* Automated AI Scanner Modal */}
      <AiScannerModal
        isOpen={isAiScannerOpen}
        onClose={() => setIsAiScannerOpen(false)}
        onEventsDiscovered={handleEventsDiscovered}
      />

      {/* Import Edital Modal */}
      <ImportEditalModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onEventImported={handleEventImported}
      />

      {/* Alert Subscription Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />
    </div>
  );
}
