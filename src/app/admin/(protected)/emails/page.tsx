import Link from 'next/link';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { getEmailAdminOverview } from '@/features/email/email-service';

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value);
}

export default async function AdminEmailsPage() {
  const [admin, overview] = await Promise.all([requireAuthenticatedAdmin(), getEmailAdminOverview()]);

  return (
    <main style={{ maxWidth: 1200, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Transactional emails</h1>
          <p>Review seeded templates, transport-mode email logs, and generated download delivery links.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/download/register">Open public registration shell</Link>
          <Link href="/admin/leads">Open leads and consents</Link>
          <Link href="/admin">Back to admin</Link>
        </div>
      </header>

      <section>
        <p>
          Signed in as <strong>{admin.email}</strong> ({admin.role})
        </p>
        <ul>
          <li>Templates: {overview.stats.templateCount}</li>
          <li>Email logs: {overview.stats.emailLogCount}</li>
          <li>Sent logs: {overview.stats.sentEmailCount}</li>
          <li>Failed logs: {overview.stats.failedEmailCount}</li>
          <li>Issued download links: {overview.stats.issuedLinkCount}</li>
        </ul>
      </section>

      <section>
        <h2>Seeded transactional templates</h2>
        {overview.templates.length === 0 ? (
          <p>No email templates are available yet. Apply the latest migration state first.</p>
        ) : (
          <ul>
            {overview.templates.map((template) => (
              <li key={template.id}>
                <strong>{template.key}</strong> v{template.version} — {template.name} — {template.isActive ? 'active' : 'inactive'}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Recent email logs</h2>
        {overview.emailLogs.length === 0 ? (
          <p>No transactional email logs recorded yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {overview.emailLogs.map((log) => (
              <article
                key={log.id}
                style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '0.75rem' }}
              >
                <header>
                  <h3 style={{ marginBottom: '0.25rem' }}>{log.subject}</h3>
                  <p style={{ margin: 0 }}>
                    To: <strong>{log.toEmail}</strong> · Status: {log.status} · Sent: {formatDate(log.sentAt)}
                  </p>
                  <p style={{ margin: '0.5rem 0 0' }}>
                    Template: {log.templateKey}
                    {log.templateVersion ? ` v${log.templateVersion}` : ''} · Transport: {log.transportMode}
                  </p>
                </header>

                <section>
                  <ul>
                    <li>Lead: {log.lead?.email ?? '—'}</li>
                    <li>
                      Request:{' '}
                      {log.downloadRequest
                        ? `${log.downloadRequest.product.name} / ${log.downloadRequest.edition.name} / ${log.downloadRequest.channel.name} (${log.downloadRequest.status})`
                        : '—'}
                    </li>
                    <li>
                      Download link:{' '}
                      {log.downloadLink
                        ? `${log.downloadLink.mode} / ${log.downloadLink.status}`
                        : '—'}
                    </li>
                    <li>Error: {log.errorMessage ?? '—'}</li>
                  </ul>
                </section>

                <details>
                  <summary>Email body preview</summary>
                  <pre
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      background: '#f7f7f7',
                      padding: '0.75rem',
                      borderRadius: '8px'
                    }}
                  >
                    {log.textBody}
                  </pre>
                </details>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
