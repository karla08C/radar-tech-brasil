export type EventCategory = 
  | 'edital_fomento' 
  | 'aceleracao' 
  | 'hackathon' 
  | 'bolsa_pesquisa'
  | 'conference' 
  | 'meetup' 
  | 'summit' 
  | 'bootcamp';

export type EventModality = 'online' | 'presencial' | 'hibrido';
export type BrazilianRegion = 'Nordeste' | 'Sudeste' | 'Sul' | 'Centro-Oeste' | 'Norte' | 'Nacional/Online';
export type EventStatus = 'aberto' | 'em_breve' | 'encerrado';

export type FundingType = 
  | 'nao_reembolsavel' // A fundo perdido / Subvenção econômica
  | 'equity_free'      // Aceleração sem ceder cotas
  | 'investimento'     // Smart money / Mútuo conversível
  | 'creditos_cloud'   // AWS/Google Cloud/Azure credits
  | 'premiacao_direta';// Dinheiro direto de hackathon

export type ThematicVertical = 
  | 'SaaS & B2B'
  | 'Impacto Social & GovTech'
  | 'Saúde & HealthTech'
  | 'AgTech & BioTech'
  | 'Inteligência Artificial & Dados'
  | 'Educação & EdTech'
  | 'FinTech'
  | 'Geral / Agnóstico';

export type MaturityLevel = 'Ideação' | 'Validação' | 'Tração' | 'Crescimento';

export type ResourceOrigin = 'Federal' | 'Estadual' | 'Municipal' | 'Privado' | 'Internacional';

export interface PrizeBreakdownItem {
  place: string; // e.g., "1º Lugar" ou "Valor Teto por Startup"
  reward: string; // e.g., "R$ 300.000 a fundo perdido"
  value?: number;
}

export interface PrizeDetails {
  totalValue: number; // numeric value in BRL, 0 if no cash prize
  highlight: string; // e.g., "Até R$ 300.000 Não-Reembolsável"
  hasCashPrize: boolean;
  fundingType?: FundingType;
  hasCounterpart?: boolean;
  counterpartPercentage?: number;
  breakdown?: PrizeBreakdownItem[];
  perks?: string[];
}

export interface EventLocation {
  city: string;
  state: string; // UF: CE, SP, RJ, etc., or "Online"
  venue?: string;
  region: BrazilianRegion;
  scope?: 'Nacional' | 'Estadual' | 'Regional';
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
  registrationDeadline: string; // YYYY-MM-DD or ISO with time
  isContinuousFlow?: boolean; // Fluxo Contínuo
  location: EventLocation;
  organizer: string;
  funder?: string; // Financiador (ex: FUNCAP, FINEP, CNPq, FAPESP)
  resourceOrigin?: ResourceOrigin; // Origem do Recurso
  maturityLevels?: MaturityLevel[]; // Maturidade (Ideação, Validação, Tração, Crescimento)
  websiteUrl: string;
  registrationUrl: string;
  tags: string[];
  verticals?: ThematicVertical[];
  prizes: PrizeDetails;
  featured: boolean;
  targetAudience: string;
  officialNoticePdfUrl?: string;
  eligibilityCriteria?: string[];
  isAutomatedDiscovery?: boolean;
  discoveredAt?: string;
  source?: string;
  verified?: boolean;
}

export interface EventFilters {
  search: string;
  category: EventCategory | 'all' | 'editais' | 'aceleracao';
  modality: EventModality | 'all';
  region: BrazilianRegion | 'all';
  state: string; // 'all' or specific UF like 'CE', 'SP'
  hasCashPrizeOnly: boolean;
  minPrizeValue: number;
  timeframe: 'all' | 'this_month' | 'next_3_months' | 'open_only' | 'ending_soon';
  selectedTag: string | 'all';
  selectedVertical?: ThematicVertical | 'all';
  fundingType?: FundingType | 'all';
  
  // Novos filtros:
  maturity?: MaturityLevel | 'all';
  isContinuousFlowOnly?: boolean;
  deadlineLimit?: string; // Data limite (YYYY-MM-DD)
  funder?: string; // "Selecione o financiador..."
  resourceOrigin?: ResourceOrigin | 'all'; // "Selecione a origem..."
  scope?: 'all' | 'Nacional' | 'Estadual' | 'Regional'; // Abrangência

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
  email?: string;
  whatsapp?: string;
  telegram?: string;
  minPrize: number;
  selectedCategories: EventCategory[];
  selectedStates: string[];
  selectedVerticals: ThematicVertical[];
  createdAt: string;
}
