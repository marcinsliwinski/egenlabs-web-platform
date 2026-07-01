import { turnstileEnv } from '@/features/turnstile/turnstile-env';
import {
  evaluateTurnstileResponse,
  parseTurnstileToken,
  TURNSTILE_RESPONSE_FIELD,
  type TurnstileSiteverifyResponse
} from '@/features/turnstile/turnstile-response';

type HeaderReader = {
  get(name: string): string | null;
};

export type PublicFormTurnstileAction =
  | 'newsletter_signup'
  | 'contact_inquiry'
  | 'enterprise_interest'
  | 'download_registration';

type VerifyPublicFormTurnstileInput = {
  formData: FormData;
  headerStore: HeaderReader;
  expectedAction: PublicFormTurnstileAction;
};

type VerifyPublicFormTurnstileResult =
  | { success: true; bypassed: boolean }
  | { success: false };

function getClientIp(headerStore: HeaderReader): string | undefined {
  const cloudflareAddress = headerStore.get('cf-connecting-ip')?.trim();

  if (cloudflareAddress) {
    return cloudflareAddress;
  }

  const forwardedFor = headerStore.get('x-forwarded-for');
  const firstForwardedAddress = forwardedFor?.split(',')[0]?.trim();
  return firstForwardedAddress || undefined;
}

function logFailure(action: PublicFormTurnstileAction, reason: string, errorCodes?: string[]) {
  console.warn('[turnstile] verification_failed', {
    action,
    reason,
    errorCodes
  });
}

export function getPublicTurnstileConfig() {
  if (!turnstileEnv.TURNSTILE_ENABLED) {
    return { enabled: false as const };
  }

  return {
    enabled: true as const,
    siteKey: turnstileEnv.TURNSTILE_SITE_KEY!
  };
}

export async function verifyPublicFormTurnstile(
  input: VerifyPublicFormTurnstileInput
): Promise<VerifyPublicFormTurnstileResult> {
  if (!turnstileEnv.TURNSTILE_ENABLED) {
    return { success: true, bypassed: true };
  }

  const tokenResult = parseTurnstileToken(input.formData.get(TURNSTILE_RESPONSE_FIELD));

  if (!tokenResult.success) {
    logFailure(input.expectedAction, tokenResult.reason);
    return { success: false };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), turnstileEnv.TURNSTILE_TIMEOUT_MS);

  try {
    const body = new URLSearchParams({
      secret: turnstileEnv.TURNSTILE_SECRET_KEY!,
      response: tokenResult.token
    });
    const clientIp = getClientIp(input.headerStore);

    if (clientIp) {
      body.set('remoteip', clientIp);
    }

    const response = await fetch(turnstileEnv.TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body,
      cache: 'no-store',
      signal: controller.signal
    });

    if (!response.ok) {
      logFailure(input.expectedAction, `siteverify_http_${response.status}`);
      return { success: false };
    }

    const payload = (await response.json()) as TurnstileSiteverifyResponse;
    const validation = evaluateTurnstileResponse(payload, {
      expectedAction: input.expectedAction,
      expectedHostname: new URL(turnstileEnv.APP_URL).hostname,
      maxAgeSeconds: turnstileEnv.TURNSTILE_TOKEN_MAX_AGE_SECONDS,
      clockSkewSeconds: turnstileEnv.TURNSTILE_CLOCK_SKEW_SECONDS
    });

    if (!validation.success) {
      logFailure(input.expectedAction, validation.reason, validation.errorCodes);
      return { success: false };
    }

    return { success: true, bypassed: false };
  } catch (error) {
    logFailure(
      input.expectedAction,
      error instanceof Error ? error.name : 'siteverify_unknown_error'
    );
    return { success: false };
  } finally {
    clearTimeout(timeout);
  }
}
