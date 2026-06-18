import Link from 'next/link';

import { Card, PageContainer, PublicShell, SectionHeader } from '@/components/public-site';

import { hamRadioPublicDocuments } from './product-documents';
import { ProductMediaFrame } from './product-media';
import { getProductCategoryHref, getProductCategoryLabel, getProductShortDescription } from './product-catalog';
import type { HamRadioProduct } from './product-types';

type HamRadioProductPageProps = {
  product: HamRadioProduct;
};

function compactSpecs(product: HamRadioProduct) {
  return [
    ['Typ', product.productType === 'kit' ? 'Kompletny Kit' : product.productType === 'un-un' ? 'Un-Un 1:49' : 'CMC-GEN 1:1 Choke'],
    ['Seria / pasmo', product.series],
    ['Linia mocy', product.powerLine],
    ['Moc znamionowa', product.ratedPower],
    ['Wariant promiennika', product.radiatorVariant],
    ['Długość promiennika', product.radiatorLength],
    ['Cewka', product.loadingCoil],
    ['Przeciwwaga', product.counterpoiseLength],
    ['Rdzeń Un-Un', product.ununCore],
    ['Rdzeń CMC-GEN', product.chokeCore],
    ['Kabel choke’a', product.chokeCable],
    ['Kondensator', product.capacitor]
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));
}

function productContents(product: HamRadioProduct) {
  if (product.productType === 'kit') {
    return [
      `GEN-FED 1:49 Un-Un linii ${product.powerLine}`,
      `promiennik ${product.radiatorLength}${product.radiatorVariant === 'S' ? ' z cewką skracającą' : ''}`,
      `przeciwwaga ${product.counterpoiseLength}`,
      `CMC-GEN 1:1 Choke linii ${product.powerLine}`,
      'nierdzewny osprzęt i elementy montażowe właściwe dla modelu'
    ];
  }

  if (product.productType === 'un-un') {
    return ['transformator GEN-FED 1:49 Un-Un', 'obudowa i złącza właściwe dla linii mocy', 'oznaczenie modelu, partii i numeru seryjnego'];
  }

  return ['dławik prądów wspólnych CMC-GEN 1:1', 'obudowa i złącza właściwe dla linii mocy', 'oznaczenie modelu, partii i numeru seryjnego'];
}

export function HamRadioProductPage({ product }: HamRadioProductPageProps) {
  const categoryHref = getProductCategoryHref(product);
  const categoryLabel = getProductCategoryLabel(product);

  return (
    <PublicShell>
      <PageContainer>
        <nav className="breadcrumbs" aria-label="Okruszki">
          <Link href="/products">Rozwiązania</Link>
          <span aria-hidden="true">/</span>
          <Link href={categoryHref}>{categoryLabel}</Link>
          <span aria-hidden="true">/</span>
          <span>{product.sku}</span>
        </nav>

        <section className="hero">
          <div className="hero__content">
            <span className="eyebrow">{product.sku}</span>
            <h1>{product.name}</h1>
            <p className="hero__lead">{getProductShortDescription(product)}</p>
            <div className="hero__actions">
              <Link className="button" href={`/contact?product=${encodeURIComponent(product.sku)}`}>Zapytaj o dostępność</Link>
              <Link className="button button--secondary" href="/downloads/ham-radio">Dokumentacja v20</Link>
            </div>
          </div>
          <aside className="hero__panel">
            <div className="product-card__badges">
              {product.radiatorVariant ? <span className="status-pill">{product.radiatorVariant}</span> : null}
              <span className="status-pill status-pill--neutral">{product.powerLine}</span>
            </div>
            <h2>Najważniejsze parametry</h2>
            <dl className="hero-facts">
              <div><dt>Moc</dt><dd>{product.ratedPower}</dd></div>
              {product.radiatorLength ? <div><dt>Promiennik</dt><dd>{product.radiatorLength}</dd></div> : null}
              {product.ununCore ? <div><dt>Un-Un</dt><dd>{product.ununCore}</dd></div> : null}
              {product.chokeCore ? <div><dt>CMC-GEN</dt><dd>{product.chokeCore}</dd></div> : null}
            </dl>
          </aside>
        </section>

        {product.media?.cover ? (
          <section className="section product-media-section">
            <ProductMediaFrame label={product.name} media={product.media} />
          </section>
        ) : null}

        <section className="section">
          <SectionHeader eyebrow="Specyfikacja" title="Dane techniczne">
            <p>Parametry odpowiadają zatwierdzonej dokumentacji GEN-FED / CMC-GEN 261 v20.</p>
          </SectionHeader>
          <dl className="spec-grid">
            {compactSpecs(product).map(([label, value]) => (
              <div className="spec-item" key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Zawartość" title={product.productType === 'kit' ? 'Zawartość zestawu' : 'Zakres produktu'}>
            <p>{product.productType === 'kit' ? 'Kit jest kompletnym, dopasowanym systemem antenowym zgodnym z dokumentacją serii 261.' : 'Promiennik, przeciwwaga i pozostałe elementy instalacji nie wchodzą w skład produktu samodzielnego.'}</p>
          </SectionHeader>
          <div className="card-grid card-grid--two">
            <Card title="Elementy">
              <ul className="feature-list">{productContents(product).map((item) => <li key={item}>{item}</li>)}</ul>
            </Card>
            <Card title="Dobór wariantu">
              <p>{product.notes ?? 'Model należy dobrać do linii mocy, rodzaju emisji oraz rzeczywistej konfiguracji instalacji antenowej.'}</p>
            </Card>
          </div>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Dokumentacja" title="Dokumenty produktu">
            <p>Szczegóły parametrów, montażu i bezpiecznego użytkowania znajdują się w aktualnej dokumentacji v20.</p>
          </SectionHeader>
          <div className="document-list">
            {hamRadioPublicDocuments.map((document) => (
              <article className="document-item" key={document.key}>
                <div>
                  <h3>{document.label}</h3>
                  <p className="meta-text">GEN-FED / CMC-GEN 261 · {document.version}</p>
                  <p>{document.filename}</p>
                </div>
                <a className="button button--secondary" href={document.href} target="_blank" rel="noreferrer">Pobierz PDF</a>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Bezpieczeństwo" title="Zasady bezpiecznego użytkowania">
            <p>Pełne wymagania montażowe i ostrzeżenia znajdują się w instrukcji obsługi i instalacji v20.</p>
          </SectionHeader>
          <div className="card card--accent">
            <ul className="feature-list">
              <li>Nie instaluj anteny w pobliżu linii energetycznych ani w warunkach burzowych.</li>
              <li>Nie przekraczaj mocy znamionowej i kontroluj SWR przed rozpoczęciem pracy.</li>
              <li>Zapewnij stabilne mocowanie oraz bezpieczne odległości od ludzi, zwierząt i elementów przewodzących.</li>
              {product.productType === 'kit' ? <li>CMC-GEN montuj możliwie blisko Un-Una, zgodnie z instrukcją v20.</li> : null}
            </ul>
          </div>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
