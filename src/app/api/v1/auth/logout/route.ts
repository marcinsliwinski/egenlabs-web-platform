import { NextResponse } from 'next/server';

import { env } from '@/lib/env';
import { revokeAdminSessionByToken } from '@/features/auth/auth-service';

export async function POST(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const sessionCookieName = `${env.AUTH_SESSION_COOKIE_NAME}=`;
  const sessionToken = cookieHeader
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(sessionCookieName))
    ?.slice(sessionCookieName.length);

  await revokeAdminSessionByToken(sessionToken);

  const response = NextResponse.redirect(new URL('/admin/login?logged_out=1', request.url), {
    status: 303
  });

  response.cookies.set({
    name: env.AUTH_SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });

  return response;
}
