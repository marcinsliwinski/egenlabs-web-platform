import Link from 'next/link';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { resendEmailLogAction } from '@/features/email/email-actions';
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

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const successMessages: Record<string, string> = {
  email_resent: 'Transactional email was resent successfully.'
};

const errorMessages: Record<string, string> = {
  forbidden: 'Only ADMIN can resend transactional emails.',
  invalid_resend_request: 'The resend request payload is invalid.',
  email_log_not_found: 'The selected transactional email log was not found.',
  email_resend_failed: 'The resend attempt failed. Review the latest log entry for details.'
};

export default async function AdminEmailsPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const successKey = getSearchParamValue(resolvedSearchParams?.success);
  const errorKey = getSearchParamValue(resolvedSearchParams?.error);
  const [admin, overview] = await Promise.all([requireAuthenticatedAdmin(), getEmailAdminOverview()]);
  const canResend = admin.role === 'ADMIN';

  return (
    <main style={{ maxWidth: 1200, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Transactional emails</h1>
          <p>Review templates, provider-aware email logs, resend selected messages, and inspect issued download links.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/download/register">Open public registration shell</Link>
          <Link href="/admin/leads">Open leads and consents</Link>
          <Link href="/admin">Back to admin</Link>
        </div>
      </header>

      {successKey ? (
        <p role="status" style={{ color: '#0b6b2d' }}>
          {successMessages[successKey] ?? 'The requested email operation completed successfully.'}
        </p>
      ) : null}

      {errorKey ? (
        <p role="alert" style={{ color: '#b00020' }}>
          {errorMessages[errorKey] ?? 'Unable to complete the requested email operation.'}
        </p>
      ) : null}

      <section>
        <p>
          Signed in as <strong>{admin.email}</strong> ({admin.role})
        </p>
        <ul>
          <li>Templates: {overview.stats.templateCount}</li>
          <li>Email logs: {overview.stats.emailLogCount}</li>
          <li>Sent logs: {overview.stats.sentEmailCount}</li>
          <li>Failed logs: {overview.stats.failedEmailCount}</li>
          <li>Brevo deliveries: {overview.stats.brevoEmailCount}</li>
          <li>Log-only deliveries: {overview.stats.logOnlyEmailCount}</li>
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
                    {log.providerName ? ` · Provider: ${log.providerName}` : ''}
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
                    <li>Provider message ID: {log.providerMessageId ?? '—'}</li>
                    <li>Error: {log.errorMessage ?? '—'}</li>
                  </ul>
                </section>

                {canResend ? (
                  <form action={resendEmailLogAction} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <input type="hidden" name="emailLogId" value={log.id} />
                    <button type="submit">Resend this email</button>
                  </form>
                ) : (
                  <p>Only ADMIN can resend transactional emails.</p>
                )}

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
