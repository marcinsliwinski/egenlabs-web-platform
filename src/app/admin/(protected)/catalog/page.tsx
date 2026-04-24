import Link from 'next/link';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { activateBuildAction, createBuildAction } from '@/features/catalog/catalog-actions';
import { getCatalogOverview } from '@/features/catalog/catalog-service';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type AdminCatalogPageProps = {
  searchParams?: SearchParams;
};

const successMessages: Record<string, string> = {
  build_created: 'Build created successfully.',
  build_created_and_activated: 'Build created and activated successfully.',
  build_activated: 'Build activated successfully.',
  build_already_active: 'Selected build is already active.'
};

const errorMessages: Record<string, string> = {
  forbidden: 'Only admins can modify catalog data.',
  invalid_build_input: 'Build form data is invalid. Review the required fields and try again.',
  invalid_build_activation: 'Unable to activate the selected build.',
  product_not_found: 'Selected product does not exist or is inactive.',
  edition_not_found: 'Selected edition does not exist, is inactive, or does not belong to the selected product.',
  channel_not_found: 'Selected release channel does not exist or is inactive.',
  build_number_exists: 'Build number already exists for the selected product, edition, and channel.',
  build_not_found: 'Selected build does not exist anymore.'
};

function getSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function renderPublishedAt(value: Date | null) {
  if (!value) {
    return 'Not published';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value);
}

export default async function AdminCatalogPage({ searchParams }: AdminCatalogPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const successKey = getSearchParamValue(resolvedSearchParams?.success);
  const errorKey = getSearchParamValue(resolvedSearchParams?.error);

  const [admin, overview] = await Promise.all([requireAuthenticatedAdmin(), getCatalogOverview()]);
  const isAdmin = admin.role === 'ADMIN';

  return (
    <main style={{ maxWidth: 1100, margin: '4rem auto', padding: '0 1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Product catalog</h1>
          <p>Manage catalog metadata, builds, and active release assignments for the accepted MVP baseline.</p>
        </div>
        <Link href="/admin">Back to admin</Link>
      </header>

      <section style={{ marginTop: '1.5rem' }}>
        <p>
          Signed in as <strong>{admin.email}</strong> ({admin.role})
        </p>
        {!isAdmin ? (
          <p role="status" style={{ color: '#5f4b00' }}>
            Read-only mode: Editors can review catalog data but cannot create or activate builds.
          </p>
        ) : null}
        {successKey ? (
          <p role="status" style={{ color: '#0b6b2d' }}>
            {successMessages[successKey] ?? 'Operation completed successfully.'}
          </p>
        ) : null}
        {errorKey ? (
          <p role="alert" style={{ color: '#b00020' }}>
            {errorMessages[errorKey] ?? 'Unable to complete the requested catalog operation.'}
          </p>
        ) : null}
      </section>

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
        <h2>Create build</h2>
        {overview.products.length === 0 || overview.releaseChannels.length === 0 ? (
          <p>Run <code>npm run catalog:bootstrap</code> before creating builds.</p>
        ) : !isAdmin ? (
          <p>Catalog write actions require the ADMIN role.</p>
        ) : (
          <form action={createBuildAction} style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <label style={{ display: 'grid', gap: '0.25rem' }}>
                <span>Product</span>
                <select name="productId" required defaultValue={overview.products[0]?.id}>
                  {overview.products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.key})
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'grid', gap: '0.25rem' }}>
                <span>Edition</span>
                <select name="editionId" required defaultValue={overview.products[0]?.editions[0]?.id}>
                  {overview.products.flatMap((product) =>
                    product.editions.map((edition) => (
                      <option key={edition.id} value={edition.id}>
                        {product.name} / {edition.name} ({edition.key})
                      </option>
                    ))
                  )}
                </select>
              </label>

              <label style={{ display: 'grid', gap: '0.25rem' }}>
                <span>Release channel</span>
                <select name="channelId" required defaultValue={overview.releaseChannels[0]?.id}>
                  {overview.releaseChannels.map((channel) => (
                    <option key={channel.id} value={channel.id}>
                      {channel.name} ({channel.key})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <label style={{ display: 'grid', gap: '0.25rem' }}>
                <span>Version</span>
                <input name="version" type="text" placeholder="1.0.0" required />
              </label>

              <label style={{ display: 'grid', gap: '0.25rem' }}>
                <span>Build number</span>
                <input name="buildNumber" type="number" min="1" step="1" placeholder="1001" required />
              </label>

              <label style={{ display: 'grid', gap: '0.25rem' }}>
                <span>Minimum supported version</span>
                <input name="minSupportedVersion" type="text" placeholder="0.9.0" />
              </label>
            </div>

            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Release notes</span>
              <textarea name="notes" rows={4} placeholder="Short internal release notes or deployment notes." />
            </label>

            <fieldset style={{ border: '1px solid #ddd', borderRadius: '0.5rem', padding: '1rem' }}>
              <legend>Optional asset metadata</legend>
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <label style={{ display: 'grid', gap: '0.25rem' }}>
                  <span>File name</span>
                  <input name="fileName" type="text" placeholder="fito-gen-1.0.0.exe" />
                </label>

                <label style={{ display: 'grid', gap: '0.25rem' }}>
                  <span>Storage path</span>
                  <input name="storagePath" type="text" placeholder="storage/builds/fito-gen/1.0.0/fito-gen-1.0.0.exe" />
                </label>

                <label style={{ display: 'grid', gap: '0.25rem' }}>
                  <span>File size (bytes)</span>
                  <input name="fileSizeBytes" type="number" min="1" step="1" placeholder="104857600" />
                </label>

                <label style={{ display: 'grid', gap: '0.25rem' }}>
                  <span>SHA-256 checksum</span>
                  <input name="checksumSha256" type="text" placeholder="Optional checksum" />
                </label>

                <label style={{ display: 'grid', gap: '0.25rem' }}>
                  <span>MIME type</span>
                  <input name="mimeType" type="text" placeholder="application/octet-stream" />
                </label>
              </div>
            </fieldset>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input name="activateNow" type="checkbox" />
              <span>Activate this build immediately for the selected product / edition / channel</span>
            </label>

            <div>
              <button type="submit">Create build</button>
            </div>
          </form>
        )}
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
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Actions</th>
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
                              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>
                                {build.assets.length === 0 ? (
                                  '0'
                                ) : (
                                  <details>
                                    <summary>{build.assets.length}</summary>
                                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                                      {build.assets.map((asset) => (
                                        <li key={asset.id}>
                                          <code>{asset.fileName}</code>
                                          <br />
                                          <small>{asset.storagePath}</small>
                                        </li>
                                      ))}
                                    </ul>
                                  </details>
                                )}
                              </td>
                              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>
                                {isAdmin ? (
                                  build.isActive ? (
                                    'Current active build'
                                  ) : (
                                    <form action={activateBuildAction}>
                                      <input type="hidden" name="buildId" value={build.id} />
                                      <button type="submit">Activate</button>
                                    </form>
                                  )
                                ) : (
                                  'Read-only'
                                )}
                              </td>
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
