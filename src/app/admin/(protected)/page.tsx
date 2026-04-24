import Link from 'next/link';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { getCatalogOverview } from '@/features/catalog/catalog-service';

export default async function AdminHomePage() {
  const [admin, overview] = await Promise.all([requireAuthenticatedAdmin(), getCatalogOverview()]);

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

      <section style={{ marginTop: '2rem' }}>
        <h2>Foundation status</h2>
        <ul>
          <li>Products: {overview.stats.productCount}</li>
          <li>Release channels: {overview.stats.releaseChannelCount}</li>
          <li>Builds: {overview.stats.buildCount}</li>
          <li>Active builds: {overview.stats.activeBuildCount}</li>
        </ul>
        <p>
          <Link href="/admin/catalog">Open product catalog foundation</Link>
        </p>
      </section>

      <form action="/api/v1/auth/logout" method="post">
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
