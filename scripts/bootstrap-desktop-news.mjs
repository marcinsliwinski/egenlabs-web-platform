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
const publishedAt = new Date('2026-04-27T12:00:00.000Z');

const newsItems = [
  {
    slug: 'fito-gen-stable-launch-baseline',
    category: 'RELEASE',
    title: 'Fito Gen Essentials — informacje o wydaniu',
    summary: 'Aplikacja może pobierać informacje o aktualnym wydaniu stabilnym Fito Gen Essentials.',
    content: 'Fito Gen Essentials korzysta z platformy eGen Labs do sprawdzania informacji o aktualnym wydaniu stabilnym i komunikatów produktowych.',
    minVersion: null,
    maxVersion: null,
    isPinned: true,
    ctaLabel: 'Open downloads',
    ctaUrl: '/download/register'
  },
  {
    slug: 'download-policy-support-in-desktop-api',
    category: 'UPDATE',
    title: 'Aktualizacje są powiązane z aktywnym wydaniem',
    summary: 'Sprawdzanie aktualizacji uwzględnia produkt, edycję i kanał wydania.',
    content: 'Aplikacja porównuje swoją wersję z aktywnym wydaniem skonfigurowanym dla produktu, edycji i kanału.',
    minVersion: '0.0.0',
    maxVersion: null,
    isPinned: false,
    ctaLabel: 'Read FAQ',
    ctaUrl: '/faq'
  },
  {
    slug: 'blog-and-faq-foundation-live',
    category: 'GENERAL',
    title: 'Materiały i odpowiedzi są dostępne online',
    summary: 'Na stronie eGen Labs dostępne są materiały produktowe, FAQ i kontakt.',
    content: 'Użytkownicy mogą korzystać z FAQ, materiałów produktowych i aktualności publikowanych przez eGen Labs. Wybrane komunikaty są dostępne również bezpośrednio w aplikacji.',
    minVersion: null,
    maxVersion: null,
    isPinned: false,
    ctaLabel: 'Open blog',
    ctaUrl: '/blog'
  }
];

async function main() {
  loadDotEnvFile();

  const product = await prisma.product.findUnique({ where: { key: 'fito-gen' } });

  if (!product) {
    throw new Error('Product baseline missing. Run npm run catalog:bootstrap first.');
  }

  const edition = await prisma.productEdition.findFirst({
    where: {
      productId: product.id,
      key: 'essentials'
    }
  });

  if (!edition) {
    throw new Error('Product edition baseline missing. Run npm run catalog:bootstrap first.');
  }

  const channel = await prisma.releaseChannel.findUnique({ where: { key: 'stable' } });

  if (!channel) {
    throw new Error('Release channel baseline missing. Run npm run catalog:bootstrap first.');
  }

  for (const item of newsItems) {
    await prisma.newsFeedItem.upsert({
      where: { slug: item.slug },
      update: {
        productId: product.id,
        editionId: edition.id,
        channelId: channel.id,
        category: item.category,
        title: item.title,
        summary: item.summary,
        content: item.content,
        minVersion: item.minVersion,
        maxVersion: item.maxVersion,
        ctaLabel: item.ctaLabel,
        ctaUrl: item.ctaUrl,
        isPinned: item.isPinned,
        status: 'PUBLISHED',
        publishedAt
      },
      create: {
        productId: product.id,
        editionId: edition.id,
        channelId: channel.id,
        slug: item.slug,
        category: item.category,
        title: item.title,
        summary: item.summary,
        content: item.content,
        minVersion: item.minVersion,
        maxVersion: item.maxVersion,
        ctaLabel: item.ctaLabel,
        ctaUrl: item.ctaUrl,
        isPinned: item.isPinned,
        status: 'PUBLISHED',
        publishedAt
      }
    });
  }

  console.log('Desktop news baseline ready: 3 published news feed items.');
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
