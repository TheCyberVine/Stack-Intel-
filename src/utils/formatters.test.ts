import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatConfidencePercent,
  formatIsoDate,
  calculateStackHealthScore,
  getStatusDetails,
  isValidHttpUrl,
  sanitizeInput
} from './formatters.ts';

test('formatConfidencePercent formats clamped percentages', () => {
  assert.equal(formatConfidencePercent(0.98), '98%');
  assert.equal(formatConfidencePercent(1.0), '100%');
  assert.equal(formatConfidencePercent(0.0), '0%');
  assert.equal(formatConfidencePercent(0.456), '46%');
  // Bounds
  assert.equal(formatConfidencePercent(1.5), '100%');
  assert.equal(formatConfidencePercent(-0.2), '0%');
  assert.equal(formatConfidencePercent(NaN), '0%');
});

test('formatIsoDate formats valid dates gracefully', () => {
  const result = formatIsoDate('2026-10-15T12:00:00Z');
  assert.match(result, /2026/);
  assert.equal(formatIsoDate('invalid-string'), 'Invalid date');
  assert.equal(formatIsoDate(''), 'N/A');
});

test('calculateStackHealthScore calculates weighted normalized score', () => {
  // Empty
  assert.equal(calculateStackHealthScore([]), 0);

  // All 100% operational
  const perfect = [
    { status: 'operational', confidence: 1.0 },
    { status: 'operational', confidence: 1.0 }
  ];
  assert.equal(calculateStackHealthScore(perfect), 100);

  // Mixed items
  const mixed = [
    { status: 'operational', confidence: 1.0 }, // 1.0 * 1.0 = 1.0
    { status: 'deprecated', confidence: 1.0 }   // 0.2 * 1.0 = 0.2
  ];
  // (1.2 / 2) * 100 = 60
  assert.equal(calculateStackHealthScore(mixed), 60);
});

test('getStatusDetails provides status label and accessibility symbol', () => {
  const operational = getStatusDetails('operational');
  assert.equal(operational.tone, 'success');
  assert.equal(operational.accessibleSymbol, '●');

  const review = getStatusDetails('review');
  assert.equal(review.tone, 'warning');
  assert.equal(review.accessibleSymbol, '▲');

  const deprecated = getStatusDetails('deprecated');
  assert.equal(deprecated.tone, 'danger');
  assert.equal(deprecated.accessibleSymbol, '✖');
});

test('getStatusDetails distinguishes non-interchangeable Part 4 decision statuses', () => {
  const draft = getStatusDetails('draft');
  assert.equal(draft.label, 'Draft');
  assert.equal(draft.tone, 'neutral');

  const awaiting = getStatusDetails('awaiting_approval');
  assert.equal(awaiting.label, 'Awaiting Approval');
  assert.equal(awaiting.tone, 'warning');

  const approved = getStatusDetails('approved');
  assert.equal(approved.label, 'Approved (Not Executed)');
  assert.equal(approved.tone, 'info');

  const executed = getStatusDetails('executed');
  assert.equal(executed.label, 'Executed (Pending Outcome)');
  assert.equal(executed.tone, 'cyan');

  const verified = getStatusDetails('outcome_verified');
  assert.equal(verified.label, 'Outcome Verified');
  assert.equal(verified.tone, 'success');

  const rejected = getStatusDetails('rejected');
  assert.equal(rejected.label, 'Rejected');
  assert.equal(rejected.tone, 'danger');

  // Verify non-interchangeability: approved vs executed vs outcome_verified are strictly distinct
  assert.notEqual(approved.label, executed.label);
  assert.notEqual(executed.label, verified.label);
  assert.notEqual(approved.tone, executed.tone);
  assert.notEqual(executed.tone, verified.tone);
  assert.notEqual(approved.accessibleSymbol, executed.accessibleSymbol);
  assert.notEqual(executed.accessibleSymbol, verified.accessibleSymbol);
});

test('isValidHttpUrl rejects unsafe schemes and accepts valid HTTP/HTTPS URLs', () => {
  assert.equal(isValidHttpUrl('https://aws.amazon.com/startups/credits/'), true);
  assert.equal(isValidHttpUrl('http://localhost:3000'), true);
  assert.equal(isValidHttpUrl('https://sentry.io'), true);

  // Security rejections
  assert.equal(isValidHttpUrl('javascript:alert(document.cookie)'), false);
  assert.equal(isValidHttpUrl('data:text/html,<script>alert(1)</script>'), false);
  assert.equal(isValidHttpUrl('file:///etc/passwd'), false);
  assert.equal(isValidHttpUrl(''), false);
  assert.equal(isValidHttpUrl('not a url'), false);
  assert.equal(isValidHttpUrl(null), false);
  assert.equal(isValidHttpUrl(undefined), false);
});

test('sanitizeInput enforces boundaries and trims whitespace', () => {
  assert.equal(sanitizeInput('   hello world   '), 'hello world');
  assert.equal(sanitizeInput('a'.repeat(300), 250).length, 250);
  assert.equal(sanitizeInput(null), '');
  assert.equal(sanitizeInput(undefined), '');
});

