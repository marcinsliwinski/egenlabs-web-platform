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
    title: 'Launching the eGen Labs web platform foundation',
    excerpt: 'Why the project starts from a modular monolith, controlled download flow, and manual admin operations.',
    content: 'The launch foundation focuses on a modular monolith, explicit download policies, and a controlled admin workflow.\n\nThis gives the project a simple but extensible base for future products without forcing premature architectural complexity.'
  },
  {
    slug: 'why-fito-gen-starts-with-essentials',
    title: 'Why Fito Gen starts with Essentials',
    excerpt: 'The first product edition keeps the launch narrow, measurable, and easier to validate with real nursery businesses.',
    content: 'Fito Gen Essentials intentionally starts as a narrow launch edition.\n\nThis helps validate distribution, registration, delivery, and feedback workflows before any broader commercial packaging or Pro scope is added.'
  },
  {
    slug: 'how-download-policies-shape-the-mvp',
    title: 'How download policies shape the MVP',
    excerpt: 'Public, one-time, temporary, and private-static policies already influence the shape of the accepted MVP user flow.',
    content: 'Download policies are a central part of the platform baseline.\n\nThey affect registration, email issuance, delivery validation, and future operational controls. Building them early keeps the rest of the flow consistent.'
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

  console.log('Content baseline ready: 3 FAQ entries and 3 blog posts.');
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
