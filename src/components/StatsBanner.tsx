import { Trophy, Landmark, MapPin, Clock, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { TechEvent } from '../types';
import { formatBRL, getDaysRemaining } from '../utils/eventUtils';

interface StatsBannerProps {
  events: TechEvent[];
  onFilterEndingSoon: () => void;
  onFilterHighPrizes: () => void;
  onFilterEditais?: () => void;
  onFilterAceleracao?: () => void;
  onFilterCeara?: () => void;
  onFilterHackathons?: () => void;
  onFilterConferences?: () => void;
}

export function StatsBanner({
  events,
  onFilterEndingSoon,
  onFilterHighPrizes,
  onFilterEditais,
  onFilterAceleracao,
  onFilterCeara,
  onFilterHackathons,
  onFilterConferences,
}: StatsBannerProps) {
  const totalPrizeSum = events.reduce((acc, evt) => acc + (evt.prizes?.totalValue || 0), 0);

  const editaisCount = events.filter((evt) => 
    evt.category === 'edital_fomento' || evt.category === 'bolsa_pesquisa'
  ).length;

  const cearaCount = events.filter((evt) => evt.location.state === 'CE').length;

  const urgentCount = events.filter((evt) => {
    const days = getDaysRemaining(evt.registrationDeadline);
    return days >= 0 && days <= 7;
  }).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Metric 1: Total Mapeado */}
      <div
        onClick={onFilterHighPrizes}
        className="cursor-pointer group relative rounded-2xl bg-[#0B0F19]/90 border border-white/10 p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.12)] min-h-[148px] overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

        <div className="flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Fomento Mapeado
            </span>
          </div>
          <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
            <Trophy className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-1.5 relative z-10">
          <div className="text-2xl sm:text-[26px] font-bold tracking-tight text-white font-sans">
            {formatBRL(totalPrizeSum)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            Subvenção econômica, bolsas e prêmios
          </p>
        </div>

        <div className="text-[11px] font-mono text-cyan-400/90 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>Ver maiores montantes</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      {/* Metric 2: Editais de Fomento */}
      <div
        onClick={onFilterEditais || onFilterConferences}
        className="cursor-pointer group relative rounded-2xl bg-[#0B0F19]/90 border border-white/10 p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(99,102,241,0.12)] min-h-[148px] overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />

        <div className="flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Editais & FAPs
            </span>
          </div>
          <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
            <Landmark className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-1.5 relative z-10">
          <div className="text-2xl sm:text-[26px] font-bold tracking-tight text-white font-sans">
            {editaisCount} editais
          </div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            FUNCAP, FINEP, FAPESP, CNPq e agências
          </p>
        </div>

        <div className="text-[11px] font-mono text-indigo-400/90 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>Filtrar chamadas públicas</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      {/* Metric 3: Foco Ceará & Nordeste */}
      <div
        onClick={onFilterCeara}
        className="cursor-pointer group relative rounded-2xl bg-[#0B0F19]/90 border border-white/10 p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)] min-h-[148px] overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

        <div className="flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Ecossistema Ceará
            </span>
          </div>
          <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
            <MapPin className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-1.5 relative z-10">
          <div className="text-2xl sm:text-[26px] font-bold tracking-tight text-white font-sans">
            {cearaCount} oportunidades
          </div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            FUNCAP, Secitece, Corredores Digitais, BNB
          </p>
        </div>

        <div className="text-[11px] font-mono text-emerald-400/90 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>Ver chamadas CE</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      {/* Metric 4: Prazos Críticos */}
      <div
        onClick={onFilterEndingSoon}
        className="cursor-pointer group relative rounded-2xl bg-[#0B0F19]/90 border border-white/10 p-5 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.12)] min-h-[148px] overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

        <div className="flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Prazos Críticos
            </span>
          </div>
          <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-1.5 relative z-10">
          <div className="text-2xl sm:text-[26px] font-bold tracking-tight text-white font-sans">
            {urgentCount} encerram logo
          </div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            Submissões encerrando em menos de 7 dias
          </p>
        </div>

        <div className="text-[11px] font-mono text-amber-400/90 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>Ver prazos urgentes</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}
