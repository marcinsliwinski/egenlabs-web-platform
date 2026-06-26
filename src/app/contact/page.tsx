import Link from 'next/link';

import { NewsletterSignupForm } from '@/components/newsletter-signup-form';
import { PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { createContactInquiryAction } from '@/features/forms/forms-actions';

const successMessages: Record<string, string> = {
  contact_saved: 'Dziękujemy. Wiadomość została zapisana.'
};

const errorMessages: Record<string, string> = {
  invalid_contact_input: 'Uzupełnij wymagane pola formularza.',
  marketing_consent_missing: 'Aktualna definicja zgody marketingowej nie jest dostępna. Spróbuj ponownie po weryfikacji administracyjnej.'
};

const newsletterSuccessMessages: Record<string, string> = {
  newsletter_saved: 'Dziękujemy. Zapis do newslettera został przyjęty.',
  newsletter_confirmation_sent: 'Sprawdź skrzynkę email i potwierdź zapis do newslettera.',
  newsletter_already_active: 'Ten adres jest już aktywny w newsletterze.'
};

const newsletterErrorMessages: Record<string, string> = {
  invalid_newsletter_input: 'Podaj prawidłowy adres email i potwierdź zgodę.',
  marketing_consent_missing: 'Aktualna definicja zgody marketingowej nie jest dostępna.',
  newsletter_confirmation_failed: 'Zapis oczekuje na potwierdzenie, ale wysłanie wiadomości nie powiodło się.'
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ContactPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const successKey = getSearchParamValue(resolvedSearchParams?.success);
  const errorKey = getSearchParamValue(resolvedSearchParams?.error);
  const newsletterSuccessKey = getSearchParamValue(resolvedSearchParams?.newsletterSuccess);
  const newsletterErrorKey = getSearchParamValue(resolvedSearchParams?.newsletterError);

  return (
    <PublicShell>
      <PageContainer>
        <section className="hero hero--compact contact-hero">
          <div className="hero__content">
            <span className="eyebrow">Kontakt</span>
            <h1>Porozmawiajmy o współpracy</h1>
            <p className="hero__lead">Opisz, czego dotyczy zapytanie. Odpowiemy w sprawie rozwiązania, dokumentacji, dostępności lub współpracy.</p>
          </div>
          <aside className="hero__panel">
            <span className="status-pill">eGen Labs</span>
            <h2>Bezpośredni kontakt</h2>
            <p>Wybierz temat i podaj najważniejsze informacje. Formularz kieruje zapytanie do właściwego obszaru.</p>
            <Link className="text-link" href="/products">Zobacz rozwiązania</Link>
          </aside>
        </section>

        <section className="contact-layout">
          <section className="form-card contact-form-card">
            <SectionHeader eyebrow="Formularz" title="Wyślij zapytanie">
              <p>Podaj kontekst, produkt lub zakres współpracy, którego dotyczy wiadomość.</p>
            </SectionHeader>

            {successKey ? <p role="status" className="alert alert--success">{successMessages[successKey] ?? 'Wiadomość została zapisana.'}</p> : null}
            {errorKey ? <p role="alert" className="alert alert--error">{errorMessages[errorKey] ?? 'Nie udało się zapisać wiadomości.'}</p> : null}

            <form action={createContactInquiryAction} className="form-grid form-grid--contact">
              <label className="form-label">
                <span>Imię i nazwisko</span>
                <input type="text" name="name" required maxLength={120} autoComplete="name" />
              </label>

              <label className="form-label">
                <span>Email</span>
                <input type="email" name="email" required maxLength={320} autoComplete="email" />
              </label>

              <label className="form-label">
                <span>Firma (opcjonalnie)</span>
                <input type="text" name="company" maxLength={160} autoComplete="organization" />
              </label>

              <label className="form-label">
                <span>Temat</span>
                <select name="topic" defaultValue="GENERAL">
                  <option value="GENERAL">Ogólny kontakt</option>
                  <option value="PRODUCT">Rozwiązanie lub produkt</option>
                  <option value="SUPPORT">Wsparcie i dokumentacja</option>
                  <option value="PARTNERSHIP">Współpraca</option>
                </select>
              </label>

              <label className="form-label form-label--wide">
                <span>Wiadomość</span>
                <textarea name="message" required minLength={10} maxLength={4000} rows={7} />
              </label>

              <label className="checkbox-label form-label--wide">
                <input type="checkbox" name="marketingConsent" />
                <span>Wyrażam zgodę na przyszłą komunikację marketingową i newsletter eGen Labs.</span>
              </label>

              <button className="form-label--wide" type="submit">Wyślij wiadomość</button>
            </form>
          </section>

          <aside className="newsletter-card" id="newsletter">
            <span className="eyebrow">Aktualności</span>
            <h2>Newsletter eGen Labs</h2>
            <p>Otrzymuj informacje o premierach, dokumentacji i rozwoju rozwiązań eGen Labs.</p>
            {newsletterSuccessKey ? <p role="status" className="alert alert--success">{newsletterSuccessMessages[newsletterSuccessKey] ?? 'Zapis został przyjęty.'}</p> : null}
            {newsletterErrorKey ? <p role="alert" className="alert alert--error">{newsletterErrorMessages[newsletterErrorKey] ?? 'Nie udało się zapisać.'}</p> : null}
            <NewsletterSignupForm compact returnPath="/contact" />
            <p className="meta-text">Zapis możesz w każdej chwili wycofać. Szczegóły znajdują się w informacjach prawnych.</p>
          </aside>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
