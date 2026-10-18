import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getEvidenceStatusDetails,
  getEvidenceOriginDetails,
  getRelationshipStatusDetails,
  generateCustomSandboxAssessment
} from './investigations.ts';

test('getEvidenceStatusDetails maps all defined statuses correctly', () => {
  const verified = getEvidenceStatusDetails('verified');
  assert.equal(verified.label, 'Verified');
  assert.equal(verified.tone, 'success');

  const unknown = getEvidenceStatusDetails('unknown');
  assert.equal(unknown.label, 'Unknown (Needs Evidence)');
  assert.equal(unknown.symbol, '○');

  const contradicted = getEvidenceStatusDetails('contradicted');
  assert.equal(contradicted.tone, 'danger');
  assert.equal(contradicted.symbol, '✖');
});

test('getEvidenceOriginDetails identifies user-provided vs public sources', () => {
  const user = getEvidenceOriginDetails('user_provided');
  assert.match(user.label, /User-Provided/);
  assert.equal(user.tone, 'warning');

  const pub = getEvidenceOriginDetails('public_source');
  assert.equal(pub.label, 'Public Source');
});

test('getRelationshipStatusDetails formats relationship symbols', () => {
  const confirmed = getRelationshipStatusDetails('confirmed');
  assert.equal(confirmed.symbol, '—✓—');

  const candidate = getRelationshipStatusDetails('candidate');
  assert.equal(candidate.symbol, '--?--');
});

test('generateCustomSandboxAssessment produces isolated result without RelayForge data', () => {
  const result = generateCustomSandboxAssessment({
    companyName: 'Acme Test Labs',
    description: 'Testing custom sandbox input',
    stage: 'Bootstrapped',
    currency: 'USD',
    goals: ['Reduce cloud bill', 'Speed up CI'],
    tools: [
      { name: 'GCP Compute', monthlyCost: 300 },
      { name: 'CircleCI', monthlyCost: 50 }
    ],
    constraints: ['No vendor lock-in']
  });

  assert.equal(result.companyName, 'Acme Test Labs');
  assert.equal(result.isCustomSandbox, true);
  assert.equal(result.overview.total_monthly_cost, 350);
  assert.equal(result.overview.tools?.length, 2);
  assert.equal(result.overview.goals?.length, 2);
  assert.equal(result.investigations.length, 1);
  // Ensure no RelayForge tools leaked
  assert.equal(result.overview.tools?.some((t: { name: string }) => t.name === 'Sentry'), false);
  // Ensure relationship path is labeled synthetic
  assert.equal(result.investigations[0].relationshipPath?.isSynthetic, true);
  // Ensure retaining option exists
  assert.equal(result.investigations[0].recommendations?.[0].allowRetainingCurrentSetup, true);
});
