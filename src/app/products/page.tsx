import Link from 'next/link';

import { PageContainer, PublicShell, SectionHeader } from '@/components/public-site';

export const metadata = {
  title: 'Rozwiązania | eGen Labs',
  description: 'Fito Gen, GEN-FED i CMC-GEN — skalowalne aplikacje i specjalistyczne rozwiązania krótkofalarskie eGen Labs.'
};

export default function ProductsPage() {
  return (
    <PublicShell>
      <PageContainer>
        <section className="hero hero--compact">
          <div className="hero__content">
            <span className="eyebrow">Rozwiązania</span>
            <h1>Rozwiązania eGen Labs</h1>
            <p className="hero__lead">
              Tworzymy aplikacje wspierające pracę operacyjną oraz specjalistyczne systemy krótkofalarskie z uporządkowaną dokumentacją techniczną.
            </p>
          </div>
          <aside className="hero__panel">
            <span className="status-pill">3 linie</span>
            <h2>Wybierz linię</h2>
            <p>Porównaj dostępne warianty, sprawdź ich zastosowanie i przejdź do dokumentacji technicznej.</p>
          </aside>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Oferta" title="Wybierz obszar">
            <p>Każda linia ma jasno określone zastosowanie, strukturę wariantów i dokumentację.</p>
          </SectionHeader>
          <div className="line-card-grid">
            <article className="line-card line-card--fito">
              <div className="line-card__top">
                <span className="status-pill">Aplikacja desktopowa</span>
                <span className="line-card__code">Desktop</span>
              </div>
              <div>
                <h2>Fito Gen</h2>
                <p>Desktopowa aplikacja offline-first dla polskich szkółek roślin, wspierająca lokalną pracę i dostęp do aktualnych danych referencyjnych.</p>
              </div>
              <Link className="button button--secondary" href="/products/fito-gen">Poznaj Fito Gen</Link>
            </article>
            <article className="line-card line-card--gen-fed">
              <div className="line-card__top">
                <span className="status-pill status-pill--neutral">19 modeli</span>
                <span className="line-card__code">HF</span>
              </div>
              <div>
                <h2>GEN-FED</h2>
                <p>Kompletne systemy antenowe 40–10 i 80–10 oraz samodzielne transformatory dopasowujące 1:49 Un-Un.</p>
              </div>
              <Link className="button button--secondary" href="/products/gen-fed">Poznaj GEN-FED</Link>
            </article>
            <article className="line-card line-card--cmc">
              <div className="line-card__top">
                <span className="status-pill status-pill--neutral">4 modele</span>
                <span className="line-card__code">CMC</span>
              </div>
              <div>
                <h2>CMC-GEN</h2>
                <p>Dławiki prądów wspólnych 1:1 dla instalacji HF w liniach µQRP, QRP, STD i HD.</p>
              </div>
              <Link className="button button--secondary" href="/products/cmc-gen">Poznaj CMC-GEN</Link>
            </article>
          </div>
        </section>

        <section className="section section--soft">
          <SectionHeader eyebrow="Dokumentacja" title="Dane techniczne i instrukcje">
            <p>Aktualna biblioteka zawiera instrukcję obsługi i instalacji oraz kartę techniczną GEN-FED / CMC-GEN 261 v20.</p>
          </SectionHeader>
          <div className="inline-actions">
            <Link className="button" href="/downloads/ham-radio">Otwórz dokumentację</Link>
            <Link className="button button--secondary" href="/contact">Porozmawiajmy o współpracy</Link>
          </div>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
