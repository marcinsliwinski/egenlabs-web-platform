import Link from 'next/link';

import { createEnterpriseInterestAction } from '@/features/forms/forms-actions';

const successMessages: Record<string, string> = {
  enterprise_saved: 'Your enterprise interest request was recorded successfully.'
};

const errorMessages: Record<string, string> = {
  invalid_enterprise_input: 'Complete all required enterprise fields before submitting the form.',
  marketing_consent_missing: 'The current marketing consent definition is not available. Try again after admin review.'
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
    <main style={{ maxWidth: 760, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '1.5rem' }}>
      <header style={{ display: 'grid', gap: '1rem' }}>
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/">Home</Link>
          <Link href="/products/fito-gen">Fito Gen</Link>
          <Link href="/newsletter">Newsletter</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div>
          <h1>Enterprise and Pro interest</h1>
          <p>Use this form to describe company-scale needs, team requirements, or interest in a higher commercial edition of the product.</p>
        </div>
      </header>

      {successKey ? <p role="status" style={{ color: '#0b6b2d' }}>{successMessages[successKey] ?? 'The enterprise request was saved successfully.'}</p> : null}
      {errorKey ? <p role="alert" style={{ color: '#b00020' }}>{errorMessages[errorKey] ?? 'Unable to save the enterprise request.'}</p> : null}

      <section style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
        <form action={createEnterpriseInterestAction} style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span>Name</span>
            <input type="text" name="name" required maxLength={120} />
          </label>

          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span>Email</span>
            <input type="email" name="email" required maxLength={320} />
          </label>

          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span>Company</span>
            <input type="text" name="company" required maxLength={160} />
          </label>

          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span>Role (optional)</span>
            <input type="text" name="role" maxLength={120} />
          </label>

          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span>Team size (optional)</span>
            <input type="text" name="teamSize" maxLength={120} placeholder="e.g. 10 users" />
          </label>

          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span>Needs summary</span>
            <textarea name="message" required minLength={20} maxLength={4000} rows={8} />
          </label>

          <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <input type="checkbox" name="marketingConsent" />
            <span>I also agree to receive future marketing and newsletter email communication from eGen Labs.</span>
          </label>

          <button type="submit">Send enterprise interest</button>
        </form>
      </section>
    </main>
  );
}
