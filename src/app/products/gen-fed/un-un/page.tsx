import Link from 'next/link';

import { PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { genFedUnuns } from '@/features/ham-radio';
import { HamRadioProductCard } from '@/features/ham-radio/product-card';

export const metadata = {
  title: 'GEN-FED 1:49 Un-Un | eGen Labs',
  description: 'Samodzielne transformatory GEN-FED 1:49 Un-Un w liniach µQRP, QRP, STD i HD.'
};

export default function GenFedUnunPage() {
  return (
    <PublicShell>
      <PageContainer>
        <section className="hero">
          <div className="hero__content">
            <span className="eyebrow">Produkty samodzielne 261</span>
            <h1>GEN-FED 1:49 Un-Un</h1>
            <p className="hero__lead">Samodzielne transformatory dopasowujące dla systemów End-Fed HF, dostępne w czterech liniach mocy.</p>
            <div className="hero__actions">
              <Link className="button" href="/contact">Zapytaj o dostępność</Link>
              <Link className="button button--secondary" href="/downloads/ham-radio">Dokumentacja v20</Link>
            </div>
          </div>
          <aside className="hero__panel">
            <span className="status-pill">1:49</span>
            <h2>Bez wariantów S/M</h2>
            <p>Un-Un dobiera się według linii mocy. Promiennik, przeciwwaga i choke nie wchodzą w skład produktu samodzielnego.</p>
          </aside>
        </section>
        <section className="section">
          <SectionHeader eyebrow="Katalog" title="Cztery warianty Un-Un">
            <p>µQRP, QRP, STD i HD wykorzystują różne rdzenie, przewody, kondensatory oraz limity mocy.</p>
          </SectionHeader>
          <div className="card-grid card-grid--two">
            {genFedUnuns.map((product) => (
              <HamRadioProductCard key={product.sku} product={product} href={`/products/gen-fed/un-un/${product.slug}`} />
            ))}
          </div>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
