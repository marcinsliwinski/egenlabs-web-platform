import Link from 'next/link';

import { registerDownloadRequestAction } from '@/features/leads/lead-actions';
import { getPublicDownloadRegistrationOverview } from '@/features/leads/lead-service';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type DownloadRegistrationPageProps = {
  searchParams?: SearchParams;
};

const successMessages: Record<string, string> = {
  registration_saved: 'Registration saved. The transactional email shell created email logs and an issued download link for the accepted MVP flow.'
};

const errorMessages: Record<string, string> = {
  invalid_registration_input: 'The registration form is incomplete or invalid. Review the required fields and try again.',
  download_combination_unavailable: 'The selected download combination is no longer available for registration.',
  required_consent_missing: 'The required operational consent definition is missing. Bootstrap the latest database state and try again.',
  marketing_consent_missing: 'The optional marketing consent definition is missing. Bootstrap the latest database state and try again.',
  download_issue_failed: 'The registration was recorded, but the transactional issuance shell could not prepare the email and download link. Review the admin email logs and download policy state.'
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
    <main style={{ maxWidth: 900, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '1.5rem' }}>
      <header style={{ display: 'grid', gap: '0.75rem' }}>
        <h1>Download registration</h1>
        <p>
          This public shell records the accepted MVP download registration flow: email capture, operational registration,
          optional marketing consent, transactional email logging, and download link issuance.
        </p>
        <p>
          External email delivery is still not enabled in this step. Transactional emails are logged internally, and issued shell links can be reviewed through the admin area. Go back to the <Link href="/">home page</Link>.
        </p>
      </header>

      {successKey ? (
        <p role="status" style={{ color: '#0b6b2d' }}>
          {successMessages[successKey] ?? 'Registration completed successfully.'}
        </p>
      ) : null}

      {errorKey ? (
        <p role="alert" style={{ color: '#b00020' }}>
          {errorMessages[errorKey] ?? 'Unable to complete the download registration request.'}
        </p>
      ) : null}

      <section style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '1rem' }}>
        <h2>Registration form</h2>
        {overview.combinations.length === 0 ? (
          <p>No download combinations are ready yet. Configure an active build and an enabled download policy in the admin panel first.</p>
        ) : !overview.consentDefinitions.downloadRegistration || !overview.consentDefinitions.marketingEmail ? (
          <p>The active consent definitions are missing. Apply the latest migrations before using the public registration shell.</p>
        ) : (
          <form action={registerDownloadRequestAction} style={{ display: 'grid', gap: '1rem' }}>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Product / edition / channel</span>
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

            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Email</span>
              <input name="email" type="email" required placeholder="name@example.com" autoComplete="email" />
            </label>

            <label style={{ display: 'grid', gap: '0.5rem' }}>
              <span>
                <input name="downloadRegistrationConsent" type="checkbox" required />{' '}
                I agree to use my email address to process this product download registration request.
              </span>
              <small>
                Required. This operational registration is stored separately from the optional marketing consent.
              </small>
            </label>

            <label style={{ display: 'grid', gap: '0.5rem' }}>
              <span>
                <input name="marketingConsent" type="checkbox" />{' '}
                I agree to receive future marketing and newsletter emails from eGen Labs.
              </span>
              <small>Optional. Leaving it unchecked still allows the download registration request to be recorded.</small>
            </label>

            <button type="submit">Register download request</button>
          </form>
        )}
      </section>

      {overview.combinations.length > 0 ? (
        <section style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
          <h2>Available combinations</h2>
          <ul>
            {overview.combinations.map((combination) => (
              <li key={combination.id}>
                <strong>
                  {combination.productName} / {combination.editionName} / {combination.channelName}
                </strong>{' '}
                — {combination.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
