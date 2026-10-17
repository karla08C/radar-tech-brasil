export type EventCategory = 'hackathon' | 'conference' | 'meetup' | 'summit' | 'bootcamp';
export type EventModality = 'online' | 'presencial' | 'hibrido';
export type BrazilianRegion = 'Sudeste' | 'Sul' | 'Nordeste' | 'Centro-Oeste' | 'Norte' | 'Nacional/Online';
export type EventStatus = 'aberto' | 'em_breve' | 'encerrado';

export interface PrizeBreakdownItem {
  place: string; // e.g., "1º Lugar"
  reward: string; // e.g., "R$ 30.000 + Vaga de Aceleração"
  value?: number;
}

export interface PrizeDetails {
  totalValue: number; // numeric value in BRL, 0 if no cash prize
  highlight: string; // e.g., "R$ 60.000 em Prêmios + Vagas no Nubank"
  hasCashPrize: boolean;
  breakdown?: PrizeBreakdownItem[];
  perks?: string[]; // e.g., ["Créditos Cloud", "Contratação", "Mentoria C-Level"]
}

export interface EventLocation {
  city: string;
  state: string; // UF: SP, RJ, MG, etc., or "Online"
  venue?: string;
  region: BrazilianRegion;
}

export interface TechEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: EventCategory;
  modality: EventModality;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  registrationDeadline: string; // YYYY-MM-DD
  location: EventLocation;
  organizer: string;
  websiteUrl: string;
  registrationUrl: string;
  tags: string[];
  prizes: PrizeDetails;
  featured: boolean;
  targetAudience: string;
  isAutomatedDiscovery?: boolean;
  discoveredAt?: string;
  source?: string;
  verified?: boolean;
}

export interface EventFilters {
  search: string;
  category: EventCategory | 'all';
  modality: EventModality | 'all';
  region: BrazilianRegion | 'all';
  state: string; // 'all' or specific UF like 'SP', 'RJ'
  hasCashPrizeOnly: boolean;
  minPrizeValue: number; // 0, 5000, 20000, 50000, 100000
  timeframe: 'all' | 'this_month' | 'next_3_months' | 'open_only' | 'ending_soon';
  selectedTag: string | 'all';
  sortBy: 'featured' | 'prize_high' | 'date_asc' | 'deadline_asc';
}

export interface AiDiscoveryResult {
  events: TechEvent[];
  searchQuery?: string;
  insights?: string;
  scannedAt: string;
  count: number;
}

export interface AlertSubscription {
  email: string;
  minPrize: number;
  onlyHackathons: boolean;
  selectedStates: string[];
  preferredModality: string;
  createdAt: string;
}
