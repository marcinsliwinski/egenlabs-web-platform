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
            <span className="eyebrow">Dławiki prądów wspólnych</span>
            <h1>CMC-GEN 1:1 Choke</h1>
            <p className="hero__lead">Dławiki dla instalacji antenowych HF, dostępne jako element kompletnych Kitów GEN-FED oraz jako samodzielne rozwiązania.</p>
            <div className="hero__actions">
              <Link className="button" href="/contact">Zapytaj o dostępność</Link>
              <Link className="button button--secondary" href="/downloads/ham-radio">Dokumentacja v20</Link>
            </div>
          </div>
          <aside className="hero__panel">
            <span className="status-pill">1:1</span>
            <h2>Dobór według mocy</h2>
            <p>Linie µQRP, QRP, STD i HD różnią się rdzeniami, kablem koncentrycznym oraz obciążalnością dla DIGI, CW i SSB.</p>
          </aside>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Zastosowanie" title="Stabilniejsza praca instalacji HF">
            <p>CMC-GEN ogranicza prądy wspólne płynące po zewnętrznej powierzchni kabla koncentrycznego, wspierając redukcję zakłóceń i wpływu linii zasilającej na pracę anteny.</p>
          </SectionHeader>
          <div className="card-grid card-grid--two">
            <article className="card card--accent">
              <h3>Komponenty klasy RF</h3>
              <p>W zależności od wariantu stosowane są rdzenie Amidon produkowane przez Fair-Rite oraz przewody HUBER+SUHNER RG-178, RG-316 lub RG-400.</p>
            </article>
            <article className="card">
              <h3>Dobór do emisji</h3>
              <p>Limity mocy są określone osobno dla DIGI, CW i SSB, co ułatwia dobór wariantu do rzeczywistego sposobu pracy.</p>
            </article>
          </div>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Katalog" title="Cztery warianty CMC-GEN">
            <p>Dla linii STD samodzielny dławik ma wyższy limit mocy niż kompletny Kit, którego moc ogranicza zastosowany Un-Un.</p>
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
