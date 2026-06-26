import Link from 'next/link';

import { PageContainer, PublicShell, SectionHeader } from '@/components/public-site';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewsletterConfirmPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolved = searchParams ? await searchParams : undefined;
  const token = getSearchParamValue(resolved?.token);
  const hasToken = typeof token === 'string' && token.length >= 32 && token.length <= 256;

  return (
    <PublicShell>
      <PageContainer>
        <section className="form-card">
          <SectionHeader eyebrow="Newsletter" title="Potwierdź zapis">
            <p>
              {hasToken
                ? 'Kliknij poniższy przycisk, aby aktywować zapis do newslettera eGen Labs.'
                : 'Link potwierdzający jest nieprawidłowy lub niekompletny.'}
            </p>
          </SectionHeader>

          {hasToken ? (
            <form action="/api/v1/newsletter/confirm" method="post">
              <input type="hidden" name="token" value={token} />
              <button type="submit">Potwierdź zapis</button>
            </form>
          ) : (
            <Link className="button" href="/newsletter">Wyślij formularz ponownie</Link>
          )}
        </section>
      </PageContainer>
    </PublicShell>
  );
}
