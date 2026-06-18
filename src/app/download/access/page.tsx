import Link from 'next/link';

import { PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { inspectIssuedDownloadLinkAccess } from '@/features/downloads/download-service';

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
  const result = await inspectIssuedDownloadLinkAccess({ token, slug });

  return (
    <PublicShell>
      <PageContainer>
        <SectionHeader eyebrow="Fito Gen" title="Dostęp do pobrania">
          <p>Sprawdź status otrzymanego linku i pobierz właściwe wydanie aplikacji, jeśli dostęp jest aktywny.</p>
        </SectionHeader>

        <section className="card">
          <h2>Status</h2>
          <p>{result.summary}</p>
        </section>

        {result.link ? (
          <section className="card">
            <h2>Szczegóły linku</h2>
            <ul className="feature-list">
              <li>Tryb: {result.link.mode}</li>
              <li>Status: {result.link.status}</li>
              <li>Ważny do: {formatDate(result.link.expiresAt)}</li>
              <li>Użyty: {formatDate(result.link.consumedAt)}</li>
              <li>Build: {result.link.build.version} (#{result.link.build.buildNumber})</li>
              <li>
                Kombinacja: {result.link.build.product.name} / {result.link.build.edition.name} / {result.link.build.channel.name}
              </li>
            </ul>

            {'deliveryUrl' in result ? (
              <div className="cta-row">
                <a className="button" href={result.deliveryUrl}>Pobierz przez delivery shell</a>
              </div>
            ) : null}
          </section>
        ) : null}

        <Link className="text-link" href="/products/fito-gen">Wróć do Fito Gen</Link>
      </PageContainer>
    </PublicShell>
  );
}
