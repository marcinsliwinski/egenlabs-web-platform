import Link from 'next/link';

import { resolveIssuedDownloadLinkAccess } from '@/features/email/email-service';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type DownloadAccessPageProps = {
  searchParams?: SearchParams;
};

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value);
}

export default async function DownloadAccessPage({ searchParams }: DownloadAccessPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const token = getSearchParamValue(resolvedSearchParams?.token);
  const slug = getSearchParamValue(resolvedSearchParams?.slug);
  const result = await resolveIssuedDownloadLinkAccess({ token, slug });

  return (
    <main style={{ maxWidth: 900, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '1.5rem' }}>
      <header style={{ display: 'grid', gap: '0.75rem' }}>
        <h1>Download access shell</h1>
        <p>
          This page validates issued download shell links and confirms the accepted MVP issuance flow. Final binary delivery
          is not enabled yet in this step.
        </p>
        <p>
          Go back to the <Link href="/download/register">registration page</Link> or the <Link href="/">home page</Link>.
        </p>
      </header>

      <section style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '1rem' }}>
        <h2>Status</h2>
        <p>{result.summary}</p>
      </section>

      {'link' in result && result.link ? (
        <section style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '1rem' }}>
          <h2>Issued link details</h2>
          <ul>
            <li>Mode: {result.link.mode}</li>
            <li>Status: {result.link.status}</li>
            <li>Expires: {formatDate(result.link.expiresAt)}</li>
            <li>Consumed at: {formatDate(result.link.consumedAt)}</li>
            <li>Build: {result.link.build.version} (#{result.link.build.buildNumber})</li>
            <li>
              Combination: {result.link.build.product.name} / {result.link.build.edition.name} / {result.link.build.channel.name}
            </li>
            <li>Linked request email: {result.link.request?.email ?? '—'}</li>
          </ul>

          <section>
            <h3>Available asset metadata</h3>
            {result.link.build.assets.length === 0 ? (
              <p>No build assets are attached yet. This shell only confirms link issuance.</p>
            ) : (
              <ul>
                {result.link.build.assets.map((asset) => (
                  <li key={asset.id}>
                    <strong>{asset.fileName}</strong>
                    {asset.fileSizeBytes ? ` — ${asset.fileSizeBytes} bytes` : ''}
                    {asset.mimeType ? ` — ${asset.mimeType}` : ''}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>
      ) : null}
    </main>
  );
}
