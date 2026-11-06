import { Trophy, Landmark, Flame, MapPin, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
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
        className="cursor-pointer group rounded-2xl bg-slate-900 text-white p-5 flex flex-col justify-between shadow-xs hover:bg-slate-800 transition-all min-h-[145px]"
      >
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            Fomento Total Mapeado
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div className="my-1.5">
          <div className="text-2xl font-bold tracking-tight text-white">{formatBRL(totalPrizeSum)}</div>
          <p className="text-xs text-slate-400 mt-1">
            Subvenção econômica, bolsas e prêmios.
          </p>
        </div>
        <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>Ver maiores valores</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Metric 2: Editais de Fomento */}
      <div
        onClick={onFilterEditais || onFilterConferences}
        className="cursor-pointer group rounded-2xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all min-h-[145px]"
      >
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Editais de Fomento & FAPs
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Landmark className="w-4 h-4" />
          </div>
        </div>
        <div className="my-1.5">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {editaisCount} editais
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chamadas da FUNCAP, FINEP, FAPESP e CNPq.
          </p>
        </div>
        <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>Filtrar editais públicos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Metric 3: Foco Ceará & Nordeste */}
      <div
        onClick={onFilterCeara}
        className="cursor-pointer group rounded-2xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all min-h-[145px]"
      >
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Ecossistema Ceará
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <div className="my-1.5">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {cearaCount} oportunidades
          </div>
          <p className="text-xs text-slate-500 mt-1">
            FUNCAP Inovafit, Corredores Digitais e Hubine.
          </p>
        </div>
        <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>Filtrar Ceará</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Metric 4: Prazos Críticos (< 7 dias) */}
      <div
        onClick={onFilterEndingSoon}
        className="cursor-pointer group rounded-2xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all min-h-[145px]"
      >
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Prazos Próximos
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="my-1.5">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {urgentCount} encerrando
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Inscrições nos próximos 7 dias.
          </p>
        </div>
        <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>Ver prazos urgentes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
