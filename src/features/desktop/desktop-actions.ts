'use server';

import { ContentStatus, NewsFeedCategory } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { logAdminAuditEvent } from '@/features/audit/audit-service';
import { db } from '@/lib/db';

const DESKTOP_ADMIN_PATH = '/admin/desktop';

const desktopNewsSchema = z.object({
  id: z.string().min(1).optional(),
  productId: z.string().min(1),
  editionId: z.string().min(1),
  channelId: z.string().min(1),
  category: z.nativeEnum(NewsFeedCategory),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/, 'slug must use lowercase letters, numbers, and hyphens'),
  title: z.string().trim().min(3).max(180),
  summary: z.string().trim().min(10).max(400),
  content: z.string().trim().min(20),
  minVersion: z.string().trim().max(120).optional().or(z.literal('')),
  maxVersion: z.string().trim().max(120).optional().or(z.literal('')),
  ctaLabel: z.string().trim().max(80).optional().or(z.literal('')),
  ctaUrl: z.string().trim().max(2048).optional().or(z.literal('')),
  isPinned: z.boolean().optional(),
  status: z.nativeEnum(ContentStatus)
});

function getRedirectWithStatus(status: string, kind: 'success' | 'error'): never {
  redirect(`${DESKTOP_ADMIN_PATH}?${kind}=${status}`);
}

function normalizeOptionalText(value: string | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function getPublishedAt(status: ContentStatus, currentValue: Date | null | undefined) {
  if (status === ContentStatus.PUBLISHED) {
    return currentValue ?? new Date();
  }

  return null;
}

function revalidateDesktopPaths() {
  revalidatePath('/admin');
  revalidatePath('/admin/desktop');
  revalidatePath('/products/fito-gen');
}

async function requireDesktopWriteAccess() {
  return requireAuthenticatedAdmin();
}

async function ensureDesktopCombinationExists(productId: string, editionId: string, channelId: string) {
  const [product, edition, channel] = await Promise.all([
    db.product.findUnique({ where: { id: productId } }),
    db.productEdition.findUnique({ where: { id: editionId } }),
    db.releaseChannel.findUnique({ where: { id: channelId } })
  ]);

  if (!product || !edition || !channel || edition.productId !== product.id) {
    getRedirectWithStatus('desktop_combination_invalid', 'error');
  }
}

export async function createDesktopNewsItemAction(formData: FormData) {
  const admin = await requireDesktopWriteAccess();

  const parsed = desktopNewsSchema.safeParse({
    productId: formData.get('productId'),
    editionId: formData.get('editionId'),
    channelId: formData.get('channelId'),
    category: formData.get('category'),
    slug: formData.get('slug'),
    title: formData.get('title'),
    summary: formData.get('summary'),
    content: formData.get('content'),
    minVersion: formData.get('minVersion'),
    maxVersion: formData.get('maxVersion'),
    ctaLabel: formData.get('ctaLabel'),
    ctaUrl: formData.get('ctaUrl'),
    isPinned: formData.get('isPinned') === 'on',
    status: formData.get('status')
  });

  if (!parsed.success) {
    getRedirectWithStatus('invalid_news_input', 'error');
  }

  await ensureDesktopCombinationExists(parsed.data.productId, parsed.data.editionId, parsed.data.channelId);

  const existing = await db.newsFeedItem.findUnique({ where: { slug: parsed.data.slug } });

  if (existing) {
    getRedirectWithStatus('news_slug_exists', 'error');
  }

  const newsItem = await db.newsFeedItem.create({
    data: {
      productId: parsed.data.productId,
      editionId: parsed.data.editionId,
      channelId: parsed.data.channelId,
      category: parsed.data.category,
      slug: parsed.data.slug,
      title: parsed.data.title,
      summary: parsed.data.summary,
      content: parsed.data.content,
      minVersion: normalizeOptionalText(parsed.data.minVersion || undefined),
      maxVersion: normalizeOptionalText(parsed.data.maxVersion || undefined),
      ctaLabel: normalizeOptionalText(parsed.data.ctaLabel || undefined),
      ctaUrl: normalizeOptionalText(parsed.data.ctaUrl || undefined),
      isPinned: Boolean(parsed.data.isPinned),
      status: parsed.data.status,
      publishedAt: getPublishedAt(parsed.data.status, null)
    }
  });

  await logAdminAuditEvent({
    admin,
    actionType: "DESKTOP_NEWS_CREATED",
    entityType: "NewsFeedItem",
    entityId: newsItem.id,
    summary: `Created desktop news item ${newsItem.slug}.`,
    metadata: { category: newsItem.category, status: newsItem.status }
  });

  revalidateDesktopPaths();
  getRedirectWithStatus('news_created', 'success');
}

export async function updateDesktopNewsItemAction(formData: FormData) {
  const admin = await requireDesktopWriteAccess();

  const parsed = desktopNewsSchema.extend({
    id: z.string().min(1)
  }).safeParse({
    id: formData.get('id'),
    productId: formData.get('productId'),
    editionId: formData.get('editionId'),
    channelId: formData.get('channelId'),
    category: formData.get('category'),
    slug: formData.get('slug'),
    title: formData.get('title'),
    summary: formData.get('summary'),
    content: formData.get('content'),
    minVersion: formData.get('minVersion'),
    maxVersion: formData.get('maxVersion'),
    ctaLabel: formData.get('ctaLabel'),
    ctaUrl: formData.get('ctaUrl'),
    isPinned: formData.get('isPinned') === 'on',
    status: formData.get('status')
  });

  if (!parsed.success) {
    getRedirectWithStatus('invalid_news_input', 'error');
  }

  await ensureDesktopCombinationExists(parsed.data.productId, parsed.data.editionId, parsed.data.channelId);

  const existing = await db.newsFeedItem.findUnique({ where: { id: parsed.data.id } });

  if (!existing) {
    getRedirectWithStatus('news_not_found', 'error');
  }

  const slugConflict = await db.newsFeedItem.findUnique({ where: { slug: parsed.data.slug } });

  if (slugConflict && slugConflict.id !== parsed.data.id) {
    getRedirectWithStatus('news_slug_exists', 'error');
  }

  const updatedNewsItem = await db.newsFeedItem.update({
    where: { id: parsed.data.id },
    data: {
      productId: parsed.data.productId,
      editionId: parsed.data.editionId,
      channelId: parsed.data.channelId,
      category: parsed.data.category,
      slug: parsed.data.slug,
      title: parsed.data.title,
      summary: parsed.data.summary,
      content: parsed.data.content,
      minVersion: normalizeOptionalText(parsed.data.minVersion || undefined),
      maxVersion: normalizeOptionalText(parsed.data.maxVersion || undefined),
      ctaLabel: normalizeOptionalText(parsed.data.ctaLabel || undefined),
      ctaUrl: normalizeOptionalText(parsed.data.ctaUrl || undefined),
      isPinned: Boolean(parsed.data.isPinned),
      status: parsed.data.status,
      publishedAt: getPublishedAt(parsed.data.status, existing.publishedAt)
    }
  });

  await logAdminAuditEvent({
    admin,
    actionType: "DESKTOP_NEWS_UPDATED",
    entityType: "NewsFeedItem",
    entityId: updatedNewsItem.id,
    summary: `Updated desktop news item ${updatedNewsItem.slug}.`,
    metadata: { previousSlug: existing.slug, category: updatedNewsItem.category, status: updatedNewsItem.status }
  });

  revalidateDesktopPaths();
  getRedirectWithStatus('news_updated', 'success');
}
