import { PageContainer, PublicShell, SectionHeader } from '@/components/public-site';
import { getPublicFaqEntries } from '@/features/content/content-service';

export default async function FaqPage() {
  const faqEntries = await getPublicFaqEntries();

  return (
    <PublicShell>
      <PageContainer>
        <SectionHeader eyebrow="FAQ" title="Najczęstsze pytania">
          <p>Odpowiedzi dotyczące eGen Labs, kierunku produktów i pierwszego produktu Fito Gen Essentials.</p>
        </SectionHeader>

        {faqEntries.length === 0 ? (
          <section className="card">
            <h2>Brak opublikowanych pytań</h2>
            <p>FAQ zostanie uzupełnione przed szerszą komunikacją produktową.</p>
          </section>
        ) : (
          <section className="section">
            {faqEntries.map((entry) => (
              <article key={entry.id} id={entry.slug} className="card">
                <h2>{entry.question}</h2>
                <p className="prose">{entry.answer}</p>
              </article>
            ))}
          </section>
        )}
      </PageContainer>
    </PublicShell>
  );
}
