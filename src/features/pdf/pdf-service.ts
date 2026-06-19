import { access, readFile } from 'node:fs/promises';

import { PdfVisibility } from '@prisma/client';

import { getCurrentAdmin, requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { db } from '@/lib/db';
import { resolveExistingStorageFile } from '@/lib/storage-path';

async function fileExists(storagePath: string) {
  const absolutePath = await resolveExistingStorageFile(storagePath);

  if (!absolutePath) {
    return false;
  }

  try {
    await access(absolutePath);
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
    const absolutePath = await resolveExistingStorageFile(pdf.storagePath);

    if (!absolutePath) {
      throw new Error('Configured PDF path is invalid or unavailable.');
    }

    const body = await readFile(absolutePath);

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
