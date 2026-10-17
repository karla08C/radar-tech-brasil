import { Trophy, Calendar, Sparkles, Flame, Rocket } from 'lucide-react';
import { TechEvent } from '../types';
import { formatBRL, getDaysRemaining } from '../utils/eventUtils';

interface StatsBannerProps {
  events: TechEvent[];
  onFilterEndingSoon: () => void;
  onFilterHighPrizes: () => void;
  onFilterHackathons?: () => void;
  onFilterConferences?: () => void;
}

export function StatsBanner({
  events,
  onFilterEndingSoon,
  onFilterHighPrizes,
  onFilterHackathons,
  onFilterConferences,
}: StatsBannerProps) {
  const totalPrizeSum = events.reduce((acc, evt) => acc + (evt.prizes?.totalValue || 0), 0);

  const hackathonsCount = events.filter((evt) => evt.category === 'hackathon').length;
  const conferencesCount = events.filter((evt) => evt.category !== 'hackathon').length;

  const urgentCount = events.filter((evt) => {
    const days = getDaysRemaining(evt.registrationDeadline);
    return days >= 0 && days <= 7;
  }).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Metric 1: Total Prizes (Highlight Bento block in Indigo-950) */}
      <div
        onClick={onFilterHighPrizes}
        className="cursor-pointer group rounded-3xl bg-slate-900 text-white p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:bg-black transition-all min-h-[155px]"
      >
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Premiações Totais</span>
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div className="my-1.5">
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">{formatBRL(totalPrizeSum)}</div>
          <p className="text-xs text-slate-300 mt-1">
            Somatório de prêmios em dinheiro e benefícios mapeados.
          </p>
        </div>
        <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Ver maiores premiações →
        </div>
      </div>

      {/* Metric 2: Hackathons Mapeados */}
      <div
        onClick={onFilterHackathons}
        className="cursor-pointer group rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all min-h-[155px]"
      >
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Hackathons & Maratonas</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Rocket className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            {hackathonsCount}
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
              Competições
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Desafios de código em squads com prêmios e contratações.
          </p>
        </div>
        <div className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Ver só Hackathons →
        </div>
      </div>

      {/* Metric 3: Conferências & Summits */}
      <div
        onClick={onFilterConferences}
        className="cursor-pointer group rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-sky-300 transition-all min-h-[155px]"
      >
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Eventos & Conferências</span>
          <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            {conferencesCount}
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">
              Summits & Encontros
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grandes palcos de tecnologia, feiras e networking no país.
          </p>
        </div>
        <div className="text-[11px] font-bold text-sky-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Ver só Conferências →
        </div>
      </div>

      {/* Metric 4: Urgent / Ending soon */}
      <div
        onClick={onFilterEndingSoon}
        className="cursor-pointer group rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-rose-300 transition-all min-h-[155px]"
      >
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Inscrições Urgentes</span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            {urgentCount}
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
              Últimos dias
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Prazos de submissão encerrando nos próximos 7 dias.
          </p>
        </div>
        <div className="text-[11px] font-bold text-rose-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Ver prazos que encerram logo →
        </div>
      </div>
    </div>
  );
}
