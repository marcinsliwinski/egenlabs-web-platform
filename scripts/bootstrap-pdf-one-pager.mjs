import { existsSync, readFileSync, statSync } from 'node:fs';
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
const publishedAt = new Date('2026-04-28T09:30:00.000Z');

async function main() {
  loadDotEnvFile();

  const product = await prisma.product.findUnique({ where: { key: 'fito-gen' } });

  if (!product) {
    throw new Error('Product baseline missing. Run npm run catalog:bootstrap first.');
  }

  const relativeStoragePath = 'storage/media/fito-gen-one-pager.pdf';
  const absoluteStoragePath = resolve(process.cwd(), relativeStoragePath);
  const fileExists = existsSync(absoluteStoragePath);
  const fileSizeBytes = fileExists ? statSync(absoluteStoragePath).size : null;

  await prisma.marketingPdf.upsert({
    where: { productId: product.id },
    update: {
      title: 'Fito Gen Essentials — materiał informacyjny',
      slug: 'fito-gen-one-pager',
      description: 'Krótki materiał informacyjny dla Fito Gen Essentials i publicznej komunikacji eGen Labs.',
      visibility: 'PUBLIC',
      fileName: 'fito-gen-one-pager.pdf',
      storagePath: relativeStoragePath,
      mimeType: 'application/pdf',
      fileSizeBytes,
      isEnabled: true,
      publishedAt
    },
    create: {
      productId: product.id,
      title: 'Fito Gen Essentials — materiał informacyjny',
      slug: 'fito-gen-one-pager',
      description: 'Krótki materiał informacyjny dla Fito Gen Essentials i publicznej komunikacji eGen Labs.',
      visibility: 'PUBLIC',
      fileName: 'fito-gen-one-pager.pdf',
      storagePath: relativeStoragePath,
      mimeType: 'application/pdf',
      fileSizeBytes,
      isEnabled: true,
      publishedAt
    }
  });

  console.log(`PDF baseline ready: ${relativeStoragePath} (${fileExists ? 'file found' : 'file missing'})`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
