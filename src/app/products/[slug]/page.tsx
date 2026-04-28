import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PdfVisibility } from '@prisma/client';

import { getPublicProductLandingOverview } from '@/features/content/content-service';

function renderPublishedAt(value: Date | null) {
  if (!value) {
    return 'Draft';
  }

  return new Intl.DateTimeFormat('pl-PL', { dateStyle: 'medium' }).format(value);
}

type ProductLandingPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductLandingPage({ params }: ProductLandingPageProps) {
  const { slug } = await params;
  const overview = await getPublicProductLandingOverview(slug);

  if (!overview.product) {
    notFound();
  }

  const product = overview.product;
  const primaryEdition = product.editions[0];
  const publicPdf = product.marketingPdf && product.marketingPdf.isEnabled && product.marketingPdf.visibility === PdfVisibility.PUBLIC
    ? product.marketingPdf
    : null;

  return (
    <main style={{ maxWidth: 1040, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '2rem' }}>
      <header style={{ display: 'grid', gap: '1rem' }}>
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/">Home</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/download/register">Download registration</Link>
          <Link href="/newsletter">Newsletter</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/enterprise">Enterprise</Link>
          {publicPdf ? <Link href={`/one-pager/${publicPdf.slug}`}>Product PDF</Link> : null}
        </nav>
        <div>
          <h1>{product.name} {primaryEdition ? primaryEdition.name : ''}</h1>
          <p>
            Product landing foundation for the accepted MVP baseline. The first supported product stays focused on Polish
            nursery businesses that need a lightweight desktop-first workflow and a simple download path.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/download/register">Register and download</Link>
          <Link href="/faq">Read FAQ</Link>
          <Link href="/blog">Read launch articles</Link>
          <Link href="/enterprise">Discuss enterprise needs</Link>
          {publicPdf ? <Link href={`/one-pager/${publicPdf.slug}`}>Open one-pager PDF</Link> : null}
        </div>
      </header>

      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <article style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
          <h2>Current focus</h2>
          <p>Fito Gen Essentials supports the accepted MVP launch with manual content management, controlled download delivery, public forms, and a configurable PDF one-pager.</p>
        </article>
        <article style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
          <h2>Release readiness</h2>
          <p>Active builds currently configured: {product.builds.length}</p>
          <p>Active editions: {product.editions.length}</p>
        </article>
        <article style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
          <h2>Next user action</h2>
          <p>The public MVP path now includes download registration, newsletter-only signup, direct contact, enterprise-interest capture, and product PDF delivery.</p>
        </article>
      </section>

      {publicPdf ? (
        <section style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '0.5rem' }}>
          <h2 style={{ marginTop: 0 }}>Product PDF one-pager</h2>
          <p style={{ margin: 0 }}>{publicPdf.title}</p>
          <p style={{ margin: 0 }}>{publicPdf.description ?? 'A concise downloadable PDF overview for the currently supported product.'}</p>
          <div>
            <Link href={`/one-pager/${publicPdf.slug}`}>Open PDF one-pager</Link>
          </div>
        </section>
      ) : null}

      <section style={{ display: 'grid', gap: '1rem' }}>
        <h2>Latest launch articles</h2>
        {overview.siteOverview.blogPosts.length === 0 ? (
          <p>No published articles yet.</p>
        ) : (
          overview.siteOverview.blogPosts.map((post) => (
            <article key={post.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
              <p style={{ margin: 0, color: '#555' }}>{renderPublishedAt(post.publishedAt)}</p>
              <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`}>Read article</Link>
            </article>
          ))
        )}
      </section>

      <section style={{ display: 'grid', gap: '1rem' }}>
        <h2>FAQ snapshot</h2>
        {overview.siteOverview.faqEntries.length === 0 ? (
          <p>No FAQ entries yet.</p>
        ) : (
          overview.siteOverview.faqEntries.map((entry) => (
            <article key={entry.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
              <h3 style={{ marginTop: 0 }}>{entry.question}</h3>
              <p style={{ marginBottom: 0 }}>{entry.answer}</p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
