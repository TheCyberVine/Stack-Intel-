import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCompanyOverview, formatCurrency } from './normalizers.ts';

test('formatCurrency formats USD amounts correctly', () => {
  assert.equal(formatCurrency(465), '$465');
  assert.equal(formatCurrency(26), '$26');
  assert.equal(formatCurrency(491), '$491');
  assert.equal(formatCurrency(0), '$0');
});

test('normalizeCompanyOverview handles full RelayForge payload', () => {
  const raw = {
    company_id: 'relayforge',
    name: 'RelayForge',
    currency: 'USD',
    tools: [
      { id: 'aws', name: 'AWS', monthlyCost: 465 },
      { id: 'sentry', name: 'Sentry', monthlyCost: 26 }
    ],
    goals: [
      { id: 'g1', title: 'Improve Efficiency' }
    ],
    constraints: [
      { id: 'c1', statement: 'Human approval required' }
    ]
  };

  const normalized = normalizeCompanyOverview(raw as Record<string, unknown>, 'relayforge');
  assert.equal(normalized.company_id, 'relayforge');
  assert.equal(normalized.name, 'RelayForge');
  assert.equal(normalized.total_monthly_cost, 491);
  assert.equal(normalized.tools?.length, 2);
  assert.equal(normalized.goals?.length, 1);
  assert.equal(normalized.constraints?.length, 1);
  assert.equal(normalized.pending_decisions?.length, 0);
});

test('normalizeCompanyOverview handles sparse or missing payload gracefully', () => {
  const normalized = normalizeCompanyOverview({}, 'fallback-id');
  assert.equal(normalized.company_id, 'fallback-id');
  assert.equal(normalized.name, 'fallback-id');
  assert.equal(normalized.total_monthly_cost, 0);
  assert.deepEqual(normalized.tools, []);
  assert.deepEqual(normalized.goals, []);
  assert.deepEqual(normalized.constraints, []);
  assert.deepEqual(normalized.opportunities, []);
});
