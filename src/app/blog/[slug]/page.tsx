import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageContainer, PublicShell } from '@/components/public-site';
import { getPublicBlogPostBySlug } from '@/features/content/content-service';

function renderPublishedAt(value: Date | null) {
  if (!value) {
    return 'W przygotowaniu';
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
    <PublicShell>
      <PageContainer>
        <article className="card article-card">
          <Link className="text-link" href="/blog">← Wróć do bloga</Link>
          <header>
            <p className="meta-text">{renderPublishedAt(post.publishedAt)}</p>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
          </header>
          <div className="prose">{post.content}</div>
        </article>
      </PageContainer>
    </PublicShell>
  );
}
