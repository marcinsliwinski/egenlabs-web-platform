import Link from 'next/link';

import { Card, PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { hamRadioPublicDocuments } from '@/features/ham-radio';

export const metadata = {
  title: 'Dokumenty GEN-FED / CMC-GEN | eGen Labs',
  description: 'Publiczna dokumentacja GEN-FED / CMC-GEN 261 v20: instrukcja obsługi i instalacji oraz karta techniczna.'
};

export default function HamRadioDownloadsPage() {
  return (
    <PublicShell>
      <PageContainer>
        <section className="hero">
          <div className="hero__content">
            <span className="eyebrow">Biblioteka dokumentów</span>
            <h1>GEN-FED / CMC-GEN 261</h1>
            <p className="hero__lead">Zweryfikowane dokumenty publiczne v20 dla pełnego katalogu Kitów, Un-Unów i choke’ów serii 261.</p>
            <div className="hero__actions">
              <Link className="button" href="/products/gen-fed">Zobacz GEN-FED</Link>
              <Link className="button button--secondary" href="/products/cmc-gen">Zobacz CMC-GEN</Link>
            </div>
          </div>
          <aside className="hero__panel">
            <span className="status-pill">v20</span>
            <h2>Zakres publikacji</h2>
            <p>Publicznie udostępniane są instrukcja obsługi i instalacji oraz karta techniczna. Dokumentacja wewnętrzna i oświadczenie producenta pozostają w archiwum technicznym.</p>
          </aside>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Pobieranie" title="Dokumenty publiczne v20">
            <p>Dokumenty są wspólne dla katalogu GEN-FED / CMC-GEN 261 i zawierają identyfikację wszystkich 23 produktów.</p>
          </SectionHeader>
          <div className="document-list">
            {hamRadioPublicDocuments.map((document) => (
              <article className="document-item" key={document.key}>
                <div>
                  <h3>{document.label}</h3>
                  <p>GEN-FED / CMC-GEN 261 · {document.version}</p>
                  <p className="meta-text">{document.filename}</p>
                </div>
                <a className="button" href={document.href} target="_blank" rel="noreferrer">Pobierz PDF</a>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Zakres katalogu" title="Dokumentacja obejmuje trzy grupy produktów">
            <p>Każda karta produktu na stronie prowadzi do tego samego, kontrolowanego kompletu dokumentacji v20.</p>
          </SectionHeader>
          <div className="card-grid">
            <Card title="GEN-FED Kit">
              <p>15 kompletnych zestawów antenowych: serie 40-10 i 80-10, warianty S/M oraz linie µQRP, QRP, STD i HD.</p>
            </Card>
            <Card title="GEN-FED 1:49 Un-Un">
              <p>4 samodzielne transformatory dopasowujące w liniach µQRP, QRP, STD i HD.</p>
            </Card>
            <Card title="CMC-GEN 1:1 Choke">
              <p>4 samodzielne dławiki prądów wspólnych w liniach µQRP, QRP, STD i HD.</p>
            </Card>
          </div>
        </section>

        <section className="section">
          <div className="card card--accent">
            <h2>Identyfikacja egzemplarza</h2>
            <p>Pusta strona identyfikacyjna w instrukcji jest przeznaczona na wklejkę z modelem/SKU, numerem seryjnym, partią i wersją dokumentacji produktu.</p>
          </div>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
