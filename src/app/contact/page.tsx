import Link from 'next/link';

import { createContactInquiryAction } from '@/features/forms/forms-actions';

const successMessages: Record<string, string> = {
  contact_saved: 'Your contact request was recorded successfully.'
};

const errorMessages: Record<string, string> = {
  invalid_contact_input: 'Complete all required contact fields before submitting the form.',
  marketing_consent_missing: 'The current marketing consent definition is not available. Try again after admin review.'
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
    <main style={{ maxWidth: 760, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '1.5rem' }}>
      <header style={{ display: 'grid', gap: '1rem' }}>
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/">Home</Link>
          <Link href="/products/fito-gen">Fito Gen</Link>
          <Link href="/newsletter">Newsletter</Link>
          <Link href="/enterprise">Enterprise</Link>
        </nav>
        <div>
          <h1>Contact eGen Labs</h1>
          <p>Use this form for general product questions, support requests, or partnership conversations.</p>
        </div>
      </header>

      {successKey ? <p role="status" style={{ color: '#0b6b2d' }}>{successMessages[successKey] ?? 'The contact request was saved successfully.'}</p> : null}
      {errorKey ? <p role="alert" style={{ color: '#b00020' }}>{errorMessages[errorKey] ?? 'Unable to save the contact request.'}</p> : null}

      <section style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
        <form action={createContactInquiryAction} style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span>Name</span>
            <input type="text" name="name" required maxLength={120} />
          </label>

          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span>Email</span>
            <input type="email" name="email" required maxLength={320} />
          </label>

          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span>Company (optional)</span>
            <input type="text" name="company" maxLength={160} />
          </label>

          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span>Topic</span>
            <select name="topic" defaultValue="GENERAL">
              <option value="GENERAL">General</option>
              <option value="PRODUCT">Product</option>
              <option value="SUPPORT">Support</option>
              <option value="PARTNERSHIP">Partnership</option>
            </select>
          </label>

          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span>Message</span>
            <textarea name="message" required minLength={10} maxLength={4000} rows={8} />
          </label>

          <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <input type="checkbox" name="marketingConsent" />
            <span>I also agree to receive future marketing and newsletter email communication from eGen Labs.</span>
          </label>

          <button type="submit">Send contact request</button>
        </form>
      </section>
    </main>
  );
}
