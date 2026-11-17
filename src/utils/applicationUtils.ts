import type { ApplicationsByEvent, ApplicationStatus, EventApplication } from '../types';

export const APPLICATION_STORAGE_KEY = 'radartech_applications';

export const APPLICATION_STAGES: { value: ApplicationStatus; label: string }[] = [
  { value: 'interesse', label: 'Na Mira / Interesse' },
  { value: 'elaboracao', label: 'Em Elaboração' },
  { value: 'submetido', label: 'Submetido' },
  { value: 'aprovado', label: 'Aprovado / Contemplado' },
  { value: 'nao_selecionado', label: 'Não Selecionado' },
];

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return APPLICATION_STAGES.some(stage => stage.value === value);
}

export function parseApplications(raw: string | null): ApplicationsByEvent {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const valid: ApplicationsByEvent = {};
    for (const [id, value] of Object.entries(parsed)) {
      if (!value || typeof value !== 'object') continue;
      const entry = value as EventApplication;
      if (entry.eventId !== id || !isApplicationStatus(entry.status) || typeof entry.updatedAt !== 'string') continue;
      valid[id] = {
        eventId: id,
        status: entry.status,
        updatedAt: entry.updatedAt,
        amount: typeof entry.amount === 'number' && Number.isFinite(entry.amount) && entry.amount >= 0
          ? entry.amount : undefined,
      };
    }
    return valid;
  } catch {
    return {};
  }
}

export function summarizeApplications(applications: EventApplication[]) {
  return applications.reduce((summary, application) => {
    const amount = application.amount ?? 0;
    if (application.status === 'elaboracao' || application.status === 'submetido') summary.inDispute += amount;
    if (application.status === 'aprovado') summary.approved += amount;
    if (application.amount === undefined) summary.withoutAmount++;
    return summary;
  }, { inDispute: 0, approved: 0, withoutAmount: 0 });
}
