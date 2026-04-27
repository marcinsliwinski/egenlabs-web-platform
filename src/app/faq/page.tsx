import Link from 'next/link';

import { getPublicFaqEntries } from '@/features/content/content-service';

export default async function FaqPage() {
  const faqEntries = await getPublicFaqEntries();

  return (
    <main style={{ maxWidth: 960, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '1.5rem' }}>
      <header style={{ display: 'grid', gap: '0.75rem' }}>
        <h1>FAQ</h1>
        <p>Answers to the most important questions about eGen Labs and Fito Gen Essentials.</p>
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/">Home</Link>
          <Link href="/products/fito-gen">Product landing</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/download/register">Download registration</Link>
        </nav>
      </header>

      {faqEntries.length === 0 ? (
        <p>No published FAQ entries are available yet.</p>
      ) : (
        faqEntries.map((entry) => (
          <article key={entry.id} id={entry.slug} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
            <h2 style={{ marginTop: 0 }}>{entry.question}</h2>
            <p style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>{entry.answer}</p>
          </article>
        ))
      )}
    </main>
  );
}
