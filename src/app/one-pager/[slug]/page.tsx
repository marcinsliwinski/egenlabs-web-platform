import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { getMarketingPdfPageBySlug } from '@/features/pdf/pdf-service';

function formatDate(value: Date | null) {
  if (!value) {
    return 'Nieopublikowany';
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
    <PublicShell>
      <PageContainer>
        <SectionHeader eyebrow="Materiał PDF" title={pdf.title}>
          <p>{pdf.description ?? 'Krótki materiał informacyjny dostępny w ramach publicznej strony eGen Labs.'}</p>
          <p className="meta-text">
            Produkt: {pdf.product.name} · Widoczność: {pdf.visibility} · Publikacja: {formatDate(pdf.publishedAt)}
          </p>
          {admin && pdf.visibility === 'PRIVATE' ? (
            <p className="alert alert--success">Aktywny jest prywatny podgląd administracyjny tego materiału PDF.</p>
          ) : null}
        </SectionHeader>

        <section className="card">
          <h2>Status materiału</h2>
          <ul className="feature-list">
            <li>Nazwa pliku: {pdf.fileName}</li>
            <li>Typ pliku: {pdf.mimeType}</li>
            <li>{fileExists ? 'Plik jest dostępny do pobrania.' : 'Plik nie został znaleziony w storage.'}</li>
          </ul>
          <div className="cta-row">
            {fileExists ? <Link className="button" href={`/api/v1/pdf/download?slug=${pdf.slug}`}>Pobierz PDF</Link> : null}
            <Link className="button button--secondary" href={`/products/${pdf.product.slug}`}>Wróć do produktu</Link>
            {admin ? <Link className="button button--secondary" href="/admin/pdfs">Panel PDF</Link> : null}
          </div>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
