import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PdfVisibility } from '@prisma/client';

import { Card, PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { getPublicProductLandingOverview } from '@/features/content/content-service';

function renderPublishedAt(value: Date | null) {
  if (!value) {
    return 'W przygotowaniu';
  }

  return new Intl.DateTimeFormat('pl-PL', { dateStyle: 'medium' }).format(value);
}

type ProductLandingPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductLandingPage({ params }: ProductLandingPageProps) {
  const { slug } = await params;
  const overview = await getPublicProductLandingOverview(slug);

  if (!overview.product) {
    notFound();
  }

  const product = overview.product;
  const primaryEdition = product.editions[0];
  const publicPdf = product.marketingPdf && product.marketingPdf.isEnabled && product.marketingPdf.visibility === PdfVisibility.PUBLIC
    ? product.marketingPdf
    : null;

  return (
    <PublicShell>
      <PageContainer>
        <section className="hero">
          <div className="hero__content">
            <span className="eyebrow">Produkt w przygotowaniu</span>
            <h1>{product.name} {primaryEdition ? primaryEdition.name : ''}</h1>
            <p className="hero__lead">
              Fito Gen Essentials to desktopowa aplikacja dla polskich szkółek roślin. Produkt pozostaje offline-first,
              prosty w użyciu i przygotowany do pracy lokalnej bez stałego połączenia z internetem.
            </p>
            <div className="hero__actions">
              <Link className="button" href="/contact">Zapytaj o Fito Gen</Link>
              <Link className="button button--secondary" href="/newsletter">Zapisz się po aktualizacje</Link>
            </div>
          </div>
          <aside className="hero__panel">
            <span className="status-pill">Program zostanie dodany później</span>
            <h2>Bez przedwczesnej publikacji</h2>
            <p>
              Link do programu i finalny flow pobrania zostaną udostępnione dopiero po zakończeniu desktopowego MVP.
              Obecnie strona buduje wiarygodność marki i przygotowuje komunikację produktową.
            </p>
            <div className="metric-grid">
              <div className="metric">
                <strong>{product.builds.length}</strong>
                <span>buildów w konfiguracji</span>
              </div>
              <div className="metric">
                <strong>{product.editions.length}</strong>
                <span>aktywnych edycji</span>
              </div>
            </div>
          </aside>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Założenie produktu" title="Prosty desktop dla szkółek roślin">
            <p>
              Strona produktu jest przygotowana pod publiczną komunikację w języku polskim, ale nie wymusza jeszcze pobrania aplikacji.
            </p>
          </SectionHeader>
          <div className="card-grid">
            <Card title="Offline-first">
              <p>Dane operacyjne użytkownika pozostają lokalnie po stronie aplikacji desktopowej.</p>
            </Card>
            <Card title="Praktyczny workflow">
              <p>Produkt ma wspierać codzienną pracę szkółki bez ciężkiego wdrożenia i bez nadmiarowej złożoności.</p>
            </Card>
            <Card title="Wsparcie z platformy">
              <p>egenlabs.eu będzie publikować aktualizacje, news feed i paczki słownikowe, ale nie przejmie domenowych danych desktopu.</p>
            </Card>
          </div>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Status" title="Co jest gotowe na stronie, a co czeka na program?">
            <p>Ten podział chroni markę przed publikacją niedokończonego produktu i pozwala wystartować wizualnie szybciej.</p>
          </SectionHeader>
          <div className="card-grid card-grid--two">
            <article className="card">
              <h3>Gotowe do publicznej strony</h3>
              <ul className="feature-list">
                <li>opis marki eGen Labs,</li>
                <li>komunikacja produktowa po polsku,</li>
                <li>kontakt i newsletter,</li>
                <li>blog, FAQ i materiały informacyjne.</li>
              </ul>
            </article>
            <article className="card">
              <h3>Kolejny krok po desktop MVP</h3>
              <ul className="feature-list">
                <li>finalny link do pobrania Fito Gen,</li>
                <li>instrukcje użytkowania programu,</li>
                <li>materiały onboardingowe,</li>
                <li>pełny product launch flow.</li>
              </ul>
            </article>
          </div>
        </section>

        {publicPdf ? (
          <section className="card">
            <span className="status-pill">Materiał PDF</span>
            <h2>{publicPdf.title}</h2>
            <p>{publicPdf.description ?? 'Krótki materiał informacyjny dla produktu.'}</p>
            <Link className="text-link" href={`/one-pager/${publicPdf.slug}`}>Otwórz materiał PDF</Link>
          </section>
        ) : null}

        <section className="section">
          <SectionHeader eyebrow="Wiedza" title="Aktualności i FAQ produktu">
            <p>Te treści mogą rosnąć jeszcze przed publikacją programu.</p>
          </SectionHeader>
          <div className="card-grid card-grid--two">
            <article className="card">
              <h3>Najnowsze wpisy</h3>
              {overview.siteOverview.blogPosts.length === 0 ? (
                <p>Nie ma jeszcze opublikowanych wpisów.</p>
              ) : (
                <div className="article-card">
                  {overview.siteOverview.blogPosts.map((post) => (
                    <div key={post.id}>
                      <p className="meta-text">{renderPublishedAt(post.publishedAt)}</p>
                      <h4>{post.title}</h4>
                      <p>{post.excerpt}</p>
                      <Link className="text-link" href={`/blog/${post.slug}`}>Czytaj dalej</Link>
                    </div>
                  ))}
                </div>
              )}
            </article>
            <article className="card">
              <h3>FAQ</h3>
              {overview.siteOverview.faqEntries.length === 0 ? (
                <p>Nie ma jeszcze opublikowanych wpisów FAQ.</p>
              ) : (
                <ul className="feature-list">
                  {overview.siteOverview.faqEntries.map((entry) => (
                    <li key={entry.id}>{entry.question}</li>
                  ))}
                </ul>
              )}
              <Link className="text-link" href="/faq">Przejdź do FAQ</Link>
            </article>
          </div>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
