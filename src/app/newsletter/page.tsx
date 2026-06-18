import Link from 'next/link';

import { NewsletterSignupForm } from '@/components/newsletter-signup-form';
import { PageContainer, PublicShell, SectionHeader } from '@/components/public-site';

const successMessages: Record<string, string> = {
  newsletter_saved: 'Dziękujemy. Zapis do newslettera został przyjęty.'
};

const errorMessages: Record<string, string> = {
  invalid_newsletter_input: 'Podaj prawidłowy adres email i potwierdź zgodę marketingową.',
  marketing_consent_missing: 'Aktualna definicja zgody marketingowej nie jest dostępna. Spróbuj ponownie po weryfikacji administracyjnej.'
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewsletterPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const successKey = getSearchParamValue(resolvedSearchParams?.newsletterSuccess);
  const errorKey = getSearchParamValue(resolvedSearchParams?.newsletterError);

  return (
    <PublicShell>
      <PageContainer>
        <section className="split-layout split-layout--balanced">
          <div>
            <SectionHeader eyebrow="Newsletter" title="Aktualności eGen Labs">
              <p>Otrzymuj informacje o premierach, nowych materiałach, dokumentacji i rozwoju rozwiązań eGen Labs.</p>
            </SectionHeader>
            <div className="cta-row">
              <Link className="text-link" href="/products">Zobacz rozwiązania</Link>
              <Link className="text-link" href="/contact">Kontakt</Link>
            </div>
          </div>

          <section className="form-card" id="newsletter">
            {successKey ? <p role="status" className="alert alert--success">{successMessages[successKey] ?? 'Zapis został przyjęty.'}</p> : null}
            {errorKey ? <p role="alert" className="alert alert--error">{errorMessages[errorKey] ?? 'Nie udało się zapisać zgłoszenia.'}</p> : null}
            <NewsletterSignupForm returnPath="/newsletter" />
          </section>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
