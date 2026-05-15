import Link from 'next/link';

import { PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { createContactInquiryAction } from '@/features/forms/forms-actions';

const successMessages: Record<string, string> = {
  contact_saved: 'Dziękujemy. Wiadomość została zapisana.'
};

const errorMessages: Record<string, string> = {
  invalid_contact_input: 'Uzupełnij wymagane pola formularza.',
  marketing_consent_missing: 'Aktualna definicja zgody marketingowej nie jest dostępna. Spróbuj ponownie po weryfikacji administracyjnej.'
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ContactPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const successKey = getSearchParamValue(resolvedSearchParams?.success);
  const errorKey = getSearchParamValue(resolvedSearchParams?.error);

  return (
    <PublicShell>
      <PageContainer>
        <section className="split-layout">
          <div>
            <SectionHeader eyebrow="Kontakt" title="Porozmawiajmy o produkcie, dokumentacji albo współpracy.">
              <p>
                Napisz, czego potrzebujesz: informacji o Fito Gen, materiałów branżowych, dokumentacji, współpracy albo przyszłych produktach eGen Labs.
              </p>
            </SectionHeader>
            <div className="cta-row">
              <Link className="text-link" href="/">Wróć na stronę główną</Link>
              <Link className="text-link" href="/newsletter">Newsletter</Link>
            </div>
          </div>

          <section className="form-card">
            {successKey ? <p role="status" className="alert alert--success">{successMessages[successKey] ?? 'Wiadomość została zapisana.'}</p> : null}
            {errorKey ? <p role="alert" className="alert alert--error">{errorMessages[errorKey] ?? 'Nie udało się zapisać wiadomości.'}</p> : null}

            <form action={createContactInquiryAction} className="form-grid">
              <label className="form-label">
                <span>Imię i nazwisko</span>
                <input type="text" name="name" required maxLength={120} />
              </label>

              <label className="form-label">
                <span>Email</span>
                <input type="email" name="email" required maxLength={320} />
              </label>

              <label className="form-label">
                <span>Firma (opcjonalnie)</span>
                <input type="text" name="company" maxLength={160} />
              </label>

              <label className="form-label">
                <span>Temat</span>
                <select name="topic" defaultValue="GENERAL">
                  <option value="GENERAL">Ogólny kontakt</option>
                  <option value="PRODUCT">Produkt</option>
                  <option value="SUPPORT">Wsparcie</option>
                  <option value="PARTNERSHIP">Współpraca</option>
                </select>
              </label>

              <label className="form-label">
                <span>Wiadomość</span>
                <textarea name="message" required minLength={10} maxLength={4000} rows={8} />
              </label>

              <label className="checkbox-label">
                <input type="checkbox" name="marketingConsent" />
                <span>Wyrażam zgodę na przyszłą komunikację marketingową i newsletter eGen Labs.</span>
              </label>

              <button type="submit">Wyślij wiadomość</button>
            </form>
          </section>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
