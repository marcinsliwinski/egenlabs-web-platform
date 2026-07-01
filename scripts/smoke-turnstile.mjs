import assert from 'node:assert/strict';

import {
  evaluateTurnstileResponse,
  parseTurnstileToken
} from '../src/features/turnstile/turnstile-response.ts';

const now = new Date('2026-07-01T10:00:00.000Z');
const options = {
  expectedAction: 'newsletter_signup',
  expectedHostname: 'staging.egenlabs.eu',
  maxAgeSeconds: 300,
  clockSkewSeconds: 30,
  now
};

assert.deepEqual(parseTurnstileToken(null), { success: false, reason: 'missing_token' });
assert.deepEqual(parseTurnstileToken('   '), { success: false, reason: 'missing_token' });
assert.deepEqual(parseTurnstileToken('x'.repeat(2049)), { success: false, reason: 'invalid_token' });
assert.equal(parseTurnstileToken('valid-token').success, true);

const validResponse = {
  success: true,
  challenge_ts: '2026-07-01T09:59:00.000Z',
  hostname: 'staging.egenlabs.eu',
  action: 'newsletter_signup',
  'error-codes': []
};

assert.equal(evaluateTurnstileResponse(validResponse, options).success, true);
assert.deepEqual(
  evaluateTurnstileResponse({ success: false, 'error-codes': ['invalid-input-response'] }, options),
  { success: false, reason: 'provider_rejected', errorCodes: ['invalid-input-response'] }
);
assert.equal(
  evaluateTurnstileResponse({ ...validResponse, action: 'contact_inquiry' }, options).reason,
  'action_mismatch'
);
assert.equal(
  evaluateTurnstileResponse({ ...validResponse, hostname: 'example.com' }, options).reason,
  'hostname_mismatch'
);
assert.equal(
  evaluateTurnstileResponse({ ...validResponse, challenge_ts: '2026-07-01T09:54:59.000Z' }, options).reason,
  'expired_token'
);
assert.equal(
  evaluateTurnstileResponse({ ...validResponse, challenge_ts: '2026-07-01T10:00:31.000Z' }, options).reason,
  'future_challenge_timestamp'
);
assert.equal(
  evaluateTurnstileResponse({ ...validResponse, challenge_ts: 'not-a-date' }, options).reason,
  'invalid_challenge_timestamp'
);

console.log('Turnstile validation smoke checks passed.');
