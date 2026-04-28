import Link from 'next/link';

import { upsertMarketingPdfAction } from '@/features/pdf/pdf-actions';
import { getAdminPdfOverview } from '@/features/pdf/pdf-service';

const successMessages: Record<string, string> = {
  pdf_created: 'PDF one-pager created successfully.',
  pdf_updated: 'PDF one-pager updated successfully.'
};

const errorMessages: Record<string, string> = {
  invalid_pdf_input: 'PDF form data is invalid. Review the required fields and try again.',
  pdf_product_not_found: 'Selected product was not found.',
  pdf_slug_exists: 'PDF slug already exists.'
};

type AdminPdfsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getStatusMessage(
  params: Record<string, string | string[] | undefined> | undefined,
  kind: 'success' | 'error'
) {
  const value = params?.[kind];
  const key = Array.isArray(value) ? value[0] : value;

  if (!key) {
    return null;
  }

  return kind === 'success' ? successMessages[key] ?? null : errorMessages[key] ?? null;
}

function formatBytes(value: number | null | undefined) {
  if (!value || value <= 0) {
    return 'Unknown';
  }

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(value: Date | null) {
  if (!value) {
    return 'Not published';
  }

  return new Intl.DateTimeFormat('pl-PL', { dateStyle: 'medium', timeStyle: 'short' }).format(value);
}

export default async function AdminPdfsPage({ searchParams }: AdminPdfsPageProps) {
  const [overview, resolvedSearchParams] = await Promise.all([getAdminPdfOverview(), searchParams]);
  const successMessage = getStatusMessage(resolvedSearchParams, 'success');
  const errorMessage = getStatusMessage(resolvedSearchParams, 'error');

  return (
    <main style={{ maxWidth: 960, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '2rem' }}>
      <header style={{ display: 'grid', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/admin">Back to admin</Link>
          <Link href="/products/fito-gen">Open product landing</Link>
        </div>
        <h1>PDF one-pager management</h1>
        <p>
          Configure the single PDF one-pager per product, including storage path, visibility, and whether the asset is
          publicly available or restricted to authenticated admins.
        </p>
      </header>

      {successMessage ? <p role="status" style={{ color: '#0b6b2d' }}>{successMessage}</p> : null}
      {errorMessage ? <p role="alert" style={{ color: '#8a1c1c' }}>{errorMessage}</p> : null}

      <section>
        <h2>PDF status</h2>
        <ul>
          <li>Total configured PDFs: {overview.stats.totalPdfCount}</li>
          <li>Enabled PDFs: {overview.stats.enabledPdfCount}</li>
          <li>Public PDFs: {overview.stats.publicPdfCount}</li>
          <li>Private PDFs: {overview.stats.privatePdfCount}</li>
        </ul>
      </section>

      <section style={{ display: 'grid', gap: '1rem' }}>
        <h2>Manage product PDFs</h2>
        {overview.products.map((product) => {
          const pdf = product.marketingPdf;
          const defaultSlug = `${product.slug}-one-pager`;

          return (
            <article key={product.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '1rem' }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>{product.name}</h3>
                <p style={{ margin: 0, color: '#555' }}>
                  {pdf
                    ? `Current PDF is ${pdf.isEnabled ? 'enabled' : 'disabled'} and ${pdf.visibility.toLowerCase()}.`
                    : 'No PDF one-pager is configured for this product yet.'}
                </p>
              </div>

              {pdf ? (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.95rem' }}>
                  <span>Published: {formatDate(pdf.publishedAt)}</span>
                  <span>File size: {formatBytes(pdf.fileSizeBytes)}</span>
                  <Link href={`/one-pager/${pdf.slug}`}>Open PDF page</Link>
                  <Link href={`/api/v1/pdf/download?slug=${pdf.slug}`}>Download PDF</Link>
                </div>
              ) : null}

              <form action={upsertMarketingPdfAction} style={{ display: 'grid', gap: '1rem' }}>
                <input type="hidden" name="productId" value={product.id} />
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Title</span>
                    <input type="text" name="title" defaultValue={pdf?.title ?? `${product.name} one-pager`} required />
                  </label>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Slug</span>
                    <input type="text" name="slug" defaultValue={pdf?.slug ?? defaultSlug} required />
                  </label>
                </div>

                <label style={{ display: 'grid', gap: '0.25rem' }}>
                  <span>Description</span>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={pdf?.description ?? 'Concise PDF overview for the currently supported launch product.'}
                  />
                </label>

                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Visibility</span>
                    <select name="visibility" defaultValue={pdf?.visibility ?? 'PUBLIC'}>
                      <option value="PUBLIC">Public</option>
                      <option value="PRIVATE">Private</option>
                    </select>
                  </label>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Mime type</span>
                    <input type="text" name="mimeType" defaultValue={pdf?.mimeType ?? 'application/pdf'} required />
                  </label>
                </div>

                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>File name</span>
                    <input type="text" name="fileName" defaultValue={pdf?.fileName ?? `${product.slug}-one-pager.pdf`} required />
                  </label>
                  <label style={{ display: 'grid', gap: '0.25rem' }}>
                    <span>Storage path</span>
                    <input
                      type="text"
                      name="storagePath"
                      defaultValue={pdf?.storagePath ?? `storage/media/${product.slug}-one-pager.pdf`}
                      required
                    />
                  </label>
                </div>

                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="checkbox" name="isEnabled" defaultChecked={pdf?.isEnabled ?? true} />
                  <span>Enable PDF one-pager</span>
                </label>

                <div>
                  <button type="submit">Save PDF configuration</button>
                </div>
              </form>
            </article>
          );
        })}
      </section>
    </main>
  );
}
