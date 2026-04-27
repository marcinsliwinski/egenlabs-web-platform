import Link from 'next/link';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { saveDownloadPolicyAction } from '@/features/downloads/download-actions';
import {
  DOWNLOAD_POLICY_MODE_OPTIONS,
  getDownloadPolicyOverview,
  getPolicyModeLabel
} from '@/features/downloads/download-service';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type AdminDownloadsPageProps = {
  searchParams?: SearchParams;
};

const successMessages: Record<string, string> = {
  policy_saved: 'Download policy saved successfully.'
};

const errorMessages: Record<string, string> = {
  forbidden: 'Only admins can modify download policy data.',
  invalid_policy_input: 'Download policy form data is invalid. Review the required fields and try again.',
  product_not_found: 'Selected product does not exist or is inactive.',
  edition_not_found: 'Selected edition does not exist, is inactive, or does not belong to the selected product.',
  channel_not_found: 'Selected release channel does not exist or is inactive.',
  ttl_required: 'Temporary download policies require a positive TTL value in minutes.'
};

function getSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDownloadsPage({ searchParams }: AdminDownloadsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const successKey = getSearchParamValue(resolvedSearchParams?.success);
  const errorKey = getSearchParamValue(resolvedSearchParams?.error);

  const [admin, overview] = await Promise.all([requireAuthenticatedAdmin(), getDownloadPolicyOverview()]);
  const isAdmin = admin.role === 'ADMIN';

  return (
    <main style={{ maxWidth: 1200, margin: '4rem auto', padding: '0 1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Download policies</h1>
          <p>Configure the accepted MVP download policy baseline per product, edition, and release channel.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/admin/catalog">Back to catalog</Link>
          <Link href="/admin/leads">Open leads and consents</Link>
          <Link href="/download/register">Open public registration shell</Link>
          <Link href="/admin">Back to admin</Link>
        </div>
      </header>

      <section style={{ marginTop: '1.5rem' }}>
        <p>
          Signed in as <strong>{admin.email}</strong> ({admin.role})
        </p>
        {!isAdmin ? (
          <p role="status" style={{ color: '#5f4b00' }}>
            Read-only mode: Editors can review policy readiness but cannot modify download policies.
          </p>
        ) : null}
        {successKey ? (
          <p role="status" style={{ color: '#0b6b2d' }}>
            {successMessages[successKey] ?? 'Operation completed successfully.'}
          </p>
        ) : null}
        {errorKey ? (
          <p role="alert" style={{ color: '#b00020' }}>
            {errorMessages[errorKey] ?? 'Unable to complete the requested download policy operation.'}
          </p>
        ) : null}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Foundation status</h2>
        <ul>
          <li>Configured policies: {overview.stats.policyCount}</li>
          <li>Configured combinations: {overview.stats.configuredPolicyCount}</li>
          <li>Ready combinations: {overview.stats.readyCombinationCount}</li>
          <li>Download requests recorded: {overview.stats.downloadRequestCount}</li>
          <li>Download links issued: {overview.stats.downloadLinkCount}</li>
        </ul>
        <p>
          This step now connects the configured policy baseline to the public registration shell and lead capture
          foundation. It still does not expose final email issuance or download endpoints.
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Mode reference</h2>
        <ul>
          {DOWNLOAD_POLICY_MODE_OPTIONS.map((option) => (
            <li key={option.value}>
              <strong>{option.label}</strong> — {option.description}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '2rem', display: 'grid', gap: '1.5rem' }}>
        {overview.combinations.length === 0 ? (
          <p>Run <code>npm run catalog:bootstrap</code> before configuring download policies.</p>
        ) : (
          overview.combinations.map((item) => (
            <article
              key={item.id}
              style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '1rem' }}
            >
              <header>
                <h3 style={{ marginBottom: '0.25rem' }}>
                  {item.product.name} / {item.edition.name} / {item.channel.name}
                </h3>
                <p style={{ margin: 0 }}>
                  Active build:{' '}
                  {item.activeBuild
                    ? `${item.activeBuild.version} (#${item.activeBuild.buildNumber})`
                    : 'none configured'}
                </p>
                <p style={{ margin: '0.5rem 0 0', color: item.resolution.status === 'ready' ? '#0b6b2d' : '#6b4d00' }}>
                  {item.resolution.summary}
                </p>
                {'buildSummary' in item.resolution ? (
                  <p style={{ margin: '0.25rem 0 0', color: '#444' }}>{item.resolution.buildSummary}</p>
                ) : null}
              </header>

              {item.policy ? (
                <section>
                  <h4>Current policy</h4>
                  <ul>
                    <li>Mode: {getPolicyModeLabel(item.policy.mode)}</li>
                    <li>Enabled: {item.policy.isEnabled ? 'Yes' : 'No'}</li>
                    <li>Require active build: {item.policy.requireActiveBuild ? 'Yes' : 'No'}</li>
                    <li>Email registration required: {item.policy.requireEmailRegistration ? 'Yes' : 'No'}</li>
                    <li>
                      TTL (minutes):{' '}
                      {item.policy.mode === 'TEMPORARY'
                        ? (item.policy.linkTtlMinutes ?? 'Not set')
                        : 'Not applicable'}
                    </li>
                    <li>Notes: {item.policy.internalNotes ?? '—'}</li>
                  </ul>
                </section>
              ) : (
                <p>No download policy configured yet.</p>
              )}

              {isAdmin ? (
                <form action={saveDownloadPolicyAction} style={{ display: 'grid', gap: '1rem' }}>
                  <input type="hidden" name="productId" value={item.product.id} />
                  <input type="hidden" name="editionId" value={item.edition.id} />
                  <input type="hidden" name="channelId" value={item.channel.id} />

                  <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                    <label style={{ display: 'grid', gap: '0.25rem' }}>
                      <span>Policy mode</span>
                      <select name="mode" required defaultValue={item.policy?.mode ?? 'TEMPORARY'}>
                        {DOWNLOAD_POLICY_MODE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label style={{ display: 'grid', gap: '0.25rem' }}>
                      <span>TTL in minutes</span>
                      <input
                        type="number"
                        min="1"
                        name="linkTtlMinutes"
                        defaultValue={item.policy?.linkTtlMinutes ?? 1440}
                        placeholder="Required for temporary policy"
                      />
                    </label>
                  </div>

                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Internal notes</span>
                    <textarea name="internalNotes" rows={3} defaultValue={item.policy?.internalNotes ?? ''} />
                  </label>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <label style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input type="checkbox" name="isEnabled" defaultChecked={item.policy?.isEnabled ?? true} />
                      <span>Policy enabled</span>
                    </label>

                    <label style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        name="requireActiveBuild"
                        defaultChecked={item.policy?.requireActiveBuild ?? true}
                      />
                      <span>Require active build</span>
                    </label>

                    <label style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        name="requireEmailRegistration"
                        defaultChecked={item.policy?.requireEmailRegistration ?? true}
                      />
                      <span>Require email registration</span>
                    </label>
                  </div>

                  <div>
                    <button type="submit">Save download policy</button>
                  </div>
                </form>
              ) : null}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
