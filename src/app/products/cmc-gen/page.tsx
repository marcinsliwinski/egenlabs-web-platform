import Link from 'next/link';

import { PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { cmcGenChokes } from '@/features/ham-radio';
import { HamRadioProductCard } from '@/features/ham-radio/product-card';

export const metadata = {
  title: 'CMC-GEN 1:1 Choke | eGen Labs',
  description: 'Dławiki prądów wspólnych CMC-GEN 1:1 w liniach µQRP, QRP, STD i HD.'
};

export default function CmcGenPage() {
  return (
    <PublicShell>
      <PageContainer>
        <section className="hero">
          <div className="hero__content">
            <span className="eyebrow">Linia produktowa 261</span>
            <h1>CMC-GEN 1:1 Choke</h1>
            <p className="hero__lead">Dławiki prądów wspólnych dla instalacji antenowych HF, dostępne jako elementy Kitów GEN-FED oraz produkty samodzielne.</p>
            <div className="hero__actions">
              <Link className="button" href="/contact">Zapytaj o dostępność</Link>
              <Link className="button button--secondary" href="/downloads/ham-radio">Dokumentacja v20</Link>
            </div>
          </div>
          <aside className="hero__panel">
            <span className="status-pill">1:1</span>
            <h2>Dobór według mocy</h2>
            <p>Linie µQRP, QRP, STD i HD różnią się rdzeniami, kablem koncentrycznym oraz mocą znamionową.</p>
          </aside>
        </section>
        <section className="section">
          <SectionHeader eyebrow="Katalog" title="Cztery warianty CMC-GEN">
            <p>Dla linii STD samodzielny choke ma wyższy limit mocy niż kompletny Kit, którego moc ogranicza Un-Un.</p>
          </SectionHeader>
          <div className="card-grid card-grid--two">
            {cmcGenChokes.map((product) => (
              <HamRadioProductCard key={product.sku} product={product} href={`/products/cmc-gen/${product.slug}`} />
            ))}
          </div>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
