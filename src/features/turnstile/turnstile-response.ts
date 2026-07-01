export const TURNSTILE_RESPONSE_FIELD = 'cf-turnstile-response';

export type TurnstileSiteverifyResponse = {
  success?: unknown;
  challenge_ts?: unknown;
  hostname?: unknown;
  action?: unknown;
  'error-codes'?: unknown;
};

type TurnstileValidationOptions = {
  expectedAction: string;
  expectedHostname: string;
  maxAgeSeconds: number;
  clockSkewSeconds: number;
  now?: Date;
};

type TurnstileTokenResult =
  | { success: true; token: string }
  | { success: false; reason: 'missing_token' | 'invalid_token' };

export type TurnstileResponseResult =
  | { success: true; challengeTimestamp: Date }
  | {
      success: false;
      reason:
        | 'provider_rejected'
        | 'action_mismatch'
        | 'hostname_mismatch'
        | 'invalid_challenge_timestamp'
        | 'expired_token'
        | 'future_challenge_timestamp';
      errorCodes?: string[];
    };

export function parseTurnstileToken(value: FormDataEntryValue | null): TurnstileTokenResult {
  if (typeof value !== 'string') {
    return { success: false, reason: 'missing_token' };
  }

  const token = value.trim();

  if (!token) {
    return { success: false, reason: 'missing_token' };
  }

  if (token.length > 2048) {
    return { success: false, reason: 'invalid_token' };
  }

  return { success: true, token };
}

function getErrorCodes(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const codes = value.filter((item): item is string => typeof item === 'string').slice(0, 10);
  return codes.length > 0 ? codes : undefined;
}

export function evaluateTurnstileResponse(
  response: TurnstileSiteverifyResponse,
  options: TurnstileValidationOptions
): TurnstileResponseResult {
  if (response.success !== true) {
    return {
      success: false,
      reason: 'provider_rejected',
      errorCodes: getErrorCodes(response['error-codes'])
    };
  }

  if (response.action !== options.expectedAction) {
    return { success: false, reason: 'action_mismatch' };
  }

  if (response.hostname !== options.expectedHostname) {
    return { success: false, reason: 'hostname_mismatch' };
  }

  if (typeof response.challenge_ts !== 'string') {
    return { success: false, reason: 'invalid_challenge_timestamp' };
  }

  const challengeTimestamp = new Date(response.challenge_ts);

  if (Number.isNaN(challengeTimestamp.getTime())) {
    return { success: false, reason: 'invalid_challenge_timestamp' };
  }

  const now = options.now ?? new Date();
  const ageSeconds = (now.getTime() - challengeTimestamp.getTime()) / 1000;

  if (ageSeconds < -options.clockSkewSeconds) {
    return { success: false, reason: 'future_challenge_timestamp' };
  }

  if (ageSeconds > options.maxAgeSeconds) {
    return { success: false, reason: 'expired_token' };
  }

  return { success: true, challengeTimestamp };
}
