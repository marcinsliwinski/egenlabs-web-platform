import Link from 'next/link';

import { getCatalogOverview } from '@/features/catalog/catalog-service';

function renderPublishedAt(value: Date | null) {
  if (!value) {
    return 'Not published';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value);
}

export default async function AdminCatalogPage() {
  const overview = await getCatalogOverview();

  return (
    <main style={{ maxWidth: 960, margin: '4rem auto', padding: '0 1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Product catalog foundation</h1>
          <p>Catalog data model is ready for products, editions, release channels, builds, and build assets.</p>
        </div>
        <Link href="/admin">Back to admin</Link>
      </header>

      <section style={{ marginTop: '2rem' }}>
        <h2>Overview</h2>
        <ul>
          <li>Products: {overview.stats.productCount}</li>
          <li>Release channels: {overview.stats.releaseChannelCount}</li>
          <li>Builds: {overview.stats.buildCount}</li>
          <li>Active builds: {overview.stats.activeBuildCount}</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Release channels</h2>
        {overview.releaseChannels.length === 0 ? (
          <p>No release channels configured yet. Run <code>npm run catalog:bootstrap</code>.</p>
        ) : (
          <ul>
            {overview.releaseChannels.map((channel) => (
              <li key={channel.id}>
                <strong>{channel.name}</strong> ({channel.key}) — {channel.isActive ? 'active' : 'inactive'}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Products and editions</h2>
        {overview.products.length === 0 ? (
          <p>No products configured yet. Run <code>npm run catalog:bootstrap</code> to add the baseline catalog.</p>
        ) : (
          overview.products.map((product) => (
            <article key={product.id} style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}>
              <h3>{product.name}</h3>
              <p>Key: <code>{product.key}</code></p>
              <p>Slug: <code>{product.slug}</code></p>
              <p>Status: {product.isActive ? 'active' : 'inactive'}</p>

              {product.editions.length === 0 ? (
                <p>No editions configured.</p>
              ) : (
                product.editions.map((edition) => (
                  <section key={edition.id} style={{ marginTop: '1rem' }}>
                    <h4>{edition.name}</h4>
                    <p>Edition key: <code>{edition.key}</code></p>
                    <p>Status: {edition.isActive ? 'active' : 'inactive'}</p>

                    {edition.builds.length === 0 ? (
                      <p>No builds configured for this edition yet.</p>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.75rem' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Channel</th>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Version</th>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Build</th>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Status</th>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Published</th>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Assets</th>
                          </tr>
                        </thead>
                        <tbody>
                          {edition.builds.map((build) => (
                            <tr key={build.id}>
                              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>{build.channel.name}</td>
                              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>{build.version}</td>
                              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>{build.buildNumber}</td>
                              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>{build.isActive ? 'active' : 'draft'}</td>
                              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>{renderPublishedAt(build.publishedAt)}</td>
                              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>{build.assets.length}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </section>
                ))
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
