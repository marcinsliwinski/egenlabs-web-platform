import Link from 'next/link';

import { Card, PageContainer, PublicShell, SectionHeader } from '@/components/public-site';

export default function ProductsPage() {
  return (
    <PublicShell>
      <PageContainer>
        <section className="hero">
          <div className="hero__content">
            <span className="eyebrow">Produkty eGen</span>
            <h1>Praktyczne linie produktowe eGen Labs</h1>
            <p className="hero__lead">
              eGen Labs rozwija własne aplikacje, dokumentację i produkty techniczne dla konkretnych zastosowań branżowych oraz użytkowych.
            </p>
            <div className="hero__actions">
              <Link className="button" href="/products/fito-gen">Fito Gen</Link>
              <Link className="button button--secondary" href="/products/gen-fed">GEN-FED</Link>
            </div>
          </div>
          <aside className="hero__panel">
            <span className="status-pill">Katalog publiczny</span>
            <h2>Prezentacja i dokumentacja</h2>
            <p>Strona pokazuje produkty, parametry i dokumenty do pobrania. Sklep, koszyk i płatności pozostają poza obecnym zakresem.</p>
          </aside>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Linie" title="Aktualne kierunki produktowe">
            <p>Każda linia ma własny landing, spójny katalog i czytelną ścieżkę do dokumentacji.</p>
          </SectionHeader>
          <div className="card-grid">
            <Card title="Fito Gen">
              <p>Desktopowa aplikacja offline-first dla polskich szkółek roślin, rozwijana jako pierwszy produkt cyfrowy eGen Labs.</p>
              <Link className="text-link" href="/products/fito-gen">Przejdź do Fito Gen</Link>
            </Card>
            <Card title="GEN-FED">
              <p>Kompletne Kity antenowe 40-10 i 80-10 oraz samodzielne transformatory 1:49 Un-Un.</p>
              <Link className="text-link" href="/products/gen-fed">Przejdź do GEN-FED</Link>
            </Card>
            <Card title="CMC-GEN">
              <p>Samodzielne dławiki prądów wspólnych 1:1 dla instalacji HF w liniach µQRP, QRP, STD i HD.</p>
              <Link className="text-link" href="/products/cmc-gen">Przejdź do CMC-GEN</Link>
            </Card>
          </div>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
