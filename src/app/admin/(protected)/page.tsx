import Link from 'next/link';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { getCatalogOverview } from '@/features/catalog/catalog-service';
import { getAdminContentOverview } from '@/features/content/content-service';
import { getEmailAdminOverview } from '@/features/email/email-service';
import { getFormsAdminOverview } from '@/features/forms/forms-service';

export default async function AdminHomePage() {
  const [admin, overview, emailOverview, contentOverview, formsOverview] = await Promise.all([
    requireAuthenticatedAdmin(),
    getCatalogOverview(),
    getEmailAdminOverview(),
    getAdminContentOverview(),
    getFormsAdminOverview()
  ]);
  const canManageCatalog = admin.role === 'ADMIN';

  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1rem' }}>
      <h1>Admin panel</h1>
      <p>
        Admin auth shell, content foundation, download foundation, leads/consents, transactional email delivery, public form foundations, and final delivery shell are active.
      </p>
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
          <li>Brevo deliveries: {emailOverview.stats.brevoEmailCount}</li>
          <li>Log-only deliveries: {emailOverview.stats.logOnlyEmailCount}</li>
          <li>FAQ entries: {contentOverview.stats.faqCount}</li>
          <li>Published blog posts: {contentOverview.stats.publishedBlogPostCount}</li>
          <li>Newsletter signups: {formsOverview.stats.newsletterCount}</li>
          <li>Contact inquiries: {formsOverview.stats.contactInquiryCount}</li>
          <li>Enterprise interest submissions: {formsOverview.stats.enterpriseInterestCount}</li>
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
          <Link href="/admin/content">Open content management</Link>
        </p>
        <p>
          <Link href="/admin/forms">Open newsletter, contact, and enterprise forms</Link>
        </p>
        <p>
          <Link href="/products/fito-gen">Open product landing</Link>
        </p>
        <p>
          <Link href="/download/register">Open public registration shell</Link>
        </p>
        <p>
          <Link href="/newsletter">Open newsletter-only signup</Link>
        </p>
        <p>{canManageCatalog ? 'You can create and activate builds.' : 'You currently have read-only access to catalog data.'}</p>
      </section>

      <form action="/api/v1/auth/logout" method="post">
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
