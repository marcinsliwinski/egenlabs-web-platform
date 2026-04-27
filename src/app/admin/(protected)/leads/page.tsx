import Link from 'next/link';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { getLeadAdminOverview } from '@/features/leads/lead-service';

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value);
}

export default async function AdminLeadsPage() {
  const [admin, overview] = await Promise.all([requireAuthenticatedAdmin(), getLeadAdminOverview()]);

  return (
    <main style={{ maxWidth: 1200, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Leads and consents</h1>
          <p>Review recorded download registration leads, consent history, and pending requests.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/download/register">Open public registration shell</Link>
          <Link href="/admin/downloads">Back to download policies</Link>
          <Link href="/admin/emails">Open email logs</Link>
          <Link href="/admin">Back to admin</Link>
        </div>
      </header>

      <section>
        <p>
          Signed in as <strong>{admin.email}</strong> ({admin.role})
        </p>
        <ul>
          <li>Total leads: {overview.stats.leadCount}</li>
          <li>Download requests linked to leads: {overview.stats.requestCount}</li>
          <li>Granted marketing consents: {overview.stats.grantedMarketingCount}</li>
          <li>
            Active download-registration consent version:{' '}
            {overview.latestDefinitions.downloadRegistration?.version ?? 'missing'}
          </li>
          <li>
            Active marketing consent version: {overview.latestDefinitions.marketingEmail?.version ?? 'missing'}
          </li>
        </ul>
      </section>

      <section>
        <h2>Lead overview</h2>
        {overview.leads.length === 0 ? (
          <p>No leads recorded yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {overview.leads.map((lead) => (
              <article key={lead.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '0.75rem' }}>
                <header>
                  <h3 style={{ marginBottom: '0.25rem' }}>{lead.email}</h3>
                  <p style={{ margin: 0 }}>First seen: {formatDate(lead.firstSeenAt)} · Last seen: {formatDate(lead.lastSeenAt)}</p>
                </header>

                <section>
                  <h4>Latest consent state</h4>
                  <ul>
                    <li>
                      Download registration:{' '}
                      {lead.latestDownloadConsent
                        ? `${lead.latestDownloadConsent.granted ? 'granted' : 'not granted'} at ${formatDate(lead.latestDownloadConsent.capturedAt)}`
                        : 'no record'}
                    </li>
                    <li>
                      Marketing email:{' '}
                      {lead.latestMarketingConsent
                        ? `${lead.latestMarketingConsent.granted ? 'granted' : 'not granted'} at ${formatDate(lead.latestMarketingConsent.capturedAt)}`
                        : 'no record'}
                    </li>
                  </ul>
                </section>

                <section>
                  <h4>Recent download requests</h4>
                  {lead.downloadRequests.length === 0 ? (
                    <p>No download requests linked to this lead yet.</p>
                  ) : (
                    <ul>
                      {lead.downloadRequests.map((request) => (
                        <li key={request.id}>
                          {request.product.name} / {request.edition.name} / {request.channel.name} — status {request.status} — requested {formatDate(request.requestedAt)}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
