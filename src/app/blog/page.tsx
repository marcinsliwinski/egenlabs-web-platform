import Link from 'next/link';

import { getPublicBlogPosts } from '@/features/content/content-service';

function renderPublishedAt(value: Date | null) {
  if (!value) {
    return 'Draft';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium'
  }).format(value);
}

export default async function BlogPage() {
  const blogPosts = await getPublicBlogPosts();

  return (
    <main style={{ maxWidth: 960, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '1.5rem' }}>
      <header style={{ display: 'grid', gap: '0.75rem' }}>
        <h1>Blog</h1>
        <p>Product, quality, and domain updates from the eGen Labs launch track.</p>
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/">Home</Link>
          <Link href="/products/fito-gen">Product landing</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/download/register">Download registration</Link>
        </nav>
      </header>

      {blogPosts.length === 0 ? (
        <p>No published blog posts are available yet.</p>
      ) : (
        blogPosts.map((post) => (
          <article key={post.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '0.75rem' }}>
            <div>
              <p style={{ margin: 0, color: '#555' }}>{renderPublishedAt(post.publishedAt)}</p>
              <h2 style={{ marginBottom: '0.5rem' }}>{post.title}</h2>
              <p style={{ marginBottom: 0 }}>{post.excerpt}</p>
            </div>
            <div>
              <Link href={`/blog/${post.slug}`}>Read article</Link>
            </div>
          </article>
        ))
      )}
    </main>
  );
}
