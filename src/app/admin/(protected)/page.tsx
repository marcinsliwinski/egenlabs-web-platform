import Link from 'next/link';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { getCatalogOverview } from '@/features/catalog/catalog-service';
import { getAdminContentOverview } from '@/features/content/content-service';
import { getEmailAdminOverview } from '@/features/email/email-service';
import { getFormsAdminOverview } from '@/features/forms/forms-service';
import { getAdminDesktopIntakeOverview, getAdminDesktopOverview } from '@/features/desktop/desktop-service';
import { getAdminPdfOverview } from '@/features/pdf/pdf-service';
import { getAdminAuditSummary } from '@/features/audit/audit-service';

export default async function AdminHomePage() {
  const [admin, overview, emailOverview, contentOverview, formsOverview, desktopOverview, desktopIntakeOverview, pdfOverview, auditSummary] = await Promise.all([
    requireAuthenticatedAdmin(),
    getCatalogOverview(),
    getEmailAdminOverview(),
    getAdminContentOverview(),
    getFormsAdminOverview(),
    getAdminDesktopOverview(),
    getAdminDesktopIntakeOverview(),
    getAdminPdfOverview(),
    getAdminAuditSummary()
  ]);
  const canManageCatalog = admin.role === 'ADMIN';

  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1rem' }}>
      <h1>Admin panel</h1>
      <p>
        Admin auth shell, content foundation, download foundation, PDF one-pager management, leads/consents, transactional email delivery, public form foundations, and desktop-facing API foundations are active.
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
          <li>Configured PDF one-pagers: {pdfOverview.stats.totalPdfCount}</li>
          <li>Enabled PDF one-pagers: {pdfOverview.stats.enabledPdfCount}</li>
          <li>Newsletter signups: {formsOverview.stats.newsletterCount}</li>
          <li>Contact inquiries: {formsOverview.stats.contactInquiryCount}</li>
          <li>Enterprise interest submissions: {formsOverview.stats.enterpriseInterestCount}</li>
          <li>Desktop news items: {desktopOverview.stats.newsItemCount}</li>
          <li>Published desktop news items: {desktopOverview.stats.publishedNewsItemCount}</li>
          <li>Telemetry events: {desktopIntakeOverview.stats.telemetryEventCount}</li>
          <li>Feature requests: {desktopIntakeOverview.stats.featureRequestCount}</li>
          <li>Software demand requests: {desktopIntakeOverview.stats.softwareDemandCount}</li>
          <li>Audit log entries: {auditSummary.auditLogCount}</li>
          <li>Audit log entries in last 24h: {auditSummary.recentAuditLogCount}</li>
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
          <Link href="/admin/pdfs">Open PDF one-pager management</Link>
        </p>
        <p>
          <Link href="/admin/forms">Open newsletter, contact, and enterprise forms</Link>
        </p>
        <p>
          <Link href="/admin/desktop">Open desktop API management</Link>
        </p>
        <p>
          <Link href="/admin/desktop/intake">Open telemetry and feedback intake</Link>
        </p>
        <p>
          <Link href="/admin/operations">Open audit log and CSV exports</Link>
        </p>
        <p>
          <Link href="/products/fito-gen">Open product landing</Link>
        </p>
        <p>
          <Link href="/one-pager/fito-gen-one-pager">Open PDF one-pager sample</Link>
        </p>
        <p>
          <Link href="/download/register">Open public registration shell</Link>
        </p>
        <p>
          <Link href="/newsletter">Open newsletter-only signup</Link>
        </p>
        <p>
          <Link href="/api/v1/desktop/update?product=fito-gen&edition=essentials&channel=stable&currentVersion=0.0.0">Open desktop update sample</Link>
        </p>
        <p>{canManageCatalog ? 'You can create and activate builds.' : 'You currently have read-only access to catalog data.'}</p>
      </section>

      <form action="/api/v1/auth/logout" method="post">
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
