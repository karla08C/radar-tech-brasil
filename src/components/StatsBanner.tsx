import { Trophy, Landmark, MapPin, Clock, ArrowRight } from 'lucide-react';
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
  onFilterCeara,
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Metric 1: Total Mapeado (Violet Glow) */}
      <div
        onClick={onFilterHighPrizes}
        className="group relative cursor-pointer rounded-2xl bg-[#0C0F17]/80 hover:bg-[#121624] border border-white/8 hover:border-violet-500/40 p-4 transition-all duration-300 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-indigo-500 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-violet-300/90 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400"></span>
            Fomento Total
          </span>
          <Trophy className="w-3.5 h-3.5 text-violet-400/70 group-hover:text-violet-300 transition-colors" />
        </div>

        <div className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
          {formatBRL(totalPrizeSum)}
        </div>

        <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>Subvenção & bolsas</span>
          <ArrowRight className="w-3 h-3 text-violet-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </p>
      </div>

      {/* Metric 2: Editais de Fomento (Cyan Glow) */}
      <div
        onClick={onFilterEditais}
        className="group relative cursor-pointer rounded-2xl bg-[#0C0F17]/80 hover:bg-[#121624] border border-white/8 hover:border-cyan-500/40 p-4 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-teal-400 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300/90 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
            Chamadas FAPs
          </span>
          <Landmark className="w-3.5 h-3.5 text-cyan-400/70 group-hover:text-cyan-300 transition-colors" />
        </div>

        <div className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
          {editaisCount} editais
        </div>

        <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>FUNCAP, FINEP, CNPq</span>
          <ArrowRight className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </p>
      </div>

      {/* Metric 3: Foco Ceará & Nordeste (Emerald Glow) */}
      <div
        onClick={onFilterCeara}
        className="group relative cursor-pointer rounded-2xl bg-[#0C0F17]/80 hover:bg-[#121624] border border-white/8 hover:border-emerald-500/40 p-4 transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-teal-500 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300/90 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Ceará & Nordeste
          </span>
          <MapPin className="w-3.5 h-3.5 text-emerald-400/70 group-hover:text-emerald-300 transition-colors" />
        </div>

        <div className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
          {cearaCount} editais
        </div>

        <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>Secitece, BNB, Inovafit</span>
          <ArrowRight className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </p>
      </div>

      {/* Metric 4: Prazos Críticos (Fuchsia / Amber Glow) */}
      <div
        onClick={onFilterEndingSoon}
        className="group relative cursor-pointer rounded-2xl bg-[#0C0F17]/80 hover:bg-[#121624] border border-white/8 hover:border-fuchsia-500/40 p-4 transition-all duration-300 hover:shadow-[0_0_25px_rgba(236,72,153,0.15)] overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-fuchsia-500 via-amber-400 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-fuchsia-300/90 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fuchsia-400"></span>
            </span>
            Prazos Críticos
          </span>
          <Clock className="w-3.5 h-3.5 text-fuchsia-400/70 group-hover:text-fuchsia-300 transition-colors" />
        </div>

        <div className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
          {urgentCount} encerram logo
        </div>

        <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>Submissões &lt; 7 dias</span>
          <ArrowRight className="w-3 h-3 text-fuchsia-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </p>
      </div>
    </div>
  );
}
