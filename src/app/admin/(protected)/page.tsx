import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';

export default async function AdminHomePage() {
  const admin = await requireAuthenticatedAdmin();

  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1rem' }}>
      <h1>Admin panel</h1>
      <p>Admin auth shell is active.</p>
      <dl>
        <dt>Signed in as</dt>
        <dd>{admin.email}</dd>
        <dt>Role</dt>
        <dd>{admin.role}</dd>
      </dl>

      <form action="/api/v1/auth/logout" method="post">
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
