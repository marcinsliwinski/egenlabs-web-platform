'use server';

import { stat } from 'node:fs/promises';

import { PdfVisibility } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { logAdminAuditEvent } from '@/features/audit/audit-service';
import { db } from '@/lib/db';
import { isValidStoragePath, resolveExistingStorageFile } from '@/lib/storage-path';

const ADMIN_PDF_PATH = '/admin/pdfs';

const marketingPdfSchema = z.object({
  productId: z.string().min(1),
  title: z.string().trim().min(5).max(180),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/, 'slug must use lowercase letters, numbers, and hyphens'),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  visibility: z.nativeEnum(PdfVisibility),
  fileName: z.string().trim().min(5).max(255),
  storagePath: z
    .string()
    .trim()
    .min(5)
    .max(500)
    .refine(isValidStoragePath, 'storagePath must point inside storage/'),
  mimeType: z.string().trim().min(1).max(120).default('application/pdf'),
  isEnabled: z.boolean().default(false)
});

function getRedirectWithStatus(status: string, kind: 'success' | 'error'): never {
  redirect(`${ADMIN_PDF_PATH}?${kind}=${status}`);
}

async function resolveFileSizeBytes(storagePath: string) {
  const absolutePath = await resolveExistingStorageFile(storagePath);

  if (!absolutePath) {
    return null;
  }

  try {
    const result = await stat(absolutePath);
    return result.isFile() ? Number(result.size) : null;
  } catch {
    return null;
  }
}

function getPublishedAt(isEnabled: boolean, currentValue: Date | null | undefined) {
  if (isEnabled) {
    return currentValue ?? new Date();
  }

  return null;
}

export async function upsertMarketingPdfAction(formData: FormData) {
  const admin = await requireAuthenticatedAdmin();

  const parsed = marketingPdfSchema.safeParse({
    productId: formData.get('productId'),
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description') ?? '',
    visibility: formData.get('visibility'),
    fileName: formData.get('fileName'),
    storagePath: formData.get('storagePath'),
    mimeType: formData.get('mimeType') ?? 'application/pdf',
    isEnabled: formData.get('isEnabled') === 'on'
  });

  if (!parsed.success) {
    getRedirectWithStatus('invalid_pdf_input', 'error');
  }

  const input = parsed.data;
  const product = await db.product.findUnique({ where: { id: input.productId } });

  if (!product) {
    getRedirectWithStatus('pdf_product_not_found', 'error');
  }

  const existing = await db.marketingPdf.findUnique({ where: { productId: input.productId } });
  const slugConflict = await db.marketingPdf.findUnique({ where: { slug: input.slug } });

  if (slugConflict && slugConflict.productId !== input.productId) {
    getRedirectWithStatus('pdf_slug_exists', 'error');
  }

  const fileSizeBytes = await resolveFileSizeBytes(input.storagePath);

  const marketingPdf = await db.marketingPdf.upsert({
    where: { productId: input.productId },
    update: {
      title: input.title,
      slug: input.slug,
      description: input.description || null,
      visibility: input.visibility,
      fileName: input.fileName,
      storagePath: input.storagePath,
      mimeType: input.mimeType,
      fileSizeBytes,
      isEnabled: input.isEnabled,
      publishedAt: getPublishedAt(input.isEnabled, existing?.publishedAt)
    },
    create: {
      productId: input.productId,
      title: input.title,
      slug: input.slug,
      description: input.description || null,
      visibility: input.visibility,
      fileName: input.fileName,
      storagePath: input.storagePath,
      mimeType: input.mimeType,
      fileSizeBytes,
      isEnabled: input.isEnabled,
      publishedAt: getPublishedAt(input.isEnabled, null)
    }
  });

  await logAdminAuditEvent({
    admin,
    actionType: existing ? "PDF_UPDATED" : "PDF_CREATED",
    entityType: "MarketingPdf",
    entityId: marketingPdf.id,
    summary: `${existing ? 'Updated' : 'Created'} marketing PDF ${marketingPdf.slug}.`,
    metadata: { visibility: marketingPdf.visibility, isEnabled: marketingPdf.isEnabled, productId: input.productId }
  });

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath(ADMIN_PDF_PATH);
  revalidatePath(`/products/${product.slug}`);
  revalidatePath(`/one-pager/${input.slug}`);

  if (existing?.slug && existing.slug !== input.slug) {
    revalidatePath(`/one-pager/${existing.slug}`);
  }

  getRedirectWithStatus(existing ? 'pdf_updated' : 'pdf_created', 'success');
}
