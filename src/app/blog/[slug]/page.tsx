import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getPublicBlogPostBySlug } from '@/features/content/content-service';

function renderPublishedAt(value: Date | null) {
  if (!value) {
    return 'Draft';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value);
}

type BlogPostDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  const { slug } = await params;
  const post = await getPublicBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main style={{ maxWidth: 860, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '1.5rem' }}>
      <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/">Home</Link>
        <Link href="/blog">Back to blog</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/products/fito-gen">Product landing</Link>
      </nav>

      <article style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1.5rem', display: 'grid', gap: '1rem' }}>
        <header>
          <p style={{ margin: 0, color: '#555' }}>{renderPublishedAt(post.publishedAt)}</p>
          <h1 style={{ marginBottom: '0.5rem' }}>{post.title}</h1>
          <p style={{ marginBottom: 0, fontSize: '1.05rem' }}>{post.excerpt}</p>
        </header>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{post.content}</div>
      </article>
    </main>
  );
}
