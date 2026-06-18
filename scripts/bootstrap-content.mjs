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
    answer: 'Fito Gen Essentials jest przeznaczony dla polskich szkółek roślin, które potrzebują prostej aplikacji desktopowej wspierającej lokalną pracę, dokumentację i korzystanie z aktualnych danych referencyjnych.',
    sortOrder: 10
  },
  {
    slug: 'how-does-download-registration-work',
    question: 'Czy Fito Gen wymaga stałego połączenia z internetem?',
    answer: 'Nie. Aplikacja jest projektowana w modelu offline-first. Podstawowa praca i dane operacyjne pozostają lokalnie, a internet służy do pobierania aktualizacji, komunikatów i wersjonowanych paczek danych wspierających.',
    sortOrder: 20
  },
  {
    slug: 'is-marketing-consent-required',
    question: 'Czy zgoda marketingowa jest obowiązkowa?',
    answer: 'Nie. Zgoda marketingowa jest oddzielona od obsługi rejestracji i pozostaje opcjonalna.',
    sortOrder: 30
  }
];

const blogPosts = [
  {
    slug: 'launching-egenlabs-web-platform-foundation',
    title: 'Fito Gen Essentials dla codziennej pracy szkółki',
    excerpt: 'Aplikacja desktopowa offline-first łączy prostotę obsługi z lokalnym przechowywaniem danych i uporządkowanym wsparciem aktualizacyjnym.',
    content: 'Fito Gen Essentials jest rozwijany z myślą o praktycznej pracy polskich szkółek roślin. Aplikacja pozostaje lokalnym narzędziem użytkownika i nie wymaga przenoszenia codziennych danych operacyjnych do chmury.\n\nPlatforma egenlabs.eu dostarcza aktualizacje, komunikaty i wersjonowane dane referencyjne, zachowując wyraźny podział odpowiedzialności między aplikacją desktopową a zapleczem internetowym.'
  },
  {
    slug: 'why-fito-gen-starts-with-essentials',
    title: 'Dlaczego Fito Gen pozostaje offline-first',
    excerpt: 'Lokalna praca zwiększa niezależność użytkownika i ogranicza wpływ dostępności internetu na codzienne procesy.',
    content: 'Model offline-first pozwala korzystać z podstawowych funkcji aplikacji niezależnie od jakości połączenia internetowego. Dane operacyjne pozostają po stronie użytkownika, a komunikacja z egenlabs.eu dotyczy jedynie funkcji wsparcia produktu.\n\nTakie podejście upraszcza wdrożenie i pozwala zachować kontrolę nad lokalnymi procesami szkółki.'
  },
  {
    slug: 'how-download-policies-shape-the-mvp',
    title: 'Aktualizacje i dane referencyjne w Fito Gen',
    excerpt: 'Platforma eGen Labs dostarcza aplikacji aktualizacje, komunikaty oraz wersjonowane paczki danych wspierających.',
    content: 'Fito Gen może sprawdzać dostępność aktualizacji, pobierać wiadomości produktowe oraz importować wersjonowane paczki danych referencyjnych. Mechanizmy te wspierają produkt, ale nie przejmują lokalnych danych użytkownika.\n\nDzięki temu aplikacja pozostaje niezależna operacyjnie, a jednocześnie może korzystać z aktualnych informacji publikowanych przez eGen Labs.'
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
