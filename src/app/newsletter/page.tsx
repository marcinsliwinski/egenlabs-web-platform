import Link from 'next/link';

import { createNewsletterSignupAction } from '@/features/forms/forms-actions';

const successMessages: Record<string, string> = {
  newsletter_saved: 'Your newsletter signup was recorded successfully.'
};

const errorMessages: Record<string, string> = {
  invalid_newsletter_input: 'Provide a valid email address and confirm the marketing consent checkbox.',
  marketing_consent_missing: 'The current marketing consent definition is not available. Try again after admin review.'
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
    <main style={{ maxWidth: 760, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '1.5rem' }}>
      <header style={{ display: 'grid', gap: '1rem' }}>
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/">Home</Link>
          <Link href="/products/fito-gen">Fito Gen</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/enterprise">Enterprise</Link>
        </nav>
        <div>
          <h1>Newsletter signup</h1>
          <p>Subscribe to product updates, launch announcements, and future eGen Labs marketing communication without downloading the application.</p>
        </div>
      </header>

      {successKey ? <p role="status" style={{ color: '#0b6b2d' }}>{successMessages[successKey] ?? 'The newsletter signup was saved successfully.'}</p> : null}
      {errorKey ? <p role="alert" style={{ color: '#b00020' }}>{errorMessages[errorKey] ?? 'Unable to save the newsletter signup.'}</p> : null}

      <section style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
        <form action={createNewsletterSignupAction} style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span>Email</span>
            <input type="email" name="email" required maxLength={320} placeholder="name@example.com" />
          </label>

          <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <input type="checkbox" name="marketingConsent" required />
            <span>I agree to receive future marketing and newsletter email communication from eGen Labs.</span>
          </label>

          <button type="submit">Save newsletter signup</button>
        </form>
      </section>
    </main>
  );
}
