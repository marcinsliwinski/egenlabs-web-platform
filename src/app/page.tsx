import Link from 'next/link';

import { NewsletterSignupForm } from '@/components/newsletter-signup-form';
import { Card, PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { getPublicSiteOverview } from '@/features/content/content-service';
import { getPublicEnabledMarketingPdfs } from '@/features/pdf/pdf-service';

function renderPublishedAt(value: Date | null) {
  if (!value) {
    return 'Bez daty publikacji';
  }

  return new Intl.DateTimeFormat('pl-PL', { dateStyle: 'medium' }).format(value);
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function HomePage({ searchParams }: { searchParams?: SearchParams }) {
  const [overview, publicPdfs, resolvedSearchParams] = await Promise.all([
    getPublicSiteOverview(),
    getPublicEnabledMarketingPdfs(),
    searchParams ? searchParams : Promise.resolve(undefined)
  ]);
  const featuredPdf = publicPdfs[0] ?? null;
  const newsletterSuccess = getSearchParamValue(resolvedSearchParams?.newsletterSuccess);
  const newsletterError = getSearchParamValue(resolvedSearchParams?.newsletterError);

  return (
    <PublicShell>
      <PageContainer>
        <section className="hero hero--home">
          <div className="hero__content">
            <span className="eyebrow">eGen Labs</span>
            <h1>Praktyczna inżynieria</h1>
            <p className="hero__lead">
              Tworzymy skalowalne aplikacje i specjalistyczne rozwiązania krótkofalarskie. Łączymy funkcjonalność, rzetelną dokumentację i przemyślaną konstrukcję.
            </p>
            <div className="hero__actions">
              <Link className="button" href="/products">Poznaj rozwiązania</Link>
              <Link className="button button--secondary" href="/contact">Skontaktuj się</Link>
            </div>
          </div>
          <aside className="hero__panel hero__panel--catalog" aria-label="Główne linie rozwiązań">
            <span className="status-pill">eGen Labs</span>
            <h2>Trzy wyspecjalizowane linie</h2>
            <div className="hero-product-list">
              <Link href="/products/fito-gen">
                <strong>Fito Gen</strong>
                <span>Aplikacja desktopowa dla szkółek roślin</span>
              </Link>
              <Link href="/products/gen-fed">
                <strong>GEN-FED</strong>
                <span>Kompletne systemy antenowe i transformatory 1:49</span>
              </Link>
              <Link href="/products/cmc-gen">
                <strong>CMC-GEN</strong>
                <span>Dławiki prądów wspólnych dla instalacji HF</span>
              </Link>
            </div>
          </aside>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Rozwiązania" title="Rozwiązania eGen Labs">
            <p>Rozwijamy własne linie przeznaczone do konkretnych zastosowań. Każda z nich łączy praktyczną funkcję, uporządkowaną dokumentację i możliwość dalszego rozwoju.</p>
          </SectionHeader>
          <div className="product-showcase-grid">
            <article className="product-showcase product-showcase--fito">
              <div>
                <span className="status-pill">Aplikacja desktopowa</span>
                <h3>Fito Gen Essentials</h3>
                <p>Desktopowa aplikacja offline-first dla polskich szkółek roślin, wspierająca lokalną pracę i dostęp do aktualnych danych referencyjnych.</p>
              </div>
              <ul className="feature-list feature-list--compact">
                <li>praca lokalna bez obowiązkowej chmury,</li>
                <li>prosty interfejs dla użytkownika końcowego,</li>
                <li>aktualizacje i dane referencyjne z egenlabs.eu.</li>
              </ul>
              <Link className="text-link text-link--arrow" href="/products/fito-gen">Poznaj Fito Gen <span aria-hidden="true">→</span></Link>
            </article>
            <article className="product-showcase product-showcase--technical">
              <div>
                <span className="status-pill status-pill--neutral">23 modele</span>
                <h3>GEN-FED / CMC-GEN 261</h3>
                <p>Kompletne systemy antenowe 40–10 i 80–10, samodzielne Un-Uny oraz dławiki CMC-GEN.</p>
              </div>
              <ul className="feature-list feature-list--compact">
                <li>linie µQRP, QRP, STD i HD,</li>
                <li>warianty promienników S i M,</li>
                <li>parametry określone dla DIGI, CW i SSB.</li>
              </ul>
              <Link className="text-link text-link--arrow" href="/products/gen-fed">Poznaj GEN-FED <span aria-hidden="true">→</span></Link>
            </article>
          </div>
        </section>

        <section className="section section--soft">
          <SectionHeader eyebrow="Standard" title="Dokumentacja jest częścią rozwiązania">
            <p>Parametry, zasady montażu i informacje użytkowe są dostępne razem z rozwiązaniem. Ułatwia to właściwy dobór, instalację i bezpieczne użytkowanie.</p>
          </SectionHeader>
          <div className="card-grid">
            <Card title="Czytelny dobór">
              <p>Serie, warianty i linie mocy są uporządkowane tak, aby łatwo porównać modele i dobrać właściwą konfigurację.</p>
            </Card>
            <Card title="Dokumenty techniczne">
              <p>Instrukcje i karty techniczne mają stałe adresy, oznaczoną wersję i kontrolę integralności.</p>
              <Link className="text-link" href="/downloads/ham-radio">Otwórz dokumentację</Link>
            </Card>
            <Card title="Bezpośredni kontakt">
              <p>Dobór wariantu i dostępność potwierdzamy bezpośrednio, bez automatycznego koszyka.</p>
              <Link className="text-link" href="/contact">Porozmawiajmy o współpracy</Link>
            </Card>
          </div>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Wiedza" title="Aktualności i materiały">
            <p>Publikujemy informacje o rozwiązaniach, dokumentacji i kolejnych etapach rozwoju.</p>
          </SectionHeader>
          <div className="card-grid card-grid--two">
            <article className="card editorial-card">
              <div className="editorial-card__header">
                <span className="status-pill status-pill--neutral">FAQ</span>
                <h3>Najczęstsze pytania</h3>
              </div>
              {overview.faqEntries.length === 0 ? (
                <p>Nie ma jeszcze opublikowanych wpisów FAQ.</p>
              ) : (
                <ul className="feature-list feature-list--compact">
                  {overview.faqEntries.slice(0, 3).map((entry) => <li key={entry.id}>{entry.question}</li>)}
                </ul>
              )}
              <Link className="text-link" href="/faq">Przejdź do FAQ</Link>
            </article>
            <article className="card editorial-card">
              <div className="editorial-card__header">
                <span className="status-pill status-pill--neutral">Blog</span>
                <h3>Najnowsze wpisy</h3>
              </div>
              {overview.blogPosts.length === 0 ? (
                <p>Nie ma jeszcze opublikowanych wpisów blogowych.</p>
              ) : (
                <div className="article-card">
                  {overview.blogPosts.slice(0, 2).map((post) => (
                    <div className="article-card__item" key={post.id}>
                      <p className="meta-text">{renderPublishedAt(post.publishedAt)}</p>
                      <h4>{post.title}</h4>
                      <p>{post.excerpt}</p>
                    </div>
                  ))}
                </div>
              )}
              <Link className="text-link" href="/blog">Przejdź do bloga</Link>
            </article>
          </div>
        </section>

        <section className="engagement-panel" id="newsletter">
          <div className="engagement-panel__contact">
            <span className="eyebrow eyebrow--light">Kontakt</span>
            <h2>Porozmawiajmy o współpracy</h2>
            <p>Napisz w sprawie rozwiązania, dokumentacji, dostępności lub współpracy.</p>
            <Link className="button button--light" href="/contact">Skontaktuj się</Link>
          </div>
          <div className="engagement-panel__newsletter">
            <span className="eyebrow eyebrow--light">Aktualności</span>
            <h2>Newsletter eGen Labs</h2>
            <p>Otrzymuj informacje o premierach, dokumentacji i rozwoju rozwiązań.</p>
            {newsletterSuccess ? (
              <p role="status" className="alert alert--success">
                {newsletterSuccess === 'newsletter_confirmation_sent'
                  ? 'Sprawdź skrzynkę email i potwierdź zapis do newslettera.'
                  : newsletterSuccess === 'newsletter_already_active'
                    ? 'Ten adres jest już aktywny w newsletterze.'
                    : 'Dziękujemy. Zapis do newslettera został przyjęty.'}
              </p>
            ) : null}
            {newsletterError ? (
              <p role="alert" className="alert alert--error">
                {newsletterError === 'newsletter_confirmation_failed'
                  ? 'Zapis oczekuje na potwierdzenie, ale nie udało się wysłać wiadomości.'
                  : 'Nie udało się zapisać. Sprawdź adres email i zgodę.'}
              </p>
            ) : null}
            <NewsletterSignupForm compact returnPath="/" />
          </div>
        </section>

        {featuredPdf ? (
          <p className="subtle-note">Materiał informacyjny Fito Gen: <Link className="text-link" href={`/one-pager/${featuredPdf.slug}`}>otwórz podgląd PDF</Link>.</p>
        ) : null}
      </PageContainer>
    </PublicShell>
  );
}
