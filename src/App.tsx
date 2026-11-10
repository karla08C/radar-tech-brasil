import { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Trophy,
  Filter,
  Loader2,
  ArrowDownToLine,
  Bookmark,
  ChevronDown,
  ChevronUp,
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
  const [showStrategicBanner, setShowStrategicBanner] = useState(false);

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

  // Fetch initial events from backend
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
    showToast('Sincronizando editais oficiais em tempo real...');
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
      showToast('Removido dos salvos.');
    } else {
      setFavorites([...favorites, id]);
      showToast('Salvo com sucesso.');
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

  const totalPrizeSum = useMemo(() => {
    return events.reduce((acc, evt) => acc + (evt.prizes?.totalValue || 0), 0);
  }, [events]);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => e.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        if (showFavoritesOnly && !favorites.includes(evt.id)) {
          return false;
        }

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

        if (filters.modality !== 'all' && evt.modality !== filters.modality) {
          return false;
        }

        if (filters.category !== 'all' && evt.category !== filters.category) {
          return false;
        }

        if (mainTab === 'editais' && evt.category !== 'edital_fomento' && evt.category !== 'bolsa_pesquisa') {
          return false;
        }
        if (mainTab === 'aceleracao' && evt.category !== 'aceleracao') {
          return false;
        }
        if (mainTab === 'hackathons' && evt.category !== 'hackathon') {
          return false;
        }

        if (filters.region !== 'all') {
          if (evt.location.region !== filters.region) {
            return false;
          }
        }

        if (filters.state !== 'all') {
          if (filters.state === 'Online') {
            if (evt.modality !== 'online' && evt.location.state !== 'Online') {
              return false;
            }
          } else if (evt.location.state !== filters.state) {
            return false;
          }
        }

        if (filters.hasCashPrizeOnly) {
          if (!evt.prizes.hasCashPrize || evt.prizes.totalValue <= 0) {
            return false;
          }
        }

        if (filters.minPrizeValue > 0) {
          if ((evt.prizes.totalValue || 0) < filters.minPrizeValue) {
            return false;
          }
        }

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

        if (filters.selectedTag !== 'all') {
          if (!evt.tags.includes(filters.selectedTag)) {
            return false;
          }
        }

        if (filters.isContinuousFlowOnly && !evt.isContinuousFlow) {
          return false;
        }

        if (filters.deadlineLimit && filters.deadlineLimit.trim() !== '') {
          const evtDeadline = evt.registrationDeadline.split('T')[0];
          if (evtDeadline > filters.deadlineLimit) {
            return false;
          }
        }

        if (filters.maturity && filters.maturity !== 'all') {
          if (!evt.maturityLevels || !evt.maturityLevels.includes(filters.maturity)) {
            return false;
          }
        }

        if (filters.funder && filters.funder !== 'all') {
          const fLower = filters.funder.toLowerCase();
          const matchFunder = evt.funder?.toLowerCase().includes(fLower);
          const matchOrg = evt.organizer.toLowerCase().includes(fLower);
          const matchTag = evt.tags.some(t => t.toLowerCase() === fLower);
          if (!matchFunder && !matchOrg && !matchTag) {
            return false;
          }
        }

        if (filters.resourceOrigin && filters.resourceOrigin !== 'all') {
          if (evt.resourceOrigin !== filters.resourceOrigin) {
            return false;
          }
        }

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
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col selection:bg-slate-700 selection:text-white bg-subtle-grid relative overflow-x-hidden font-sans">
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

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#162030] border border-slate-700 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-slate-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="pt-2 pb-6 sm:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>OBSERVATÓRIO DE FOMENTO & INOVAÇÃO PÚBLICA</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight font-['Plus_Jakarta_Sans']">
              Editais Abertos, Subvenção & Aceleração no Brasil
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
              Centralização e auditoria contínua de chamadas públicas da FUNCAP, FINEP, CNPq e FAPs estaduais. Filtre por financiador, estágio, subvenção e prazos de submissão sem ruído.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            <button
              onClick={handleSyncLiveEvents}
              disabled={isSyncing}
              title="Sincronizar portais públicos agora"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold transition-colors disabled:opacity-75 cursor-pointer shadow-xs"
            >
              {isSyncing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ArrowDownToLine className="w-3.5 h-3.5" />
              )}
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Editais'}</span>
            </button>

            <button
              onClick={() => setShowStrategicBanner(!showStrategicBanner)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Chamadas Estratégicas</span>
              {showStrategicBanner ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Strategic Grants Spotlight */}
        {showStrategicBanner && (
          <PrizeSpotlight
            events={events}
            onSelectEvent={setSelectedEvent}
            onFilterHighPrizes={handleFilterHighPrizes}
          />
        )}

        {/* Compact Metrics Strip */}
        <StatsBanner
          events={events}
          onFilterEndingSoon={handleFilterEndingSoon}
          onFilterHighPrizes={handleFilterHighPrizes}
          onFilterEditais={() => {
            setMainTab('editais');
            setViewMode('grid');
          }}
          onFilterCeara={() => {
            setFilters({ ...filters, state: 'CE' });
            setViewMode('grid');
          }}
        />

        {/* Filter Bar */}
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
          <div className="mb-6 p-4 rounded-lg bg-amber-950/40 border border-amber-600/50 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>
                Exibindo suas <strong>{favorites.length}</strong> oportunidades salvas.
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
              <div className="text-center py-16 px-4 rounded-xl bg-[#121824] border border-slate-800 my-4">
                <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                  Nenhum edital encontrado para esses critérios
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Tente ajustar a data limite, estágio de maturidade ou financiador selecionado.
                </p>

                <div className="flex items-center justify-center gap-3 mt-5">
                  <button
                    onClick={() => {
                      setFilters(DEFAULT_FILTERS);
                      setMainTab('all');
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-900 transition-colors cursor-pointer"
                  >
                    Limpar todos os filtros
                  </button>
                  <button
                    onClick={handleSyncLiveEvents}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                  >
                    {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowDownToLine className="w-3.5 h-3.5" />}
                    <span>Sincronizar Editais</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Grid Results */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    onSelect={setSelectedEvent}
                    isFavorite={favorites.includes(evt.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0B0F17] py-8 px-4 sm:px-6 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Radar Tech Brasil</span>
            <span>•</span>
            <span className="text-slate-400">Observatório Cívico de Fomento à Inovação e Editais Públicos</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Criar Alerta
            </button>
            <span>•</span>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cadastrar Edital
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        isFavorite={selectedEvent ? favorites.includes(selectedEvent.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      <AiScannerModal
        isOpen={isAiScannerOpen}
        onClose={() => setIsAiScannerOpen(false)}
        onEventsDiscovered={handleEventsDiscovered}
      />

      <ImportEditalModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onEventImported={handleEventImported}
      />

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />
    </div>
  );
}
