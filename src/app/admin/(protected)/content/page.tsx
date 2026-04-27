import Link from 'next/link';

import {
  createBlogPostAction,
  createFaqEntryAction,
  updateBlogPostAction,
  updateFaqEntryAction
} from '@/features/content/content-actions';
import { getAdminContentOverview } from '@/features/content/content-service';

const successMessages: Record<string, string> = {
  faq_created: 'FAQ entry created successfully.',
  faq_updated: 'FAQ entry updated successfully.',
  blog_created: 'Blog post created successfully.',
  blog_updated: 'Blog post updated successfully.'
};

const errorMessages: Record<string, string> = {
  invalid_faq_input: 'FAQ form data is invalid. Review the required fields and try again.',
  faq_slug_exists: 'FAQ slug already exists.',
  faq_not_found: 'FAQ entry was not found.',
  invalid_blog_input: 'Blog post form data is invalid. Review the required fields and try again.',
  blog_slug_exists: 'Blog post slug already exists.',
  blog_not_found: 'Blog post was not found.'
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type AdminContentPageProps = {
  searchParams?: SearchParams;
};

function getSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function renderDate(value: Date | null) {
  if (!value) {
    return 'Not published';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value);
}

export default async function AdminContentPage({ searchParams }: AdminContentPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const successKey = getSearchParamValue(resolvedSearchParams?.success);
  const errorKey = getSearchParamValue(resolvedSearchParams?.error);
  const overview = await getAdminContentOverview();

  return (
    <main style={{ maxWidth: 1200, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Content management</h1>
          <p>Manage FAQ and blog content for the accepted public-site MVP baseline.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/">Open public home</Link>
          <Link href="/faq">Open public FAQ</Link>
          <Link href="/blog">Open public blog</Link>
          <Link href="/products/fito-gen">Open product landing</Link>
          <Link href="/admin">Back to admin</Link>
        </div>
      </header>

      <section>
        <p>
          Signed in as <strong>{overview.admin.email}</strong> ({overview.admin.role})
        </p>
        <p>
          Editors and admins can manage FAQ and blog content. This step intentionally avoids preview workflows,
          rich CMS features, and asset-library complexity.
        </p>
        {successKey ? (
          <p role="status" style={{ color: '#0b6b2d' }}>
            {successMessages[successKey] ?? 'Operation completed successfully.'}
          </p>
        ) : null}
        {errorKey ? (
          <p role="alert" style={{ color: '#b00020' }}>
            {errorMessages[errorKey] ?? 'Unable to complete the requested content operation.'}
          </p>
        ) : null}
      </section>

      <section>
        <h2>Content status</h2>
        <ul>
          <li>FAQ entries: {overview.stats.faqCount}</li>
          <li>Published FAQ entries: {overview.stats.publishedFaqCount}</li>
          <li>Blog posts: {overview.stats.blogPostCount}</li>
          <li>Published blog posts: {overview.stats.publishedBlogPostCount}</li>
        </ul>
      </section>

      <section style={{ display: 'grid', gap: '1rem' }}>
        <h2>Create FAQ entry</h2>
        <form action={createFaqEntryAction} style={{ display: 'grid', gap: '1rem', border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Slug</span>
              <input type="text" name="slug" placeholder="faq-entry-slug" required />
            </label>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Sort order</span>
              <input type="number" name="sortOrder" min="0" defaultValue="100" required />
            </label>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Status</span>
              <select name="status" defaultValue="DRAFT">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </label>
          </div>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span>Question</span>
            <input type="text" name="question" required />
          </label>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span>Answer</span>
            <textarea name="answer" rows={5} required />
          </label>
          <div>
            <button type="submit">Create FAQ entry</button>
          </div>
        </form>
      </section>

      <section style={{ display: 'grid', gap: '1rem' }}>
        <h2>Create blog post</h2>
        <form action={createBlogPostAction} style={{ display: 'grid', gap: '1rem', border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Slug</span>
              <input type="text" name="slug" placeholder="your-blog-post-slug" required />
            </label>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Status</span>
              <select name="status" defaultValue="DRAFT">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </label>
          </div>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span>Title</span>
            <input type="text" name="title" required />
          </label>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span>Excerpt</span>
            <textarea name="excerpt" rows={3} required />
          </label>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span>Content</span>
            <textarea name="content" rows={10} required />
          </label>
          <div>
            <button type="submit">Create blog post</button>
          </div>
        </form>
      </section>

      <section style={{ display: 'grid', gap: '1rem' }}>
        <h2>Existing FAQ entries</h2>
        {overview.faqEntries.length === 0 ? (
          <p>No FAQ entries yet.</p>
        ) : (
          overview.faqEntries.map((entry) => (
            <article key={entry.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
              <form action={updateFaqEntryAction} style={{ display: 'grid', gap: '1rem' }}>
                <input type="hidden" name="id" value={entry.id} />
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Slug</span>
                    <input type="text" name="slug" defaultValue={entry.slug} required />
                  </label>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Sort order</span>
                    <input type="number" name="sortOrder" min="0" defaultValue={entry.sortOrder} required />
                  </label>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Status</span>
                    <select name="status" defaultValue={entry.status}>
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                    </select>
                  </label>
                </div>
                <label style={{ display: 'grid', gap: '0.25rem' }}>
                  <span>Question</span>
                  <input type="text" name="question" defaultValue={entry.question} required />
                </label>
                <label style={{ display: 'grid', gap: '0.25rem' }}>
                  <span>Answer</span>
                  <textarea name="answer" rows={5} defaultValue={entry.answer} required />
                </label>
                <p style={{ margin: 0, color: '#555' }}>Published at: {renderDate(entry.publishedAt)}</p>
                <div>
                  <button type="submit">Save FAQ entry</button>
                </div>
              </form>
            </article>
          ))
        )}
      </section>

      <section style={{ display: 'grid', gap: '1rem' }}>
        <h2>Existing blog posts</h2>
        {overview.blogPosts.length === 0 ? (
          <p>No blog posts yet.</p>
        ) : (
          overview.blogPosts.map((post) => (
            <article key={post.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
              <form action={updateBlogPostAction} style={{ display: 'grid', gap: '1rem' }}>
                <input type="hidden" name="id" value={post.id} />
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Slug</span>
                    <input type="text" name="slug" defaultValue={post.slug} required />
                  </label>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Status</span>
                    <select name="status" defaultValue={post.status}>
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                    </select>
                  </label>
                </div>
                <label style={{ display: 'grid', gap: '0.25rem' }}>
                  <span>Title</span>
                  <input type="text" name="title" defaultValue={post.title} required />
                </label>
                <label style={{ display: 'grid', gap: '0.25rem' }}>
                  <span>Excerpt</span>
                  <textarea name="excerpt" rows={3} defaultValue={post.excerpt} required />
                </label>
                <label style={{ display: 'grid', gap: '0.25rem' }}>
                  <span>Content</span>
                  <textarea name="content" rows={10} defaultValue={post.content} required />
                </label>
                <p style={{ margin: 0, color: '#555' }}>Published at: {renderDate(post.publishedAt)}</p>
                <div>
                  <button type="submit">Save blog post</button>
                </div>
              </form>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
