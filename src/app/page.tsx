import Link from 'next/link';

import { getPublicSiteOverview } from '@/features/content/content-service';

function renderPublishedAt(value: Date | null) {
  if (!value) {
    return 'Draft';
  }

  return new Intl.DateTimeFormat('pl-PL', { dateStyle: 'medium' }).format(value);
}

export default async function HomePage() {
  const overview = await getPublicSiteOverview();

  return (
    <main style={{ maxWidth: 1040, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '2rem' }}>
      <header style={{ display: 'grid', gap: '1rem' }}>
        <h1>eGen Labs Web Platform</h1>
        <p>
          Public site foundation, content module shell, transactional registration flow, and final delivery shell are
          now active within the accepted MVP baseline.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/products/fito-gen">Open Fito Gen landing</Link>
          <Link href="/download/register">Open download registration</Link>
          <Link href="/faq">Open FAQ</Link>
          <Link href="/blog">Open blog</Link>
        </div>
      </header>

      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <article style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
          <h2>Brand</h2>
          <p>eGen Labs is the software-focused subbrand inside the broader eGen ecosystem.</p>
        </article>
        <article style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
          <h2>Current product</h2>
          <p>Fito Gen Essentials remains the first supported launch product for the Polish market.</p>
        </article>
        <article style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
          <h2>Launch flow</h2>
          <p>Users can already register, receive transactional email issuance, and access the delivery shell.</p>
        </article>
      </section>

      <section style={{ display: 'grid', gap: '1rem' }}>
        <h2>Launch FAQ snapshot</h2>
        {overview.faqEntries.length === 0 ? (
          <p>No published FAQ entries are available yet.</p>
        ) : (
          overview.faqEntries.slice(0, 3).map((entry) => (
            <article key={entry.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
              <h3 style={{ marginTop: 0 }}>{entry.question}</h3>
              <p style={{ marginBottom: 0 }}>{entry.answer}</p>
            </article>
          ))
        )}
      </section>

      <section style={{ display: 'grid', gap: '1rem' }}>
        <h2>Latest blog articles</h2>
        {overview.blogPosts.length === 0 ? (
          <p>No published blog posts are available yet.</p>
        ) : (
          overview.blogPosts.map((post) => (
            <article key={post.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
              <p style={{ margin: 0, color: '#555' }}>{renderPublishedAt(post.publishedAt)}</p>
              <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`}>Read article</Link>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
