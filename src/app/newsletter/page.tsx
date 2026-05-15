import Link from 'next/link';

import { PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { createNewsletterSignupAction } from '@/features/forms/forms-actions';

const successMessages: Record<string, string> = {
  newsletter_saved: 'Dziękujemy. Zapis do newslettera został zapisany.'
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
  const successKey = getSearchParamValue(resolvedSearchParams?.success);
  const errorKey = getSearchParamValue(resolvedSearchParams?.error);

  return (
    <PublicShell>
      <PageContainer>
        <section className="split-layout">
          <div>
            <SectionHeader eyebrow="Newsletter" title="Otrzymuj informacje o produktach eGen Labs.">
              <p>
                Zapisz się, aby dostać informacje o starcie Fito Gen Essentials, nowych materiałach oraz kolejnych narzędziach eGen Labs.
              </p>
            </SectionHeader>
            <div className="cta-row">
              <Link className="text-link" href="/">Wróć na stronę główną</Link>
              <Link className="text-link" href="/contact">Kontakt</Link>
            </div>
          </div>

          <section className="form-card">
            {successKey ? <p role="status" className="alert alert--success">{successMessages[successKey] ?? 'Zapis został zapisany.'}</p> : null}
            {errorKey ? <p role="alert" className="alert alert--error">{errorMessages[errorKey] ?? 'Nie udało się zapisać zgłoszenia.'}</p> : null}

            <form action={createNewsletterSignupAction} className="form-grid">
              <label className="form-label">
                <span>Email</span>
                <input type="email" name="email" required maxLength={320} placeholder="name@example.com" />
              </label>

              <label className="checkbox-label">
                <input type="checkbox" name="marketingConsent" required />
                <span>Wyrażam zgodę na otrzymywanie komunikacji marketingowej i newslettera eGen Labs.</span>
              </label>

              <button type="submit">Zapisz mnie</button>
            </form>
          </section>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
