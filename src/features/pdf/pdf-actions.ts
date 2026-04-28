'use server';

import { stat } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';

import { PdfVisibility } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { db } from '@/lib/db';

const ADMIN_PDF_PATH = '/admin/pdfs';

const marketingPdfSchema = z.object({
  productId: z.string().min(1),
  title: z.string().trim().min(5).max(180),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/, 'slug must use lowercase letters, numbers, and hyphens'),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  visibility: z.nativeEnum(PdfVisibility),
  fileName: z.string().trim().min(5).max(255),
  storagePath: z.string().trim().min(5).max(500),
  mimeType: z.string().trim().min(1).max(120).default('application/pdf'),
  isEnabled: z.boolean().default(false)
});

function getRedirectWithStatus(status: string, kind: 'success' | 'error'): never {
  redirect(`${ADMIN_PDF_PATH}?${kind}=${status}`);
}

function resolveStoragePath(storagePath: string) {
  return isAbsolute(storagePath) ? storagePath : resolve(process.cwd(), storagePath);
}

async function resolveFileSizeBytes(storagePath: string) {
  try {
    const result = await stat(resolveStoragePath(storagePath));
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
  await requireAuthenticatedAdmin();

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

  await db.marketingPdf.upsert({
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
