import Link from 'next/link';

import { Card, PageContainer, PublicShell, SectionHeader } from '@/components/public-site';

export const metadata = {
  title: 'Informacje prawne | eGen Labs',
  description: 'Informacje prawne dotyczące strony egenlabs.eu, produktów eGen Labs, dokumentacji i kontaktu.'
};

export default function LegalPage() {
  return (
    <PublicShell>
      <PageContainer>
        <section className="hero hero--compact">
          <div className="hero__content">
            <span className="eyebrow">Informacje prawne</span>
            <h1>Zasady korzystania ze strony i dokumentacji</h1>
            <p className="hero__lead">
              W tym miejscu zebrano podstawowe informacje dotyczące treści publikowanych na egenlabs.eu, dokumentacji produktów i kanałów kontaktu.
            </p>
          </div>
          <aside className="hero__panel">
            <span className="status-pill">egenlabs.eu</span>
            <h2>Dane produktowe</h2>
            <p>Identyfikacja produktu i dane podmiotu odpowiedzialnego znajdują się w zatwierdzonych dokumentach przypisanych do danej linii produktowej.</p>
          </aside>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Strona" title="Charakter informacji">
            <p>Treści publiczne służą prezentacji produktów, dokumentacji i aktualnego zakresu oferty eGen Labs.</p>
          </SectionHeader>
          <div className="card-grid card-grid--two">
            <Card title="Katalog informacyjny">
              <p>Strona nie prowadzi obecnie automatycznej sprzedaży, nie obsługuje koszyka ani płatności internetowych. Dostępność produktów jest potwierdzana indywidualnie.</p>
            </Card>
            <Card title="Dokumentacja produktu">
              <p>Wiążące parametry, zasady montażu, bezpieczeństwa i identyfikacji należy sprawdzać w aktualnej wersji instrukcji oraz karty technicznej.</p>
            </Card>
          </div>
        </section>

        <section className="section section--soft">
          <SectionHeader eyebrow="Prawa do treści" title="Materiały eGen Labs">
            <p>Teksty, układ strony, dokumentacja i materiały produktowe są przeznaczone do korzystania zgodnie z ich funkcją informacyjną i użytkową.</p>
          </SectionHeader>
          <div className="card-grid card-grid--two">
            <Card title="Aktualność informacji">
              <p>Zakres produktów i dokumentów może być aktualizowany. Przy doborze produktu należy posługiwać się oznaczeniem SKU i wersją dokumentacji.</p>
            </Card>
            <Card title="Kontakt">
              <p>Pytania dotyczące produktów, dokumentacji lub działania strony można przesłać przez formularz kontaktowy.</p>
              <Link className="text-link text-link--arrow" href="/contact">Przejdź do kontaktu <span aria-hidden="true">→</span></Link>
            </Card>
          </div>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
