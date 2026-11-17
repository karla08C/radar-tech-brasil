import { useState } from 'react';
import type { ApplicationsByEvent, ApplicationStatus, TechEvent } from '../types';
import { APPLICATION_STAGES, summarizeApplications } from '../utils/applicationUtils';
import { formatBRL, formatDateBR } from '../utils/eventUtils';
import { ApplicationStatusSelect } from './ApplicationStatusSelect';

interface ApplicationsViewProps {
  events: TechEvent[];
  applications: ApplicationsByEvent;
  onStatusChange: (eventId: string, status: ApplicationStatus | '') => void;
  onAmountChange: (eventId: string, amount?: number) => void;
  onSelectEvent: (event: TechEvent) => void;
}

export function ApplicationsView({ events, applications, onStatusChange, onAmountChange, onSelectEvent }: ApplicationsViewProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const tracked = events.filter(event => applications[event.id]);
  const summary = summarizeApplications(tracked.map(event => applications[event.id]));

  return (
    <section aria-label="Quadro de candidaturas" className="mb-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">Minhas candidaturas</h2>
        <p className="mt-1 text-xs text-slate-400">Acompanhe uma oportunidade pelo seletor Candidatura nos cards ou no raio-X. Arraste os cards ou use o seletor para mudar de etapa.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ['Em disputa', formatBRL(summary.inDispute)],
          ['Aprovado', formatBRL(summary.approved)],
          ['Candidaturas', String(tracked.length)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-[#121824] p-4">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-1 text-xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400">Em disputa considera propostas em elaboração e submetidas. Os totais usam os valores individuais informados abaixo. {summary.withoutAmount > 0 && `${summary.withoutAmount} candidatura(s) sem valor informado.`}</p>
      {tracked.length === 0 && <p className="rounded-lg border border-slate-700 p-4 text-sm text-slate-300">Você ainda não acompanha nenhuma candidatura. Volte para Oportunidades e escolha uma etapa no edital desejado.</p>}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {APPLICATION_STAGES.map(stage => {
          const stageEvents = tracked.filter(event => applications[event.id].status === stage.value);
          return (
            <section key={stage.value} aria-label={stage.label}
              onDragOver={event => { if (draggedId) event.preventDefault(); }}
              onDrop={event => {
                event.preventDefault();
                if (draggedId && applications[draggedId]) onStatusChange(draggedId, stage.value);
                setDraggedId(null);
              }}
              className="min-w-0 rounded-xl border border-slate-800 bg-[#0F141F] p-3">
              <h3 className="mb-3 text-xs font-semibold text-slate-200">{stage.label} <span className="text-slate-500">({stageEvents.length})</span></h3>
              <div className="space-y-3">
                {stageEvents.map(event => (
                  <article key={event.id} draggable
                    onDragStart={dragEvent => {
                      setDraggedId(event.id);
                      dragEvent.dataTransfer.effectAllowed = 'move';
                      dragEvent.dataTransfer.setData('text/plain', event.id);
                    }}
                    onDragEnd={() => setDraggedId(null)}
                    className="rounded-lg border border-slate-700 bg-[#121824] p-3 space-y-3">
                    <button onClick={() => onSelectEvent(event)} className="text-left text-xs font-semibold text-white hover:underline">{event.title}</button>
                    <p className="text-[11px] text-slate-400">Prazo: {event.isContinuousFlow ? 'Fluxo contínuo' : formatDateBR(event.registrationDeadline)}</p>
                    <ApplicationStatusSelect eventTitle={event.title} status={stage.value} onChange={status => onStatusChange(event.id, status)} />
                    <label className="block text-xs text-slate-400">Valor da proposta (R$)
                      <input type="number" min="0" step="0.01" inputMode="decimal"
                        aria-label={`Valor da proposta: ${event.title}`}
                        value={applications[event.id].amount ?? ''} placeholder="Não informado"
                        onChange={inputEvent => {
                          const raw = inputEvent.target.value;
                          const amount = inputEvent.target.valueAsNumber;
                          if (raw === '') onAmountChange(event.id, undefined);
                          else if (Number.isFinite(amount) && amount >= 0) onAmountChange(event.id, amount);
                        }}
                        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-slate-200" />
                    </label>
                  </article>
                ))}
                {stageEvents.length === 0 && <p className="py-5 text-center text-xs text-slate-500">Nenhuma candidatura</p>}
              </div>
            </section>
          );
        })}
      </div>
      <p className="text-xs text-slate-500">As candidaturas ficam salvas neste navegador. Selecionar “Não acompanhar” remove a candidatura e seu valor do quadro.</p>
    </section>
  );
}
