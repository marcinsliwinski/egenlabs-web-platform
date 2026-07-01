import Link from 'next/link';

import { PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { TurnstileWidget } from '@/components/turnstile-widget';
import { registerDownloadRequestAction } from '@/features/leads/lead-actions';
import { getPublicDownloadRegistrationOverview } from '@/features/leads/lead-service';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type DownloadRegistrationPageProps = {
  searchParams?: SearchParams;
};

const successMessages: Record<string, string> = {
  registration_saved: 'Rejestracja została zapisana. Sprawdź wiadomość email z informacją o dostępie do pobrania.'
};

const errorMessages: Record<string, string> = {
  invalid_registration_input: 'Formularz jest niepełny albo nieprawidłowy. Sprawdź wymagane pola i spróbuj ponownie.',
  download_combination_unavailable: 'Wybrana kombinacja pobrania nie jest już dostępna.',
  required_consent_missing: 'Brakuje wymaganej definicji zgody operacyjnej.',
  marketing_consent_missing: 'Brakuje definicji zgody marketingowej.',
  download_issue_failed: 'Rejestracja została zapisana, ale techniczne wydanie linku pobrania nie powiodło się.',
  turnstile_verification_failed: 'Nie udało się zweryfikować formularza. Odśwież stronę i spróbuj ponownie.'
};

function getSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DownloadRegistrationPage({ searchParams }: DownloadRegistrationPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const successKey = getSearchParamValue(resolvedSearchParams?.success);
  const errorKey = getSearchParamValue(resolvedSearchParams?.error);
  const overview = await getPublicDownloadRegistrationOverview();
  const defaultCombination = overview.combinations[0];

  return (
    <PublicShell>
      <PageContainer>
        <SectionHeader eyebrow="Fito Gen" title="Rejestracja pobrania">
          <p>Zarejestruj adres email, aby otrzymać dostęp do właściwego wydania aplikacji i informacji związanych z pobraniem.</p>
        </SectionHeader>

        {successKey ? <p role="status" className="alert alert--success">{successMessages[successKey] ?? 'Rejestracja zakończona pomyślnie.'}</p> : null}
        {errorKey ? <p role="alert" className="alert alert--error">{errorMessages[errorKey] ?? 'Nie udało się zakończyć rejestracji pobrania.'}</p> : null}

        <section className="form-card">
          <h2>Formularz rejestracji</h2>
          {overview.combinations.length === 0 ? (
            <p>Pobieranie nie jest obecnie dostępne. Skontaktuj się z eGen Labs, aby uzyskać informacje o wydaniu.</p>
          ) : !overview.consentDefinitions.downloadRegistration || !overview.consentDefinitions.marketingEmail ? (
            <p>Formularz jest czasowo niedostępny. Spróbuj ponownie później lub skontaktuj się z eGen Labs.</p>
          ) : (
            <form action={registerDownloadRequestAction} className="form-grid">
              <label className="form-label">
                <span>Produkt / edycja / kanał</span>
                <select name="combinationId" required defaultValue={defaultCombination?.id}>
                  {overview.combinations.map((combination) => (
                    <option key={combination.id} value={combination.id}>
                      {combination.productName} / {combination.editionName} / {combination.channelName}
                      {combination.buildVersion
                        ? ` — build ${combination.buildVersion} (#${combination.buildNumber})`
                        : ''}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-label">
                <span>Email</span>
                <input name="email" type="email" required placeholder="name@example.com" autoComplete="email" />
              </label>

              <label className="checkbox-label">
                <input name="downloadRegistrationConsent" type="checkbox" required />
                <span>Wyrażam zgodę na użycie adresu email do obsługi tej rejestracji pobrania produktu.</span>
              </label>

              <label className="checkbox-label">
                <input name="marketingConsent" type="checkbox" />
                <span>Wyrażam zgodę na przyszłe wiadomości marketingowe i newsletter eGen Labs.</span>
              </label>

              <TurnstileWidget action="download_registration" />

              <button type="submit">Zarejestruj pobranie</button>
            </form>
          )}
        </section>

        <section className="card">
          <h2>Informacje o pobraniu</h2>
          <p>Adres email jest wykorzystywany do obsługi rejestracji i przekazania informacji o dostępie. Zgoda marketingowa pozostaje opcjonalna.</p>
          <Link className="text-link" href="/products/fito-gen">Wróć do Fito Gen</Link>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
