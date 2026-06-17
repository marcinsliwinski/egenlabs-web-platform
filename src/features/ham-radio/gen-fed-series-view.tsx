import Link from 'next/link';

import { Card, PageContainer, PublicShell, SectionHeader } from '@/components/public-site';

import { HamRadioProductCard } from './product-card';
import { getGenFedKitsBySeries, powerLineOrder } from './product-catalog';
import type { HamRadioPowerLine } from './product-types';

type GenFedSeriesViewProps = {
  series: '40-10' | '80-10';
};

const seriesCopy = {
  '40-10': {
    title: 'GEN-FED 40-10',
    lead: 'Kompletne zestawy antenowe End-Fed dla pasm 40–10 m, dostępne w wariancie skróconym S oraz półfalowym M.',
    shortLength: '12 m',
    mediumLength: '22 m',
    counterpoise: '2,1 m'
  },
  '80-10': {
    title: 'GEN-FED 80-10',
    lead: 'Kompletne zestawy antenowe End-Fed dla pasm 80–10 m, dostępne w wariancie skróconym S oraz półfalowym M.',
    shortLength: '22 m',
    mediumLength: '42 m',
    counterpoise: '4,2 m'
  }
} as const;

export function GenFedSeriesView({ series }: GenFedSeriesViewProps) {
  const products = getGenFedKitsBySeries(series);
  const copy = seriesCopy[series];
  const byVariant = (variant: 'S' | 'M', powerLine: HamRadioPowerLine) =>
    products.find((product) => product.radiatorVariant === variant && product.powerLine === powerLine) ?? null;

  return (
    <PublicShell>
      <PageContainer>
        <section className="hero">
          <div className="hero__content">
            <span className="eyebrow">Seria produktowa 261</span>
            <h1>{copy.title}</h1>
            <p className="hero__lead">{copy.lead}</p>
            <div className="hero__actions">
              <Link className="button" href="/contact">Zapytaj o dostępność</Link>
              <Link className="button button--secondary" href="/downloads/ham-radio">Dokumentacja v20</Link>
            </div>
          </div>
          <aside className="hero__panel">
            <span className="status-pill">S / M</span>
            <h2>Dwa warianty długości</h2>
            <ul className="feature-list">
              <li>S — {copy.shortLength}, promiennik skrócony cewką 36 µH.</li>
              <li>M — {copy.mediumLength}, promiennik półfalowy bez cewki.</li>
              <li>Przeciwwaga: {copy.counterpoise}.</li>
            </ul>
          </aside>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Porównanie" title={`Wybierz wariant ${copy.title}`}>
            <p>Najpierw wybierz długość promiennika, a następnie linię mocy. Każdy Kit zawiera Un-Un, promiennik, przeciwwagę, dopasowany CMC-GEN i elementy montażowe.</p>
          </SectionHeader>
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th scope="col">Wariant</th>
                  {powerLineOrder.map((powerLine) => <th scope="col" key={powerLine}>{powerLine}</th>)}
                </tr>
              </thead>
              <tbody>
                {(['S', 'M'] as const).map((variant) => (
                  <tr key={variant}>
                    <th scope="row">
                      {variant}
                      <span>{variant === 'S' ? `${copy.shortLength} · skrócony` : `${copy.mediumLength} · półfalowy`}</span>
                    </th>
                    {powerLineOrder.map((powerLine) => {
                      const product = byVariant(variant, powerLine);
                      return (
                        <td key={powerLine}>
                          {product ? (
                            <Link className="comparison-link" href={`/products/gen-fed/${series}/${product.slug}`}>
                              <strong>{product.powerLine}</strong>
                              <span>{product.ratedPower}</span>
                            </Link>
                          ) : (
                            <span className="comparison-empty">Nieplanowany</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Katalog" title={`${products.length} produktów w serii ${series}`}>
            <p>Produkty są prezentowane informacyjnie. Sklep, koszyk i płatności pozostają poza obecnym zakresem strony.</p>
          </SectionHeader>
          <div className="card-grid">
            {products.map((product) => (
              <HamRadioProductCard
                key={product.sku}
                product={product}
                href={`/products/gen-fed/${series}/${product.slug}`}
              />
            ))}
          </div>
        </section>

        <section className="section">
          <div className="card-grid card-grid--two">
            <Card title="Samodzielne Un-Uny">
              <p>Transformatory 1:49 są również dostępne jako samodzielne produkty w liniach µQRP, QRP, STD i HD.</p>
              <Link className="text-link" href="/products/gen-fed/un-un">Zobacz Un-Uny</Link>
            </Card>
            <Card title="Samodzielne choke’i CMC-GEN">
              <p>Dławiki CMC-GEN mogą być stosowane także jako oddzielne elementy instalacji antenowej.</p>
              <Link className="text-link" href="/products/cmc-gen">Zobacz CMC-GEN</Link>
            </Card>
          </div>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
