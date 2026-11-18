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

export function StatsBanner({ events, onFilterEndingSoon, onFilterHighPrizes, onFilterEditais, onFilterCeara }: StatsBannerProps) {
  const metrics = [
    { label: 'Recursos mapeados', value: formatBRL(events.reduce((sum, event) => sum + (event.prizes?.totalValue || 0), 0)), action: onFilterHighPrizes },
    { label: 'Editais e bolsas', value: events.filter(event => event.category === 'edital_fomento' || event.category === 'bolsa_pesquisa').length, action: onFilterEditais },
    { label: 'No Ceará', value: events.filter(event => event.location.state === 'CE').length, action: onFilterCeara },
    { label: 'Encerram em até 7 dias', value: events.filter(event => { const days = getDaysRemaining(event.registrationDeadline); return days >= 0 && days <= 7; }).length, action: onFilterEndingSoon },
  ];
  return (
    <div className="mb-9 grid grid-cols-2 gap-y-5 border-y border-stone-200 py-5 sm:grid-cols-4">
      {metrics.map((metric, index) => (
        <button key={metric.label} onClick={metric.action} className={`group px-4 text-left first:pl-0 sm:px-6 ${index % 2 ? 'border-l border-stone-200' : ''} ${index === 2 ? 'sm:border-l sm:border-stone-200' : ''}`}>
          <span className="block text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">{metric.value}</span>
          <span className="mt-1 block text-xs text-stone-500 group-hover:text-brand-600">{metric.label}</span>
        </button>
      ))}
    </div>
  );
}
