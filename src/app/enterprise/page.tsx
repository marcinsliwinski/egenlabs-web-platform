import Link from 'next/link';

import { PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { createEnterpriseInterestAction } from '@/features/forms/forms-actions';

const successMessages: Record<string, string> = {
  enterprise_saved: 'Dziękujemy. Zgłoszenie zostało zapisane.'
};

const errorMessages: Record<string, string> = {
  invalid_enterprise_input: 'Uzupełnij wymagane pola formularza.',
  marketing_consent_missing: 'Aktualna definicja zgody marketingowej nie jest dostępna. Spróbuj ponownie po weryfikacji administracyjnej.'
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EnterprisePage({ searchParams }: { searchParams?: SearchParams }) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const successKey = getSearchParamValue(resolvedSearchParams?.success);
  const errorKey = getSearchParamValue(resolvedSearchParams?.error);

  return (
    <PublicShell>
      <PageContainer>
        <section className="split-layout">
          <div>
            <SectionHeader eyebrow="Firmy i zespoły" title="Opisz potrzeby większego użycia produktu albo przyszłej edycji Pro">
              <p>
                Ten formularz służy do rozmów o szerszych potrzebach: zespołach, procesach, dokumentacji, raportowaniu i potencjalnych edycjach komercyjnych produktów eGen.
              </p>
            </SectionHeader>
            <div className="cta-row">
              <Link className="text-link" href="/">Wróć na stronę główną</Link>
              <Link className="text-link" href="/contact">Kontakt ogólny</Link>
            </div>
          </div>

          <section className="form-card">
            {successKey ? <p role="status" className="alert alert--success">{successMessages[successKey] ?? 'Zgłoszenie zostało zapisane.'}</p> : null}
            {errorKey ? <p role="alert" className="alert alert--error">{errorMessages[errorKey] ?? 'Nie udało się zapisać zgłoszenia.'}</p> : null}

            <form action={createEnterpriseInterestAction} className="form-grid">
              <label className="form-label">
                <span>Imię i nazwisko</span>
                <input type="text" name="name" required maxLength={120} />
              </label>

              <label className="form-label">
                <span>Email</span>
                <input type="email" name="email" required maxLength={320} />
              </label>

              <label className="form-label">
                <span>Firma</span>
                <input type="text" name="company" required maxLength={160} />
              </label>

              <label className="form-label">
                <span>Rola (opcjonalnie)</span>
                <input type="text" name="role" maxLength={120} />
              </label>

              <label className="form-label">
                <span>Wielkość zespołu (opcjonalnie)</span>
                <input type="text" name="teamSize" maxLength={120} placeholder="np. 10 użytkowników" />
              </label>

              <label className="form-label">
                <span>Opis potrzeb</span>
                <textarea name="message" required minLength={20} maxLength={4000} rows={8} />
              </label>

              <label className="checkbox-label">
                <input type="checkbox" name="marketingConsent" />
                <span>Wyrażam zgodę na przyszłą komunikację marketingową i newsletter eGen Labs.</span>
              </label>

              <button type="submit">Wyślij zgłoszenie</button>
            </form>
          </section>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
