import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getMarketingPdfPageBySlug } from '@/features/pdf/pdf-service';

function formatDate(value: Date | null) {
  if (!value) {
    return 'Not published';
  }

  return new Intl.DateTimeFormat('pl-PL', { dateStyle: 'medium', timeStyle: 'short' }).format(value);
}

export default async function MarketingPdfPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getMarketingPdfPageBySlug(slug);

  if (!result.found || !result.pdf || !result.canAccess) {
    notFound();
  }

  const { pdf, fileExists, admin } = result;

  return (
    <main style={{ maxWidth: 840, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '2rem' }}>
      <header style={{ display: 'grid', gap: '0.75rem' }}>
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/">Home</Link>
          <Link href={`/products/${pdf.product.slug}`}>Back to product landing</Link>
        </nav>
        <div>
          <h1>{pdf.title}</h1>
          <p>
            {pdf.description ?? 'Concise product overview PDF available for the accepted MVP public site.'}
          </p>
          <p style={{ margin: 0, color: '#555' }}>
            Product: {pdf.product.name} · Visibility: {pdf.visibility} · Published: {formatDate(pdf.publishedAt)}
          </p>
          {admin && pdf.visibility === 'PRIVATE' ? (
            <p style={{ margin: 0, color: '#5f4b00' }}>Private admin preview is currently active for this PDF one-pager.</p>
          ) : null}
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href={`/api/v1/pdf/download?slug=${pdf.slug}`}>Download PDF</Link>
          {admin ? <Link href="/admin/pdfs">Open PDF admin</Link> : null}
        </div>
      </header>

      <section style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '0.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Delivery state</h2>
        <p style={{ margin: 0 }}>Configured file name: {pdf.fileName}</p>
        <p style={{ margin: 0 }}>Mime type: {pdf.mimeType}</p>
        <p style={{ margin: 0 }}>Storage path: {pdf.storagePath}</p>
        <p style={{ margin: 0, color: fileExists ? '#0b6b2d' : '#8a1c1c' }}>
          {fileExists
            ? 'The configured PDF file is available and ready for delivery.'
            : 'The configured PDF file is missing from storage. Update the storage path or add the file in storage/media.'}
        </p>
      </section>
    </main>
  );
}
