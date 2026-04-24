import { cache } from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ADMIN_DEFAULT_PATH, ADMIN_LOGIN_PATH } from '@/features/auth/constants';
import { verifyPassword } from '@/features/auth/password';
import {
  createSessionExpirationDate,
  generateSessionToken,
  getSessionCookieOptions,
  hashSessionToken
} from '@/features/auth/session';
import { db } from '@/lib/db';
import { authEnv } from '@/features/auth/auth-env';

export type AuthFailureReason = 'invalid_credentials' | 'account_locked' | 'account_disabled';

export type AuthenticatedAdmin = {
  id: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
};

const SESSION_ERROR = 'session_expired';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function createLockoutExpirationDate(): Date {
  return new Date(Date.now() + authEnv.AUTH_LOCKOUT_MINUTES * 60 * 1000);
}

export function sanitizeNextPath(nextPath: string | null | undefined): string {
  if (!nextPath || !nextPath.startsWith('/admin') || nextPath.startsWith('//')) {
    return ADMIN_DEFAULT_PATH;
  }

  return nextPath;
}

export async function authenticateAdminUser(email: string, password: string): Promise<
  | { success: true; user: AuthenticatedAdmin }
  | { success: false; reason: AuthFailureReason }
> {
  const normalizedEmail = normalizeEmail(email);
  const adminUser = await db.adminUser.findUnique({
    where: { email: normalizedEmail }
  });

  if (!adminUser) {
    return { success: false, reason: 'invalid_credentials' };
  }

  if (!adminUser.isActive) {
    return { success: false, reason: 'account_disabled' };
  }

  if (adminUser.lockedUntil && adminUser.lockedUntil > new Date()) {
    return { success: false, reason: 'account_locked' };
  }

  const isPasswordValid = await verifyPassword(password, adminUser.passwordHash);

  if (!isPasswordValid) {
    const nextFailedLoginAttempts = adminUser.failedLoginAttempts + 1;
    const shouldLockAccount = nextFailedLoginAttempts >= authEnv.AUTH_MAX_FAILED_LOGIN_ATTEMPTS;

    await db.adminUser.update({
      where: { id: adminUser.id },
      data: {
        failedLoginAttempts: shouldLockAccount ? 0 : nextFailedLoginAttempts,
        lockedUntil: shouldLockAccount ? createLockoutExpirationDate() : null
      }
    });

    return {
      success: false,
      reason: shouldLockAccount ? 'account_locked' : 'invalid_credentials'
    };
  }

  await db.adminUser.update({
    where: { id: adminUser.id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date()
    }
  });

  return {
    success: true,
    user: {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    }
  };
}

export async function createAdminSession(userId: string) {
  const sessionToken = generateSessionToken();
  const expiresAt = createSessionExpirationDate();

  await db.adminSession.create({
    data: {
      userId,
      tokenHash: hashSessionToken(sessionToken),
      expiresAt
    }
  });

  return {
    sessionToken,
    expiresAt,
    cookie: {
      ...getSessionCookieOptions(expiresAt),
      value: sessionToken
    }
  };
}

export async function revokeAdminSessionByToken(token: string | null | undefined): Promise<void> {
  if (!token) {
    return;
  }

  await db.adminSession.updateMany({
    where: {
      tokenHash: hashSessionToken(token),
      revokedAt: null
    },
    data: {
      revokedAt: new Date()
    }
  });
}

export const getCurrentAdmin = cache(async (): Promise<AuthenticatedAdmin | null> => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(authEnv.AUTH_SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await db.adminSession.findFirst({
    where: {
      tokenHash: hashSessionToken(sessionToken),
      revokedAt: null,
      expiresAt: {
        gt: new Date()
      }
    },
    include: {
      user: true
    }
  });

  if (!session || !session.user.isActive) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role
  };
});

export async function requireAuthenticatedAdmin(): Promise<AuthenticatedAdmin> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`${ADMIN_LOGIN_PATH}?error=${SESSION_ERROR}`);
  }

  return admin;
}
