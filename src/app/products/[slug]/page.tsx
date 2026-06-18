import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PdfVisibility } from '@prisma/client';

import { Card, PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { getPublicProductLandingOverview } from '@/features/content/content-service';

function renderPublishedAt(value: Date | null) {
  if (!value) {
    return 'Bez daty publikacji';
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
        <section className="hero hero--compact hero--fito">
          <div className="hero__content">
            <span className="eyebrow">Fito Gen</span>
            <h1>{product.name} {primaryEdition ? primaryEdition.name : ''}</h1>
            <p className="hero__lead">
              Desktopowa aplikacja offline-first dla polskich szkółek roślin. Porządkuje pracę lokalną, upraszcza korzystanie z dokumentacji i wspiera dostęp do aktualnych informacji oraz danych referencyjnych.
            </p>
            <div className="hero__actions">
              <Link className="button" href="#mozliwosci">Poznaj możliwości</Link>
              <Link className="button button--secondary" href="/contact">Skontaktuj się</Link>
            </div>
          </div>
          <aside className="hero__panel hero__panel--fito" aria-label="Najważniejsze cechy Fito Gen Essentials">
            <span className="status-pill">Edycja Essentials</span>
            <h2>Prosta praca lokalna</h2>
            <ul className="feature-list feature-list--compact">
              <li>działanie offline-first bez obowiązkowej chmury,</li>
              <li>interfejs przygotowany dla użytkownika końcowego,</li>
              <li>aktualizacje, komunikaty i paczki referencyjne z egenlabs.eu.</li>
            </ul>
          </aside>
        </section>

        <section className="section" id="mozliwosci">
          <SectionHeader eyebrow="Możliwości" title="Codzienna praca">
            <p>Fito Gen Essentials łączy prostotę aplikacji desktopowej z kontrolowanym wsparciem aktualizacyjnym platformy eGen Labs.</p>
          </SectionHeader>
          <div className="card-grid">
            <Card title="Offline-first">
              <p>Podstawowa praca odbywa się lokalnie, bez uzależnienia codziennych procesów od stałego połączenia z internetem.</p>
            </Card>
            <Card title="Przejrzysty workflow">
              <p>Układ aplikacji jest projektowany dla praktycznej pracy szkółki, bez nadmiarowych funkcji i ciężkiego wdrożenia.</p>
            </Card>
            <Card title="Aktualne wsparcie">
              <p>egenlabs.eu dostarcza aktualizacje, wiadomości produktowe i wersjonowane paczki danych referencyjnych.</p>
            </Card>
          </div>
        </section>

        <section className="section section--soft">
          <SectionHeader eyebrow="Architektura produktu" title="Dane pozostają lokalnie">
            <p>Platforma internetowa wspiera aplikację, ale nie przejmuje operacyjnych danych szkółki ani lokalnych procesów użytkownika.</p>
          </SectionHeader>
          <div className="card-grid card-grid--two">
            <article className="card">
              <h3>Po stronie aplikacji</h3>
              <ul className="feature-list">
                <li>lokalne dane operacyjne,</li>
                <li>ustawienia i dokumentacja użytkownika,</li>
                <li>praca dostępna również bez internetu.</li>
              </ul>
            </article>
            <article className="card">
              <h3>Po stronie egenlabs.eu</h3>
              <ul className="feature-list">
                <li>informacje o aktualizacjach,</li>
                <li>news feed i komunikaty produktowe,</li>
                <li>wersjonowane paczki danych wspierających.</li>
              </ul>
            </article>
          </div>
        </section>

        {publicPdf ? (
          <section className="card card--accent fito-pdf-card">
            <span className="status-pill status-pill--light">Materiał produktowy</span>
            <h2>{publicPdf.title}</h2>
            <p>{publicPdf.description ?? 'Materiał informacyjny prezentujący założenia i zastosowanie Fito Gen Essentials.'}</p>
            <Link className="button button--light" href={`/one-pager/${publicPdf.slug}`}>Otwórz materiał</Link>
          </section>
        ) : null}

        <section className="section">
          <SectionHeader eyebrow="Wsparcie" title="Wiedza i aktualności">
            <p>Materiały publikowane przez eGen Labs pomagają poznać produkt, kolejne aktualizacje i zasady pracy.</p>
          </SectionHeader>
          <div className="card-grid card-grid--two">
            <article className="card">
              <h3>Najnowsze wpisy</h3>
              {overview.siteOverview.blogPosts.length === 0 ? (
                <p>Nie ma jeszcze opublikowanych wpisów.</p>
              ) : (
                <div className="article-card">
                  {overview.siteOverview.blogPosts.slice(0, 2).map((post) => (
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
              <h3>Najczęstsze pytania</h3>
              {overview.siteOverview.faqEntries.length === 0 ? (
                <p>Nie ma jeszcze opublikowanych wpisów FAQ.</p>
              ) : (
                <ul className="feature-list">
                  {overview.siteOverview.faqEntries.slice(0, 4).map((entry) => (
                    <li key={entry.id}>{entry.question}</li>
                  ))}
                </ul>
              )}
              <Link className="text-link" href="/faq">Przejdź do FAQ</Link>
            </article>
          </div>
        </section>

        <section className="cta-panel">
          <div>
            <span className="eyebrow eyebrow--light">Kontakt</span>
            <h2>Porozmawiajmy o Fito Gen</h2>
            <p>Napisz w sprawie zastosowania produktu, dokumentacji lub współpracy.</p>
          </div>
          <Link className="button button--light" href="/contact">Skontaktuj się</Link>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
