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
      {/* Metric 1: Total Mapeado */}
      <div
        onClick={onFilterHighPrizes}
        className="group cursor-pointer rounded-xl bg-[#121824] hover:bg-[#162030] border border-slate-800 hover:border-slate-700 p-4 transition-colors flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            Fomento Total
          </span>
          <Trophy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
        </div>

        <div className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
          {formatBRL(totalPrizeSum)}
        </div>

        <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>Subvenção e bolsas</span>
          <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </p>
      </div>

      {/* Metric 2: Editais FAPs */}
      <div
        onClick={onFilterEditais}
        className="group cursor-pointer rounded-xl bg-[#121824] hover:bg-[#162030] border border-slate-800 hover:border-slate-700 p-4 transition-colors flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            Chamadas FAPs
          </span>
          <Landmark className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
        </div>

        <div className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
          {editaisCount} editais
        </div>

        <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>FUNCAP, FINEP, CNPq</span>
          <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </p>
      </div>

      {/* Metric 3: Ceará & Nordeste */}
      <div
        onClick={onFilterCeara}
        className="group cursor-pointer rounded-xl bg-[#121824] hover:bg-[#162030] border border-slate-800 hover:border-slate-700 p-4 transition-colors flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            Ceará & Nordeste
          </span>
          <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
        </div>

        <div className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
          {cearaCount} editais
        </div>

        <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>Secitece, BNB, FUNCAP</span>
          <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </p>
      </div>

      {/* Metric 4: Prazos Críticos */}
      <div
        onClick={onFilterEndingSoon}
        className="group cursor-pointer rounded-xl bg-[#121824] hover:bg-[#162030] border border-slate-800 hover:border-slate-700 p-4 transition-colors flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/90 flex items-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            Prazos Críticos
          </span>
          <Clock className="w-3.5 h-3.5 text-amber-400/80 group-hover:text-amber-300 transition-colors" />
        </div>

        <div className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
          {urgentCount} encerram logo
        </div>

        <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>Submissão em até 7 dias</span>
          <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </p>
      </div>
    </div>
  );
}
