import { createHmac, randomBytes } from 'node:crypto';

import { authEnv } from '@/features/auth/auth-env';

const SESSION_TOKEN_BYTES = 32;

export function generateSessionToken(): string {
  return randomBytes(SESSION_TOKEN_BYTES).toString('hex');
}

export function hashSessionToken(token: string): string {
  return createHmac('sha256', authEnv.AUTH_SECRET).update(token).digest('hex');
}

export function createSessionExpirationDate(): Date {
  return new Date(Date.now() + authEnv.AUTH_SESSION_TTL_HOURS * 60 * 60 * 1000);
}

export function getSessionCookieOptions(expiresAt: Date) {
  return {
    name: authEnv.AUTH_SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: authEnv.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    expires: expiresAt
  };
}
