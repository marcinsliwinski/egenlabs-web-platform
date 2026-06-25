import { NextResponse } from 'next/server';

import { authEnv } from '@/features/auth/auth-env';
import { PASSWORD_MIN_LENGTH } from '@/features/auth/constants';
import {
  authenticateAdminUser,
  createAdminSession,
  sanitizeNextPath
} from '@/features/auth/auth-service';

function getStringValue(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value : '';
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = getStringValue(formData.get('email')).trim();
  const password = getStringValue(formData.get('password'));
  const nextPath = sanitizeNextPath(getStringValue(formData.get('next')));

  if (!email || password.length < PASSWORD_MIN_LENGTH) {
    return NextResponse.redirect(
      new URL(`/admin/login?error=invalid_credentials&next=${encodeURIComponent(nextPath)}`, authEnv.AUTH_URL),
      { status: 303 }
    );
  }

  const authenticationResult = await authenticateAdminUser(email, password);

  if (!authenticationResult.success) {
    return NextResponse.redirect(
      new URL(
        `/admin/login?error=${authenticationResult.reason}&next=${encodeURIComponent(nextPath)}`,
        authEnv.AUTH_URL
      ),
      { status: 303 }
    );
  }

  const session = await createAdminSession(authenticationResult.user.id);
  const response = NextResponse.redirect(new URL(nextPath, authEnv.AUTH_URL), { status: 303 });

  response.cookies.set(session.cookie);

  return response;
}
