import { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Trophy,
  Calendar,
  MapPin,
  RefreshCw,
  Bookmark,
  AlertCircle,
  Plus,
  Filter,
  Loader2,
  ArrowDownToLine,
  CheckCircle2,
  Rocket,
  ArrowRight,
  ArrowLeft,
  LayoutGrid,
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
  sortBy: 'featured',
};

export default function App() {
  const [events, setEvents] = useState<TechEvent[]>(() => {
    const saved = localStorage.getItem('radartech_custom_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved with initial events without duplicate ids
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

  const [mainTab, setMainTab] = useState<'all' | 'hackathons' | 'events'>('all');
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
            // Keep existing ones or update
            prev.forEach((e) => map.set(e.id, e));
            // Add or overwrite from backend
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
      .catch((err) => console.log('Notice: using local seed events', err));
  }, []);

  const handleSyncLiveEvents = async () => {
    setIsSyncing(true);
    showToast('Sincronizando com feeds ao vivo e editais no Brasil...');
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
      showToast('Eventos locais sincronizados.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResetCatalog = () => {
    localStorage.removeItem('radartech_custom_events');
    setEvents(INITIAL_EVENTS);
    showToast('Catálogo completo restaurado com todos os eventos e hackathons!');
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
      showToast('Evento removido dos salvos.');
    } else {
      setFavorites([...favorites, id]);
      showToast('Evento salvo nos seus favoritos!');
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
    showToast(`Evento "${newEvent.title}" adicionado e estruturado com sucesso!`);
  };

  // Total active prizes formatted
  const totalPrizeSum = useMemo(() => {
    return events.reduce((acc, evt) => acc + (evt.prizes?.totalValue || 0), 0);
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
          const matchTags = evt.tags.some((t) => t.toLowerCase().includes(q));
          const matchLocation = `${evt.location.city} ${evt.location.state}`.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchOrg && !matchTags && !matchLocation) {
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

        // Main Tab Separation (Hackathons vs Events/Conferences)
        if (mainTab === 'hackathons' && evt.category !== 'hackathon') {
          return false;
        }
        if (mainTab === 'events' && evt.category === 'hackathon') {
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
          const endDaysLeft = getDaysRemaining(evt.endDate);

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

  const hackathonEvents = useMemo(() => {
    return filteredEvents.filter((e) => e.category === 'hackathon');
  }, [filteredEvents]);

  const conferenceEvents = useMemo(() => {
    return filteredEvents.filter((e) => e.category !== 'hackathon');
  }, [filteredEvents]);

  const countHackathons = useMemo(() => {
    return events.filter((e) => e.category === 'hackathon').length;
  }, [events]);

  const countConferences = useMemo(() => {
    return events.filter((e) => e.category !== 'hackathon').length;
  }, [events]);

  const hackathonPrizeSum = useMemo(() => {
    return hackathonEvents.reduce((acc, evt) => acc + (evt.prizes?.totalValue || 0), 0);
  }, [hackathonEvents]);

  const handleFilterHighPrizes = () => {
    setFilters({
      ...filters,
      minPrizeValue: 50000,
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

  const handleFilterOnline = () => {
    setFilters({
      ...filters,
      modality: 'online',
    });
    setViewMode('grid');
  };

  const handleFilterByTag = (tag: string) => {
    setFilters({
      ...filters,
      search: tag,
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-indigo-600 selection:text-white">
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
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Title & Mission */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>O Maior Hub de Oportunidades & Maratonas Tech do Brasil</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Descubra Hackathons e Eventos de Tecnologia no Brasil 🇧🇷
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
              Filtre por datas de inscrição, cidades brasileiras, formato online ou presencial, e acompanhe as maiores premiações em dinheiro e contratações.
            </p>
          </div>

          {/* Quick Actions / Sync CTA */}
          <div className="self-start md:self-auto flex flex-wrap items-center gap-2">
            <button
              onClick={handleSyncLiveEvents}
              disabled={isSyncing}
              title="Puxar editais e maratonas em tempo real das principais plataformas"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition-all shadow-xs disabled:opacity-75 cursor-pointer"
            >
              {isSyncing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ArrowDownToLine className="w-3.5 h-3.5" />
              )}
              <span>{isSyncing ? 'Puxando Eventos...' : 'Puxar Eventos ao Vivo'}</span>
            </button>

            <button
              onClick={() => setIsAiScannerOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Varredura com IA</span>
            </button>
          </div>
        </div>

        {/* High-Level Numbers Banner */}
        <StatsBanner
          events={events}
          onFilterEndingSoon={handleFilterEndingSoon}
          onFilterHighPrizes={handleFilterHighPrizes}
          onFilterHackathons={() => {
            setMainTab('hackathons');
            setViewMode('grid');
          }}
          onFilterConferences={() => {
            setMainTab('events');
            setViewMode('grid');
          }}
        />

        {/* Featured Prizes Showcase (Top rewards in Brazil) */}
        {!showFavoritesOnly && filters.minPrizeValue === 0 && filters.search === '' && (
          <PrizeSpotlight
            events={events}
            onSelectEvent={setSelectedEvent}
            onFilterHighPrizes={handleFilterHighPrizes}
          />
        )}

        {/* Filter Bar (Dates, Location/UF, Modality, Prizes, Search) */}
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
          countHackathons={countHackathons}
          countConferences={countConferences}
        />

        {/* Favorites only filter banner */}
        {showFavoritesOnly && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>
                Exibindo apenas seus <strong>{favorites.length}</strong> eventos salvos nos favoritos.
              </span>
            </div>
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
            >
              Ver todos os eventos
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
              <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-200 my-4 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Nenhum evento encontrado para os filtros selecionados
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Tente ampliar seus filtros de localização, prazo de inscrição ou premiação mínima, ou execute uma varredura com inteligência artificial.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                  <button
                    onClick={() => {
                      setFilters(DEFAULT_FILTERS);
                      setMainTab('all');
                    }}
                    className="px-4 py-2.5 text-xs font-semibold rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    Limpar Todos os Filtros
                  </button>
                  <button
                    onClick={handleSyncLiveEvents}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
                  >
                    {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowDownToLine className="w-3.5 h-3.5" />}
                    <span>Puxar Eventos ao Vivo</span>
                  </button>
                  <button
                    onClick={() => setIsAiScannerOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl bg-slate-900 hover:bg-black text-white transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Buscar com IA na Web</span>
                  </button>
                  <button
                    onClick={handleResetCatalog}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-medium px-2 py-1 cursor-pointer"
                  >
                    Restaurar catálogo completo (22+ eventos)
                  </button>
                </div>
              </div>
            ) : mainTab === 'all' ? (
              /* All Tab: Clearly Separated Bento Sections for Hackathons vs Conferences */
              <div className="space-y-12">
                {/* Section 1: Hackathons & Maratonas */}
                <section id="section-hackathons" className="scroll-mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
                        <Rocket className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                            Hackathons & Maratonas de Código
                          </h3>
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {hackathonEvents.length}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Desafios intensivos em squads com mentorias, contratações e prêmios em dinheiro
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-start sm:self-auto">
                      {hackathonPrizeSum > 0 && (
                        <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                          🏆 {formatBRL(hackathonPrizeSum)} em prêmios
                        </span>
                      )}
                      <button
                        onClick={() => setMainTab('hackathons')}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer bg-indigo-50/50 hover:bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100 transition-colors"
                      >
                        <span>Focar só em Hackathons</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {hackathonEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {hackathonEvents.map((evt) => (
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
                  ) : (
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                      Nenhum hackathon encontrado com esses filtros.{' '}
                      <button
                        onClick={() => setFilters(DEFAULT_FILTERS)}
                        className="font-bold text-indigo-600 hover:underline cursor-pointer ml-1"
                      >
                        Limpar filtros
                      </button>
                    </div>
                  )}
                </section>

                {/* Section 2: Eventos & Conferências Tech */}
                <section id="section-conferences" className="scroll-mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 shadow-xs">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                            Eventos, Conferências & Summits
                          </h3>
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-100">
                            {conferenceEvents.length}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Grandes palcos de tecnologia, summits corporativos, feiras de inovação e networking
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => setMainTab('events')}
                        className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 hover:underline cursor-pointer bg-sky-50/50 hover:bg-sky-50 px-3 py-1 rounded-xl border border-sky-100 transition-colors"
                      >
                        <span>Focar só em Conferências</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {conferenceEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {conferenceEvents.map((evt) => (
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
                  ) : (
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                      Nenhuma conferência encontrada com esses filtros.{' '}
                      <button
                        onClick={() => setFilters(DEFAULT_FILTERS)}
                        className="font-bold text-sky-700 hover:underline cursor-pointer ml-1"
                      >
                        Limpar filtros
                      </button>
                    </div>
                  )}
                </section>
              </div>
            ) : mainTab === 'hackathons' ? (
              /* Hackathons Focused Tab */
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Rocket className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">
                          Hackathons & Maratonas de Programação
                        </h3>
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {hackathonEvents.length} resultados
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Exibindo exclusivamente maratonas de desenvolvimento com premiações e desafios em squads.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setMainTab('all')}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Ver todos (Hackathons + Eventos)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {hackathonEvents.map((evt) => (
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
              </div>
            ) : (
              /* Conferences Focused Tab */
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-700 text-white flex items-center justify-center shadow-xs">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">
                          Conferências, Summits & Eventos Tech
                        </h3>
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-100">
                          {conferenceEvents.length} resultados
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Exibindo summits de inovação, feiras de tecnologia e congressos de desenvolvedores no Brasil.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setMainTab('all')}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Ver todos (Hackathons + Eventos)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {conferenceEvents.map((evt) => (
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
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 px-4 sm:px-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">RadarTech Brasil</span>
            <span>•</span>
            <span>Plataforma automatizada de eventos e hackathons de tecnologia</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Powered by Gemini 3.8 Flash & Google AI Studio</span>
            <span>•</span>
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Criar Alerta
            </button>
            <span>•</span>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
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
