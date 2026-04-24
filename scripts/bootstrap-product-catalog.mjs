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

async function main() {
  loadDotEnvFile();

  const product = await prisma.product.upsert({
    where: { key: 'fito-gen' },
    update: {
      name: 'Fito Gen',
      slug: 'fito-gen',
      isActive: true
    },
    create: {
      key: 'fito-gen',
      name: 'Fito Gen',
      slug: 'fito-gen'
    }
  });

  await prisma.productEdition.upsert({
    where: {
      productId_key: {
        productId: product.id,
        key: 'essentials'
      }
    },
    update: {
      name: 'Essentials',
      isActive: true
    },
    create: {
      productId: product.id,
      key: 'essentials',
      name: 'Essentials'
    }
  });

  for (const channel of [
    { key: 'stable', name: 'Stable' },
    { key: 'beta', name: 'Beta' }
  ]) {
    await prisma.releaseChannel.upsert({
      where: { key: channel.key },
      update: {
        name: channel.name,
        isActive: true
      },
      create: channel
    });
  }

  console.log('Product catalog baseline ready: Fito Gen / Essentials / stable / beta');
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
