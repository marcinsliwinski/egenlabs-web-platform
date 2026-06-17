import Link from 'next/link';

import { Card, PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { getPublicSiteOverview } from '@/features/content/content-service';
import { getPublicEnabledMarketingPdfs } from '@/features/pdf/pdf-service';

function renderPublishedAt(value: Date | null) {
  if (!value) {
    return 'W przygotowaniu';
  }

  return new Intl.DateTimeFormat('pl-PL', { dateStyle: 'medium' }).format(value);
}

export default async function HomePage() {
  const [overview, publicPdfs] = await Promise.all([getPublicSiteOverview(), getPublicEnabledMarketingPdfs()]);
  const featuredPdf = publicPdfs[0] ?? null;

  return (
    <PublicShell>
      <PageContainer>
        <section className="hero">
          <div className="hero__content">
            <span className="eyebrow">eGen Labs · platforma produktowa</span>
            <h1>Praktyczne produkty eGen dla wyspecjalizowanych branż</h1>
            <p className="hero__lead">
              eGen Labs rozwija własne narzędzia cyfrowe, dokumentację i produkty techniczne tam, gdzie liczą się proces,
              zgodność, powtarzalność i spokojne wdrożenie. To zaplecze produktowe ekosystemu eGen.
            </p>
            <div className="hero__actions">
              <Link className="button" href="/products/fito-gen">Poznaj Fito Gen</Link>
              <Link className="button button--secondary" href="/products/gen-fed">Zobacz GEN-FED</Link>
            </div>
          </div>
          <aside className="hero__panel" aria-label="Status platformy">
            <span className="status-pill">Public launch candidate</span>
            <h2>Strona jako wizytówka marki</h2>
            <p>
              Startujemy od profesjonalnej strony eGen Labs, prezentacji pierwszego produktu i kanałów kontaktu.
              Link do programu Fito Gen Essentials zostanie dodany dopiero po ukończeniu desktopowego MVP.
            </p>
            <div className="metric-grid">
              <div className="metric">
                <strong>PL</strong>
                <span>komunikacja startowa</span>
              </div>
              <div className="metric">
                <strong>1st</strong>
                <span>Fito Gen Essentials</span>
              </div>
              <div className="metric">
                <strong>API</strong>
                <span>wsparcie aplikacji eGen</span>
              </div>
              <div className="metric">
                <strong>offline</strong>
                <span>desktop bez cloud lock-in</span>
              </div>
            </div>
          </aside>
        </section>

        <section id="platforma" className="section">
          <SectionHeader eyebrow="Tożsamość" title="eGen Labs jako platforma produktowa ekosystemu eGen">
            <p>
              Publiczna strona ma budować zaufanie do produktów eGen. Główny przekaz koncentruje się na narzędziach własnych,
              materiałach, dokumentacji i rozwiązaniach dla konkretnych zastosowań biznesowych oraz technicznych.
            </p>
          </SectionHeader>
          <div className="card-grid">
            <Card title="Produkty własne eGen">
              <p>Rozwijamy konkretne narzędzia pod realne procesy: od aplikacji desktopowych po materiały użytkowe i dokumentację.</p>
            </Card>
            <Card title="Praktyczna dokumentacja">
              <p>Stawiamy na instrukcje, checklisty, deklaracje, materiały zgodności i wiedzę, którą da się od razu zastosować.</p>
            </Card>
            <Card title="Wsparcie platformowe">
              <p>egenlabs.eu zapewnia publikację treści, kontakt, newsletter, aktualizacje i paczki wspierające dla aplikacji eGen.</p>
            </Card>
          </div>
        </section>

        <section id="produkty" className="section">
          <SectionHeader eyebrow="Pierwszy produkt" title="Fito Gen Essentials — praktyczny desktop dla szkółek roślin">
            <p>
              Fito Gen Essentials pozostaje pierwszym produktem eGen Labs. Strona może już teraz pokazywać kierunek produktu,
              ale pobranie programu zostanie uruchomione dopiero po zakończeniu desktopowego MVP.
            </p>
          </SectionHeader>
          <div className="split-layout">
            <article className="card card--accent">
              <span className="status-pill">W przygotowaniu</span>
              <h2>Fito Gen Essentials</h2>
              <p>
                Aplikacja desktopowa offline-first dla polskich szkółek roślin, projektowana pod prostą pracę lokalną,
                dokumentację i praktyczne procesy bez ciężkiego wdrożenia.
              </p>
              <ul className="feature-list">
                <li>lokalna praca użytkownika i brak cloud sync w MVP,</li>
                <li>zewnętrzne wsparcie przez aktualizacje, news feed i paczki słownikowe,</li>
                <li>publiczna komunikacja produktu po polsku.</li>
              </ul>
            </article>
            <aside className="card">
              <h3>Co zostaje na kolejny krok?</h3>
              <ul className="feature-list">
                <li>finalny link do pobrania Fito Gen,</li>
                <li>instrukcje użytkowania programu,</li>
                <li>materiały onboardingowe dla szkółek,</li>
                <li>pełny product download launch po ukończeniu desktopu.</li>
              </ul>
              {featuredPdf ? (
                <p>
                  Materiał PDF jest już obsługiwany technicznie: <Link className="text-link" href={`/one-pager/${featuredPdf.slug}`}>otwórz podgląd</Link>.
                </p>
              ) : null}
            </aside>
          </div>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Kierunki rozwoju" title="Jedna marka, kilka praktycznych linii produktowych">
            <p>
              eGen Labs powinno wyglądać jak wiarygodny producent produktów i wiedzy, który może rozwijać kolejne linie bez rozmywania pierwszego launchu.
            </p>
          </SectionHeader>
          <div className="card-grid">
            <Card title="Fito Gen">
              <p>Pierwszy kierunek: narzędzia i materiały dla szkółek roślin, dokumentacji i pracy zgodnej z wymogami branżowymi.</p>
            </Card>
            <Card title="Desktop Support Platform">
              <p>Wspólne capability dla aplikacji desktopowych eGen: aktualizacje, newsy, paczki referencyjne i kanały feedbacku.</p>
            </Card>
            <Card title="GEN-FED">
              <p>Linia kompletnych zestawów antenowych 40-10 i 80-10, samodzielnych Un-Unów oraz współpracujących dławików CMC-GEN.</p>
              <Link className="text-link" href="/products/gen-fed">Zobacz linię GEN-FED</Link>
            </Card>
          </div>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Wizerunek" title="Pierwsze wrażenie ma być spokojne, konkretne i profesjonalne">
            <p>
              Strona startowa nie ma wyglądać jak ogólna oferta usług IT. Ma jasno pokazać, że eGen Labs buduje własne produkty,
              publikuje wiedzę i przygotowuje ekosystem pod kolejne narzędzia.
            </p>
          </SectionHeader>
          <div className="card-grid">
            <Card title="Bez przedwczesnych obietnic">
              <p>Nie promujemy pobrania programu, dopóki Fito Gen Essentials nie będzie gotowy do publicznego użycia.</p>
            </Card>
            <Card title="Zbieranie kontaktów">
              <p>Na tym etapie najważniejsze są kontakt, newsletter i zbudowanie wiarygodności przed właściwym product launch.</p>
            </Card>
            <Card title="Spójność eGen">
              <p>Przekaz pozostaje praktyczny, branżowy i produktowy — bez narracji usługowej i bez nadmiaru deep-tech.</p>
            </Card>
          </div>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Wiedza" title="Aktualności i materiały">
            <p>Blog i FAQ mogą wspierać start strony, nawet zanim program desktopowy zostanie opublikowany.</p>
          </SectionHeader>
          <div className="card-grid card-grid--two">
            <article className="card">
              <h3>Najczęstsze pytania</h3>
              {overview.faqEntries.length === 0 ? (
                <p>Nie ma jeszcze opublikowanych wpisów FAQ.</p>
              ) : (
                <ul className="feature-list">
                  {overview.faqEntries.slice(0, 3).map((entry) => (
                    <li key={entry.id}>{entry.question}</li>
                  ))}
                </ul>
              )}
              <Link className="text-link" href="/faq">Przejdź do FAQ</Link>
            </article>
            <article className="card">
              <h3>Najnowsze wpisy</h3>
              {overview.blogPosts.length === 0 ? (
                <p>Nie ma jeszcze opublikowanych wpisów blogowych.</p>
              ) : (
                <div className="article-card">
                  {overview.blogPosts.slice(0, 2).map((post) => (
                    <div key={post.id}>
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

        <section className="card card--accent">
          <span className="status-pill">Następny krok</span>
          <h2>Start strony teraz, pobranie programu po ukończeniu Fito Gen</h2>
          <p>
            Najbezpieczniejsza ścieżka: uruchomić profesjonalną wizytówkę eGen Labs, zebrać pierwsze kontakty,
            a po ukończeniu Fito Gen Essentials dodać finalny link, program i komplet materiałów użytkownika.
          </p>
          <div className="cta-row">
            <Link className="button button--secondary" href="/contact">Kontakt</Link>
            <Link className="button button--secondary" href="/newsletter">Newsletter</Link>
          </div>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
