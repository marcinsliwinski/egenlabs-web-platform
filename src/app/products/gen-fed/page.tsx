import Link from 'next/link';

import { Card, PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { genFedKits, genFedUnuns } from '@/features/ham-radio';

export const metadata = {
  title: 'GEN-FED | eGen Labs',
  description: 'Kompletne systemy antenowe GEN-FED 40-10 i 80-10 oraz transformatory 1:49 Un-Un.'
};

export default function GenFedLinePage() {
  const series4010Count = genFedKits.filter((product) => product.series === '40-10').length;
  const series8010Count = genFedKits.filter((product) => product.series === '80-10').length;

  return (
    <PublicShell>
      <PageContainer>
        <section className="hero">
          <div className="hero__content">
            <span className="eyebrow">Systemy antenowe HF</span>
            <h1>GEN-FED</h1>
            <p className="hero__lead">
              Kompletne systemy End-Fed obejmujące promiennik, przeciwwagę, transformator 1:49 Un-Un, dopasowany dławik CMC-GEN i osprzęt montażowy.
            </p>
            <div className="hero__actions">
              <Link className="button" href="/products/gen-fed/40-10">GEN-FED 40-10</Link>
              <Link className="button button--secondary" href="/products/gen-fed/80-10">GEN-FED 80-10</Link>
            </div>
          </div>
          <aside className="hero__panel">
            <span className="status-pill">S / M</span>
            <h2>Dwa warianty długości</h2>
            <ul className="feature-list">
              <li>S — promiennik skrócony cewką.</li>
              <li>M — promiennik półfalowy właściwy dla serii.</li>
              <li>µQRP, QRP, STD i HD — linie mocy i wykonania.</li>
            </ul>
          </aside>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Konstrukcja" title="Rozwiązania projektowane jako kompletny system">
            <p>GEN-FED i CMC-GEN są projektowane z myślą o przewidywalnej pracy, trwałości i właściwym dopasowaniu wszystkich elementów zestawu.</p>
          </SectionHeader>
          <div className="quality-grid">
            <Card title="Komponenty dobrane do zastosowania">
              <p>
                W rodzinie rozwiązań stosujemy m.in. rdzenie Amidon produkowane przez Fair-Rite, przewody koncentryczne HUBER+SUHNER z grup RG-178, RG-316 i RG-400, złącza RF Amphenol oraz izolacje FEP, PTFE i poliimidowe typu Kapton.
              </p>
            </Card>
            <Card title="Kompletny i spasowany zestaw">
              <p>
                Każdy Kit łączy Un-Un, promiennik, przeciwwagę, odpowiedni CMC-GEN 1:1 Choke oraz nierdzewny osprzęt montażowy dobrany do konkretnej serii i linii mocy.
              </p>
            </Card>
            <Card title="Teren i instalacje stacjonarne">
              <p>
                Serie µQRP i QRP są lekkie i mobilne, z promiennikami wzmacnianymi włóknami Kevlar lub Vectran. Serie STD i HD są przeznaczone do instalacji stacjonarnych i większych obciążeń.
              </p>
            </Card>
            <Card title="DIGI, CW i SSB">
              <p>
                Parametry mocy są określane osobno dla emisji DIGI, CW i SSB, z uwzględnieniem różnic w obciążeniu cieplnym i współczynniku wypełnienia.
              </p>
            </Card>
          </div>
          <p className="subtle-note subtle-note--section">Szczegółowa konfiguracja materiałowa zależy od konkretnego modelu i jest podana na jego stronie oraz w karcie technicznej v20.</p>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Serie" title="GEN-FED 40-10 i 80-10">
            <p>Każdy Kit zawiera promiennik, przeciwwagę, transformator 1:49 Un-Un, dopasowany CMC-GEN 1:1 Choke i elementy montażowe.</p>
          </SectionHeader>
          <div className="card-grid card-grid--two">
            <Card title="GEN-FED 40-10">
              <p>{series4010Count} Kitów: warianty S 12 m i M 22 m w liniach µQRP, QRP, STD i HD.</p>
              <Link className="text-link" href="/products/gen-fed/40-10">Zobacz serię 40-10</Link>
            </Card>
            <Card title="GEN-FED 80-10">
              <p>{series8010Count} Kitów: wariant S 22 m oraz M 42 m w dostępnych liniach mocy.</p>
              <Link className="text-link" href="/products/gen-fed/80-10">Zobacz serię 80-10</Link>
            </Card>
          </div>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Komponenty" title="Un-Uny i dławiki dostępne osobno">
            <p>Pełna linia 261 obejmuje również elementy dla użytkowników kompletujących własną instalację.</p>
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
            <p>Instrukcja obsługi i instalacji oraz karta techniczna zawierają parametry, zasady montażu i wymagania bezpieczeństwa dla całej serii 261.</p>
            <Link className="button button--light" href="/downloads/ham-radio">Otwórz dokumentację</Link>
          </div>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
