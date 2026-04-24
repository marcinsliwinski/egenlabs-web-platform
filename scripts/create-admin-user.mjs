import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

import { PrismaClient } from '@prisma/client';

const scrypt = promisify(scryptCallback);
const PASSWORD_MIN_LENGTH = 12;

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

function getArgumentValue(flagName) {
  const entry = process.argv.find((argument) => argument.startsWith(`--${flagName}=`));

  return entry ? entry.slice(flagName.length + 3) : '';
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);

  return `scrypt$${salt}$${Buffer.from(derivedKey).toString('hex')}`;
}

async function main() {
  loadDotEnvFile();

  const email = getArgumentValue('email').trim().toLowerCase();
  const password = getArgumentValue('password');
  const role = getArgumentValue('role').toUpperCase() || 'ADMIN';

  if (!email) {
    throw new Error('Missing required argument: --email=<value>');
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`);
  }

  if (!['ADMIN', 'EDITOR'].includes(role)) {
    throw new Error('Role must be either ADMIN or EDITOR.');
  }

  const prisma = new PrismaClient();

  try {
    const passwordHash = await hashPassword(password);

    const adminUser = await prisma.adminUser.upsert({
      where: { email },
      update: {
        passwordHash,
        role,
        isActive: true,
        failedLoginAttempts: 0,
        lockedUntil: null
      },
      create: {
        email,
        passwordHash,
        role
      }
    });

    console.log(`Admin user ready: ${adminUser.email} (${adminUser.role})`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
