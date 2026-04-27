import Link from 'next/link';

import {
  createDesktopNewsItemAction,
  updateDesktopNewsItemAction
} from '@/features/desktop/desktop-actions';
import { getAdminDesktopOverview } from '@/features/desktop/desktop-service';

const successMessages: Record<string, string> = {
  news_created: 'Desktop news item created successfully.',
  news_updated: 'Desktop news item updated successfully.'
};

const errorMessages: Record<string, string> = {
  invalid_news_input: 'Desktop news form data is invalid. Review the required fields and try again.',
  news_slug_exists: 'Desktop news slug already exists.',
  news_not_found: 'Desktop news item was not found.',
  desktop_combination_invalid: 'Selected product / edition / channel combination is invalid.'
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type AdminDesktopPageProps = {
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

function buildCombinationLabel(productName: string, editionName: string, channelName: string) {
  return `${productName} / ${editionName} / ${channelName}`;
}

export default async function AdminDesktopPage({ searchParams }: AdminDesktopPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const successKey = getSearchParamValue(resolvedSearchParams?.success);
  const errorKey = getSearchParamValue(resolvedSearchParams?.error);
  const overview = await getAdminDesktopOverview();
  const defaultProduct = overview.products[0] ?? null;
  const defaultEdition = defaultProduct?.editions[0] ?? null;
  const defaultChannel = overview.releaseChannels[0] ?? null;

  return (
    <main style={{ maxWidth: 1200, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Desktop API management</h1>
          <p>Manage desktop news feed items and review the accepted MVP desktop API foundation for updates, news, telemetry, and feedback intake.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/admin">Back to admin</Link>
          <Link href="/api/v1/desktop/update?product=fito-gen&edition=essentials&channel=stable&currentVersion=0.0.0">
            Open update endpoint sample
          </Link>
          <Link href="/api/v1/desktop/news?product=fito-gen&edition=essentials&channel=stable&currentVersion=0.0.0">
            Open news endpoint sample
          </Link>
          <Link href="/admin/desktop/intake">Open telemetry and feedback intake</Link>
        </div>
      </header>

      <section>
        <p>
          Signed in as <strong>{overview.admin.email}</strong> ({overview.admin.role})
        </p>
        {successKey ? (
          <p role="status" style={{ color: '#0b6b2d' }}>
            {successMessages[successKey] ?? 'Operation completed successfully.'}
          </p>
        ) : null}
        {errorKey ? (
          <p role="alert" style={{ color: '#b00020' }}>
            {errorMessages[errorKey] ?? 'Unable to complete the requested desktop operation.'}
          </p>
        ) : null}
      </section>

      <section>
        <h2>Desktop API status</h2>
        <ul>
          <li>News feed items: {overview.stats.newsItemCount}</li>
          <li>Published news items: {overview.stats.publishedNewsItemCount}</li>
          <li>Pinned news items: {overview.stats.pinnedNewsItemCount}</li>
          <li><Link href="/admin/desktop/intake">Open telemetry and feedback intake review</Link></li>
          <li>Desktop update endpoint: <code>GET /api/v1/desktop/update</code></li>
          <li>Desktop news endpoint: <code>GET /api/v1/desktop/news</code></li>
        </ul>
      </section>

      <section style={{ display: 'grid', gap: '1rem' }}>
        <h2>Create desktop news item</h2>
        <form action={createDesktopNewsItemAction} style={{ display: 'grid', gap: '1rem', border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Product</span>
              <select name="productId" defaultValue={defaultProduct?.id} required>
                {overview.products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Edition</span>
              <select name="editionId" defaultValue={defaultEdition?.id} required>
                {overview.products.flatMap((product) => product.editions).map((edition) => (
                  <option key={edition.id} value={edition.id}>{edition.name}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Channel</span>
              <select name="channelId" defaultValue={defaultChannel?.id} required>
                {overview.releaseChannels.map((channel) => (
                  <option key={channel.id} value={channel.id}>{channel.name}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Category</span>
              <select name="category" defaultValue="GENERAL">
                <option value="GENERAL">General</option>
                <option value="RELEASE">Release</option>
                <option value="UPDATE">Update</option>
                <option value="ALERT">Alert</option>
              </select>
            </label>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Status</span>
              <select name="status" defaultValue="DRAFT">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Slug</span>
              <input type="text" name="slug" placeholder="desktop-news-slug" required />
            </label>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Min version</span>
              <input type="text" name="minVersion" placeholder="0.0.0" />
            </label>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Max version</span>
              <input type="text" name="maxVersion" placeholder="2.0.0" />
            </label>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>CTA label</span>
              <input type="text" name="ctaLabel" placeholder="Open FAQ" />
            </label>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>CTA URL</span>
              <input type="text" name="ctaUrl" placeholder="/faq" />
            </label>
          </div>

          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span>Title</span>
            <input type="text" name="title" required />
          </label>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span>Summary</span>
            <textarea name="summary" rows={3} required />
          </label>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span>Content</span>
            <textarea name="content" rows={8} required />
          </label>
          <label style={{ display: 'grid', gap: '0.5rem' }}>
            <span><input type="checkbox" name="isPinned" /> Pin this item to the top of the desktop news feed.</span>
          </label>
          <div>
            <button type="submit">Create desktop news item</button>
          </div>
        </form>
      </section>

      <section style={{ display: 'grid', gap: '1rem' }}>
        <h2>Existing desktop news items</h2>
        {overview.newsItems.length === 0 ? (
          <p>No desktop news items yet.</p>
        ) : (
          overview.newsItems.map((item) => (
            <article key={item.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem' }}>
              <form action={updateDesktopNewsItemAction} style={{ display: 'grid', gap: '1rem' }}>
                <input type="hidden" name="id" value={item.id} />
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Product</span>
                    <select name="productId" defaultValue={item.productId} required>
                      {overview.products.map((product) => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                      ))}
                    </select>
                  </label>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Edition</span>
                    <select name="editionId" defaultValue={item.editionId} required>
                      {overview.products.flatMap((product) => product.editions).map((edition) => (
                        <option key={edition.id} value={edition.id}>{edition.name}</option>
                      ))}
                    </select>
                  </label>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Channel</span>
                    <select name="channelId" defaultValue={item.channelId} required>
                      {overview.releaseChannels.map((channel) => (
                        <option key={channel.id} value={channel.id}>{channel.name}</option>
                      ))}
                    </select>
                  </label>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Category</span>
                    <select name="category" defaultValue={item.category}>
                      <option value="GENERAL">General</option>
                      <option value="RELEASE">Release</option>
                      <option value="UPDATE">Update</option>
                      <option value="ALERT">Alert</option>
                    </select>
                  </label>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Status</span>
                    <select name="status" defaultValue={item.status}>
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                    </select>
                  </label>
                </div>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Slug</span>
                    <input type="text" name="slug" defaultValue={item.slug} required />
                  </label>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Min version</span>
                    <input type="text" name="minVersion" defaultValue={item.minVersion ?? ''} />
                  </label>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Max version</span>
                    <input type="text" name="maxVersion" defaultValue={item.maxVersion ?? ''} />
                  </label>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>CTA label</span>
                    <input type="text" name="ctaLabel" defaultValue={item.ctaLabel ?? ''} />
                  </label>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>CTA URL</span>
                    <input type="text" name="ctaUrl" defaultValue={item.ctaUrl ?? ''} />
                  </label>
                </div>
                <label style={{ display: 'grid', gap: '0.25rem' }}>
                  <span>Title</span>
                  <input type="text" name="title" defaultValue={item.title} required />
                </label>
                <label style={{ display: 'grid', gap: '0.25rem' }}>
                  <span>Summary</span>
                  <textarea name="summary" rows={3} defaultValue={item.summary} required />
                </label>
                <label style={{ display: 'grid', gap: '0.25rem' }}>
                  <span>Content</span>
                  <textarea name="content" rows={8} defaultValue={item.content} required />
                </label>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  <span><input type="checkbox" name="isPinned" defaultChecked={item.isPinned} /> Pin this item to the top of the desktop news feed.</span>
                </label>
                <p style={{ margin: 0, color: '#555' }}>
                  Combination: {buildCombinationLabel(item.product.name, item.edition.name, item.channel.name)} · Published at: {renderDate(item.publishedAt)}
                </p>
                <div>
                  <button type="submit">Save desktop news item</button>
                </div>
              </form>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
