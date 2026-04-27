import Link from 'next/link';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { getCatalogOverview } from '@/features/catalog/catalog-service';
import { getEmailAdminOverview } from '@/features/email/email-service';

export default async function AdminHomePage() {
  const [admin, overview, emailOverview] = await Promise.all([
    requireAuthenticatedAdmin(),
    getCatalogOverview(),
    getEmailAdminOverview()
  ]);
  const canManageCatalog = admin.role === 'ADMIN';

  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1rem' }}>
      <h1>Admin panel</h1>
      <p>Admin auth shell, download foundation, leads/consents, transactional email shell, and final delivery shell are active.</p>
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
          <li>Configured download policies: {overview.downloadStats.policyCount}</li>
          <li>Download-ready combinations: {overview.downloadStats.readyCombinationCount}</li>
          <li>Recorded download requests: {overview.downloadStats.downloadRequestCount}</li>
          <li>Issued download links: {overview.downloadStats.downloadLinkCount}</li>
          <li>Transactional email logs: {emailOverview.stats.emailLogCount}</li>
        </ul>
        <p>
          <Link href="/admin/catalog">Open product catalog</Link>
        </p>
        <p>
          <Link href="/admin/downloads">Open download policies</Link>
        </p>
        <p>
          <Link href="/admin/leads">Open leads and consents</Link>
        </p>
        <p>
          <Link href="/admin/emails">Open transactional email logs</Link>
        </p>
        <p>
          <Link href="/download/register">Open public registration shell</Link>
        </p>
        <p>{canManageCatalog ? 'You can create and activate builds.' : 'You currently have read-only access to catalog data.'}</p>
      </section>

      <form action="/api/v1/auth/logout" method="post">
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
