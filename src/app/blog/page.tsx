import Link from 'next/link';

import { PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { getPublicBlogPosts } from '@/features/content/content-service';

function renderPublishedAt(value: Date | null) {
  if (!value) {
    return 'Bez daty publikacji';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium'
  }).format(value);
}

export default async function BlogPage() {
  const blogPosts = await getPublicBlogPosts();

  return (
    <PublicShell>
      <PageContainer>
        <SectionHeader eyebrow="Wiedza" title="Blog eGen Labs">
          <p>
            Praktyczne materiały o produktach eGen, dokumentacji, zgodności, wdrożeniach i kierunku rozwoju narzędzi branżowych.
          </p>
        </SectionHeader>

        {blogPosts.length === 0 ? (
          <section className="card">
            <h2>Brak opublikowanych wpisów</h2>
            <p>Wpisy pojawią się po uzupełnieniu treści startowych.</p>
          </section>
        ) : (
          <section className="card-grid">
            {blogPosts.map((post) => (
              <article key={post.id} className="card article-card">
                <p className="meta-text">{renderPublishedAt(post.publishedAt)}</p>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <Link className="text-link" href={`/blog/${post.slug}`}>Czytaj artykuł</Link>
              </article>
            ))}
          </section>
        )}
      </PageContainer>
    </PublicShell>
  );
}
