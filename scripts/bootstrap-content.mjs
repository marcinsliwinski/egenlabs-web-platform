import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { PrismaClient } from '@prisma/client';

function loadDotEnvFile() {
  const envFilePath = resolve(process.cwd(), '.env');

  if (!existsSync(envFilePath)) {
    return;
  }

  const content = readFileSync(envFilePath, 'utf8');

  for (const rawLine of content.split('\n')) {
    const line = rawLine.replace(/\r$/, '').trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const prisma = new PrismaClient();
const publishedAt = new Date('2026-04-27T09:00:00.000Z');

const faqEntries = [
  {
    slug: 'for-whom-is-fito-gen-essentials',
    question: 'Dla kogo przeznaczony jest Fito Gen Essentials?',
    answer: 'Pierwsza wersja produktu jest kierowana do szkółek roślin, które chcą uporządkować podstawowy workflow desktopowy bez ciężkich wdrożeń i bez złożonej infrastruktury.',
    sortOrder: 10
  },
  {
    slug: 'how-does-download-registration-work',
    question: 'Jak działa rejestracja przed pobraniem?',
    answer: 'Użytkownik przechodzi prosty formularz rejestracji, zapisuje wymagane zgody operacyjne i otrzymuje transakcyjny link pobrania zgodny z aktywną polityką wydawania linków.',
    sortOrder: 20
  },
  {
    slug: 'is-marketing-consent-required',
    question: 'Czy zgoda marketingowa jest obowiązkowa?',
    answer: 'Nie. Zgoda marketingowa jest oddzielona od obowiązkowej rejestracji pobrania i pozostaje opcjonalna, zgodnie z zaakceptowanym baseline projektu.',
    sortOrder: 30
  }
];

const blogPosts = [
  {
    slug: 'launching-egenlabs-web-platform-foundation',
    title: 'Profesjonalny start platformy eGen Labs',
    excerpt: 'Dlaczego strona startuje jako praktyczna wizytówka marki, zanim opublikujemy finalny program Fito Gen.',
    content: 'Pierwszy publiczny krok eGen Labs powinien budować zaufanie: jasny opis marki, prosty kontakt, polskie treści i brak obietnic funkcji, które nie są jeszcze gotowe.\n\nPlatforma pozostaje przygotowana pod dystrybucję aplikacji desktopowych, ale start wizualny może nastąpić wcześniej niż finalne udostępnienie programu.'
  },
  {
    slug: 'why-fito-gen-starts-with-essentials',
    title: 'Dlaczego Fito Gen startuje od edycji Essentials',
    excerpt: 'Pierwsza edycja ma pozostać wąska, praktyczna i łatwa do zweryfikowania z realnymi użytkownikami.',
    content: 'Fito Gen Essentials celowo zaczyna od ograniczonego zakresu. Taka strategia zmniejsza ryzyko, skraca czas do pierwszej walidacji i pozwala zebrać jakościowy feedback od szkółek roślin.\n\nDopiero po potwierdzeniu wartości produktu warto rozszerzać komunikację sprzedażową, materiały i docelowy flow pobrania.'
  },
  {
    slug: 'how-download-policies-shape-the-mvp',
    title: 'Jak polityki pobrania wspierają MVP',
    excerpt: 'Mechanizm pobrania jest gotowy technicznie, ale publiczne uruchomienie linku powinno poczekać na finalny program.',
    content: 'Polityki pobrania są ważną częścią platformy, ponieważ porządkują rejestrację, zgody, wydawanie linków i późniejsze wsparcie użytkownika.\n\nW publicznym starcie wizualnym nie trzeba jednak eksponować pobierania aplikacji, jeśli desktopowe MVP nie jest jeszcze gotowe do publikacji.'
  }
];

async function main() {
  loadDotEnvFile();

  for (const entry of faqEntries) {
    await prisma.faqEntry.upsert({
      where: { slug: entry.slug },
      update: {
        question: entry.question,
        answer: entry.answer,
        sortOrder: entry.sortOrder,
        status: 'PUBLISHED',
        publishedAt
      },
      create: {
        ...entry,
        status: 'PUBLISHED',
        publishedAt
      }
    });
  }

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        status: 'PUBLISHED',
        publishedAt
      },
      create: {
        ...post,
        status: 'PUBLISHED',
        publishedAt
      }
    });
  }

  console.log('Polish public content baseline ready: 3 FAQ entries and 3 blog posts.');
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
