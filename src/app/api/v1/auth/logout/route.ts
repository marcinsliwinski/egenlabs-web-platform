import { NextResponse } from 'next/server';

import { authEnv } from '@/features/auth/auth-env';
import { revokeAdminSessionByToken } from '@/features/auth/auth-service';

export async function POST(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const sessionCookieName = `${authEnv.AUTH_SESSION_COOKIE_NAME}=`;
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
    name: authEnv.AUTH_SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: authEnv.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });

  return response;
}
