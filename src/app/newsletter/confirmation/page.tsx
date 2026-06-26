import Link from 'next/link';

import { PageContainer, PublicShell, SectionHeader } from '@/components/public-site';

const messages: Record<string, { title: string; body: string }> = {
  confirmed: {
    title: 'Zapis został potwierdzony',
    body: 'Twój adres został aktywowany w newsletterze eGen Labs.'
  },
  already_confirmed: {
    title: 'Zapis był już potwierdzony',
    body: 'Ten adres jest już aktywny w newsletterze eGen Labs.'
  },
  expired: {
    title: 'Link wygasł',
    body: 'Wyślij formularz newslettera ponownie, aby otrzymać nowy link potwierdzający.'
  },
  consent_definition_missing: {
    title: 'Potwierdzenie jest chwilowo niedostępne',
    body: 'Aktywna definicja zgody marketingowej nie jest dostępna.'
  },
  invalid: {
    title: 'Nieprawidłowy link',
    body: 'Link potwierdzający jest nieprawidłowy lub nie jest już dostępny.'
  }
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function NewsletterConfirmationPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolved = searchParams ? await searchParams : undefined;
  const rawStatus = resolved?.status;
  const status = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus;
  const message = messages[status ?? 'invalid'] ?? messages.invalid;

  return (
    <PublicShell>
      <PageContainer>
        <section className="form-card">
          <SectionHeader eyebrow="Newsletter" title={message.title}>
            <p>{message.body}</p>
          </SectionHeader>
          <div className="cta-row">
            <Link className="button" href="/newsletter">Przejdź do newslettera</Link>
            <Link className="text-link" href="/">Wróć na stronę główną</Link>
          </div>
        </section>
      </PageContainer>
    </PublicShell>
  );
}
