import type { ApplicationStatus } from '../types';
import { APPLICATION_STAGES } from '../utils/applicationUtils';

interface ApplicationStatusSelectProps {
  eventTitle: string;
  status?: ApplicationStatus;
  onChange: (status: ApplicationStatus | '') => void;
}

export function ApplicationStatusSelect({ eventTitle, status, onChange }: ApplicationStatusSelectProps) {
  return (
    <label className="block text-xs text-slate-400" onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}>
      Candidatura
      <select
        aria-label={`Status da candidatura: ${eventTitle}`}
        value={status ?? ''}
        onChange={e => onChange(e.target.value as ApplicationStatus | '')}
        className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-400"
      >
        <option value="">Não acompanhar</option>
        {APPLICATION_STAGES.map(stage => <option key={stage.value} value={stage.value}>{stage.label}</option>)}
      </select>
    </label>
  );
}
