import Link from 'next/link';

import { getFormsAdminOverview } from '@/features/forms/forms-service';

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value);
}

export default async function AdminFormsPage() {
  const overview = await getFormsAdminOverview();
  const { admin } = overview;

  return (
    <main style={{ maxWidth: 1200, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Public forms</h1>
          <p>Review newsletter-only signups, contact requests, and enterprise-interest submissions.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/newsletter">Open newsletter form</Link>
          <Link href="/contact">Open contact form</Link>
          <Link href="/enterprise">Open enterprise form</Link>
          <Link href="/admin">Back to admin</Link>
        </div>
      </header>

      <section>
        <p>
          Signed in as <strong>{admin.email}</strong> ({admin.role})
        </p>
        <ul>
          <li>Newsletter signups: {overview.stats.newsletterCount}</li>
          <li>Active newsletter signups: {overview.stats.activeNewsletterCount}</li>
          <li>Contact inquiries: {overview.stats.contactInquiryCount}</li>
          <li>Enterprise interest submissions: {overview.stats.enterpriseInterestCount}</li>
          <li>Active marketing consent version: {overview.consentDefinitions.marketingEmail?.version ?? 'missing'}</li>
        </ul>
      </section>

      <section>
        <h2>Newsletter signups</h2>
        {overview.newsletterSubscriptions.length === 0 ? (
          <p>No newsletter signups recorded yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {overview.newsletterSubscriptions.map((subscription) => (
              <article key={subscription.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
                <h3 style={{ marginBottom: '0.25rem' }}>{subscription.lead.email}</h3>
                <p style={{ margin: 0 }}>Source: {subscription.source} · Active: {subscription.isActive ? 'yes' : 'no'}</p>
                <p style={{ margin: '0.5rem 0 0' }}>Subscribed: {formatDate(subscription.subscribedAt)}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Contact inquiries</h2>
        {overview.contactInquiries.length === 0 ? (
          <p>No contact inquiries recorded yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {overview.contactInquiries.map((inquiry) => (
              <article key={inquiry.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '0.5rem' }}>
                <header>
                  <h3 style={{ marginBottom: '0.25rem' }}>{inquiry.name}</h3>
                  <p style={{ margin: 0 }}>{inquiry.email} · {inquiry.topic} · {inquiry.status}</p>
                </header>
                <p style={{ margin: 0 }}>Company: {inquiry.company ?? '—'} · Marketing consent: {inquiry.marketingConsentGranted ? 'yes' : 'no'}</p>
                <p style={{ margin: 0 }}>Created: {formatDate(inquiry.createdAt)}</p>
                <p style={{ margin: 0 }}>{inquiry.message}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Enterprise interest</h2>
        {overview.enterpriseInterests.length === 0 ? (
          <p>No enterprise-interest submissions recorded yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {overview.enterpriseInterests.map((interest) => (
              <article key={interest.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '0.5rem' }}>
                <header>
                  <h3 style={{ marginBottom: '0.25rem' }}>{interest.company}</h3>
                  <p style={{ margin: 0 }}>{interest.name} · {interest.email} · {interest.status}</p>
                </header>
                <p style={{ margin: 0 }}>Role: {interest.role ?? '—'} · Team size: {interest.teamSize ?? '—'} · Marketing consent: {interest.marketingConsentGranted ? 'yes' : 'no'}</p>
                <p style={{ margin: 0 }}>Created: {formatDate(interest.createdAt)}</p>
                <p style={{ margin: 0 }}>{interest.message}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
