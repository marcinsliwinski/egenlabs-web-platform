import Link from 'next/link';

import { Card, PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { genFedKits, genFedUnuns } from '@/features/ham-radio';

export default function GenFedLinePage() {
  const series4010Count = genFedKits.filter((product) => product.series === '40-10').length;
  const series8010Count = genFedKits.filter((product) => product.series === '80-10').length;

  return (
    <PublicShell>
      <PageContainer>
        <section className="hero">
          <div className="hero__content">
            <span className="eyebrow">Linia produktowa 261</span>
            <h1>GEN-FED</h1>
            <p className="hero__lead">
              Modułowy system antenowy HF obejmujący kompletne Kity End-Fed, samodzielne transformatory 1:49 Un-Un oraz współpracujące dławiki CMC-GEN.
            </p>
            <div className="hero__actions">
              <Link className="button" href="/products/gen-fed/40-10">GEN-FED 40-10</Link>
              <Link className="button button--secondary" href="/products/gen-fed/80-10">GEN-FED 80-10</Link>
            </div>
          </div>
          <aside className="hero__panel">
            <span className="status-pill">S / M</span>
            <h2>Prosty model wariantów</h2>
            <ul className="feature-list">
              <li>S — promiennik skrócony cewką.</li>
              <li>M — promiennik półfalowy właściwy dla serii.</li>
              <li>µQRP, QRP, STD i HD — linie mocy i wykonania.</li>
            </ul>
          </aside>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Serie antenowe" title="Dwie serie GEN-FED na start">
            <p>Każdy Kit zawiera promiennik, przeciwwagę, transformator 1:49 Un-Un, dopasowany CMC-GEN 1:1 Choke i elementy montażowe.</p>
          </SectionHeader>
          <div className="card-grid card-grid--two">
            <Card title="GEN-FED 40-10">
              <p>{series4010Count} Kitów: warianty S 12 m i M 22 m w liniach µQRP, QRP, STD i HD.</p>
              <Link className="text-link" href="/products/gen-fed/40-10">Zobacz serię 40-10</Link>
            </Card>
            <Card title="GEN-FED 80-10">
              <p>{series8010Count} Kitów: wariant S 22 m oraz M 42 m. Wariant 80-10 M µQRP nie jest planowany.</p>
              <Link className="text-link" href="/products/gen-fed/80-10">Zobacz serię 80-10</Link>
            </Card>
          </div>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Elementy samodzielne" title="Un-Uny i choke’i dostępne osobno">
            <p>Pełna linia 261 obejmuje także produkty dla użytkowników kompletujących własną instalację.</p>
          </SectionHeader>
          <div className="card-grid card-grid--two">
            <Card title={`GEN-FED 1:49 Un-Un · ${genFedUnuns.length} warianty`}>
              <p>Samodzielne transformatory µQRP, QRP, STD i HD bez podziału S/M.</p>
              <Link className="text-link" href="/products/gen-fed/un-un">Zobacz Un-Uny</Link>
            </Card>
            <Card title="CMC-GEN 1:1 Choke">
              <p>Samodzielne dławiki prądów wspólnych dla linii µQRP, QRP, STD i HD.</p>
              <Link className="text-link" href="/products/cmc-gen">Zobacz CMC-GEN</Link>
            </Card>
          </div>
        </section>

        <section className="section">
          <div className="card card--accent">
            <h2>Dokumentacja GEN-FED / CMC-GEN 261 v20</h2>
            <p>Publicznie udostępniamy instrukcję obsługi i instalacji oraz kartę techniczną. Pozostałe dokumenty są przechowywane w dokumentacji technicznej producenta.</p>
            <Link className="button button--light" href="/downloads/ham-radio">Przejdź do dokumentów</Link>
          </div>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
