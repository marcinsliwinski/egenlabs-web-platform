import { access, readFile } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';

import { PdfVisibility } from '@prisma/client';

import { getCurrentAdmin, requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { db } from '@/lib/db';

function resolveStoragePath(storagePath: string) {
  return isAbsolute(storagePath) ? storagePath : resolve(process.cwd(), storagePath);
}

async function fileExists(storagePath: string) {
  try {
    await access(resolveStoragePath(storagePath));
    return true;
  } catch {
    return false;
  }
}

export async function getPublicEnabledMarketingPdfs() {
  return db.marketingPdf.findMany({
    where: {
      isEnabled: true,
      visibility: PdfVisibility.PUBLIC
    },
    include: {
      product: true
    },
    orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
    take: 10
  });
}

export async function getMarketingPdfPageBySlug(slug: string) {
  const [pdf, admin] = await Promise.all([
    db.marketingPdf.findUnique({
      where: { slug },
      include: {
        product: true
      }
    }),
    getCurrentAdmin()
  ]);

  if (!pdf || !pdf.isEnabled) {
    return {
      found: false as const,
      canAccess: false as const,
      pdf: null,
      fileExists: false,
      admin: null
    };
  }

  const canAccess = pdf.visibility === PdfVisibility.PUBLIC || Boolean(admin);

  if (!canAccess) {
    return {
      found: true as const,
      canAccess: false as const,
      pdf,
      fileExists: false,
      admin
    };
  }

  return {
    found: true as const,
    canAccess: true as const,
    pdf,
    fileExists: await fileExists(pdf.storagePath),
    admin
  };
}

export async function resolveMarketingPdfDownloadBySlug(slug: string) {
  const [pdf, admin] = await Promise.all([
    db.marketingPdf.findUnique({
      where: { slug },
      include: {
        product: true
      }
    }),
    getCurrentAdmin()
  ]);

  if (!pdf || !pdf.isEnabled) {
    return {
      success: false as const,
      status: 'pdf_not_found' as const,
      httpStatus: 404,
      message: 'PDF one-pager is not available.'
    };
  }

  if (pdf.visibility === PdfVisibility.PRIVATE && !admin) {
    return {
      success: false as const,
      status: 'pdf_not_available' as const,
      httpStatus: 404,
      message: 'PDF one-pager is not available.'
    };
  }

  try {
    const body = await readFile(resolveStoragePath(pdf.storagePath));

    return {
      success: true as const,
      pdf,
      body,
      contentType: pdf.mimeType,
      fileName: pdf.fileName
    };
  } catch {
    return {
      success: false as const,
      status: 'pdf_file_missing' as const,
      httpStatus: 404,
      message: 'Configured PDF file is missing from storage.'
    };
  }
}

export async function getAdminPdfOverview() {
  const admin = await requireAuthenticatedAdmin();

  const [products, totalPdfCount, enabledPdfCount, publicPdfCount, privatePdfCount] = await Promise.all([
    db.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        marketingPdf: true
      }
    }),
    db.marketingPdf.count(),
    db.marketingPdf.count({ where: { isEnabled: true } }),
    db.marketingPdf.count({ where: { visibility: PdfVisibility.PUBLIC } }),
    db.marketingPdf.count({ where: { visibility: PdfVisibility.PRIVATE } })
  ]);

  return {
    admin,
    stats: {
      totalPdfCount,
      enabledPdfCount,
      publicPdfCount,
      privatePdfCount
    },
    products
  };
}
