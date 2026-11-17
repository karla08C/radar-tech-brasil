import assert from 'node:assert/strict';
import test from 'node:test';
import { parseApplications, summarizeApplications } from '../src/utils/applicationUtils';

test('restores valid candidatures and discards malformed entries without losing valid ones', () => {
  const restored = parseApplications(JSON.stringify({
    a: { eventId: 'a', status: 'submetido', amount: 125000.50, updatedAt: '2026-11-17' },
    b: { eventId: 'b', status: 'interesse', amount: -10, updatedAt: '2026-11-17' },
    c: { eventId: 'other-id', status: 'aprovado', updatedAt: '2026-11-17' },
    d: { eventId: 'd', status: 'invalid', updatedAt: '2026-11-17' },
    e: null,
  }));
  assert.deepEqual(Object.keys(restored), ['a', 'b']);
  assert.equal(restored.a.amount, 125000.50);
  assert.equal(restored.b.amount, undefined);
  assert.deepEqual(parseApplications(JSON.stringify(restored)), restored);
});

test('handles absent, corrupted, and structurally invalid browser storage', () => {
  for (const raw of [null, '{broken', 'null', '[]', '42', '"text"']) {
    assert.deepEqual(parseApplications(raw), {});
  }
});

test('sums individual proposal values only in the appropriate funnel stages', () => {
  const statuses = ['interesse', 'elaboracao', 'submetido', 'aprovado', 'nao_selecionado'] as const;
  const applications = statuses.map((status, index) => ({
    eventId: String(index), status, amount: (index + 1) * 100, updatedAt: '2026-11-17',
  }));
  assert.deepEqual(summarizeApplications(applications), { inDispute: 500, approved: 400, withoutAmount: 0 });
  assert.deepEqual(summarizeApplications([
    { eventId: 'unknown', status: 'submetido', updatedAt: '2026-11-17' },
    { eventId: 'zero', status: 'aprovado', amount: 0, updatedAt: '2026-11-17' },
  ]), { inDispute: 0, approved: 0, withoutAmount: 1 });
  assert.deepEqual(summarizeApplications([]), { inDispute: 0, approved: 0, withoutAmount: 0 });
});
