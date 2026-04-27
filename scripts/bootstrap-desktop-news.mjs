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
    title: 'Stable launch baseline is now available',
    summary: 'The accepted MVP baseline now includes stable release metadata for Fito Gen Essentials.',
    content: 'The desktop API can now expose stable release information for Fito Gen Essentials. This news item is intended for the in-app news feed shell and the accepted MVP baseline.',
    minVersion: null,
    maxVersion: null,
    isPinned: true,
    ctaLabel: 'Open downloads',
    ctaUrl: '/download/register'
  },
  {
    slug: 'download-policy-support-in-desktop-api',
    category: 'UPDATE',
    title: 'Desktop update checks now respect active builds',
    summary: 'The web platform can now expose the currently active build for the selected product, edition, and release channel.',
    content: 'Desktop clients can now query the update endpoint and compare their current version against the active build configured in the admin panel.',
    minVersion: '0.0.0',
    maxVersion: null,
    isPinned: false,
    ctaLabel: 'Read FAQ',
    ctaUrl: '/faq'
  },
  {
    slug: 'blog-and-faq-foundation-live',
    category: 'GENERAL',
    title: 'Blog and FAQ foundation are live',
    summary: 'Public blog and FAQ content are now available alongside the download registration and contact flows.',
    content: 'The accepted MVP public site now includes FAQ, blog, newsletter, contact, and enterprise-interest forms. Desktop users can read matching release notes through the dedicated news feed endpoint.',
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
