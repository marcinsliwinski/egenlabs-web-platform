import { redirect } from 'next/navigation';

import {
  ADMIN_DEFAULT_PATH,
  AUTH_ERROR_SEARCH_PARAM,
  PASSWORD_MIN_LENGTH
} from '@/features/auth/constants';
import { getCurrentAdmin, sanitizeNextPath } from '@/features/auth/auth-service';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type LoginPageProps = {
  searchParams?: SearchParams;
};

const errorMessages: Record<string, string> = {
  invalid_credentials: 'Invalid email or password.',
  account_locked: 'Account temporarily locked. Try again later.',
  account_disabled: 'Account is disabled.',
  session_expired: 'Please sign in to continue.'
};

function getSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect(ADMIN_DEFAULT_PATH);
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const errorKey = getSearchParamValue(resolvedSearchParams?.[AUTH_ERROR_SEARCH_PARAM]);
  const nextPath = sanitizeNextPath(getSearchParamValue(resolvedSearchParams?.next));
  const loggedOut = getSearchParamValue(resolvedSearchParams?.logged_out) === '1';

  return (
    <main style={{ maxWidth: 480, margin: '4rem auto', padding: '0 1rem' }}>
      <h1>Admin sign in</h1>
      <p>Use an admin account to access the protected control panel.</p>

      {errorKey ? (
        <p role="alert" style={{ color: '#b00020' }}>
          {errorMessages[errorKey] ?? 'Unable to sign in.'}
        </p>
      ) : null}

      {loggedOut ? <p>You have been signed out.</p> : null}

      <form action="/api/v1/auth/login" method="post" style={{ display: 'grid', gap: '1rem' }}>
        <input type="hidden" name="next" value={nextPath} />

        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>

        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span>Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            minLength={PASSWORD_MIN_LENGTH}
            required
          />
        </label>

        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}
