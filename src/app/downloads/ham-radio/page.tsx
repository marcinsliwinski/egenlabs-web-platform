import Link from 'next/link';

import { Card, PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { hamRadioPublicDocuments } from '@/features/ham-radio';

export const metadata = {
  title: 'Dokumentacja GEN-FED / CMC-GEN | eGen Labs',
  description: 'Instrukcja obsługi i instalacji oraz karta techniczna GEN-FED / CMC-GEN 261 v20.'
};

export default function HamRadioDownloadsPage() {
  return (
    <PublicShell>
      <PageContainer>
        <section className="hero">
          <div className="hero__content">
            <span className="eyebrow">Dokumentacja</span>
            <h1>GEN-FED / CMC-GEN 261</h1>
            <p className="hero__lead">Instrukcja obsługi i instalacji oraz karta techniczna dla aktualnego katalogu serii 261.</p>
            <div className="hero__actions">
              <Link className="button" href="/products/gen-fed">Zobacz GEN-FED</Link>
              <Link className="button button--secondary" href="/products/cmc-gen">Zobacz CMC-GEN</Link>
            </div>
          </div>
          <aside className="hero__panel">
            <span className="status-pill">v20</span>
            <h2>Aktualna wersja</h2>
            <p>Dokumenty obejmują parametry techniczne, zasady montażu, użytkowania i bezpieczeństwa dla całej serii 261.</p>
          </aside>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Pobieranie" title="Dokumenty do pobrania">
            <p>Pliki są wspólne dla wszystkich 23 modeli GEN-FED i CMC-GEN w katalogu 261.</p>
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
          <SectionHeader eyebrow="Zakres" title="Trzy grupy rozwiązań">
            <p>Dokumentacja v20 obejmuje kompletne Kity GEN-FED, transformatory 1:49 Un-Un oraz dławiki CMC-GEN.</p>
          </SectionHeader>
          <div className="card-grid">
            <Card title="GEN-FED Kit">
              <p>15 kompletnych systemów antenowych: serie 40-10 i 80-10, warianty S/M oraz linie µQRP, QRP, STD i HD.</p>
            </Card>
            <Card title="GEN-FED 1:49 Un-Un">
              <p>4 samodzielne transformatory dopasowujące w liniach µQRP, QRP, STD i HD.</p>
            </Card>
            <Card title="CMC-GEN 1:1 Choke">
              <p>4 samodzielne dławiki prądów wspólnych w liniach µQRP, QRP, STD i HD.</p>
            </Card>
          </div>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
