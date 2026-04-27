'use server';

import { DownloadPolicyMode } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { db } from '@/lib/db';

const DOWNLOADS_PATH = '/admin/downloads';

const updateDownloadPolicySchema = z.object({
  productId: z.string().min(1, 'productId is required'),
  editionId: z.string().min(1, 'editionId is required'),
  channelId: z.string().min(1, 'channelId is required'),
  mode: z.nativeEnum(DownloadPolicyMode),
  isEnabled: z.boolean().optional(),
  requireActiveBuild: z.boolean().optional(),
  requireEmailRegistration: z.boolean().optional(),
  linkTtlMinutes: z.union([z.literal(''), z.coerce.number().int().positive()]).optional(),
  internalNotes: z.string().trim().max(1000).optional()
});

function toOptionalString(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : undefined;
}

function getRedirectWithStatus(status: string, kind: 'success' | 'error'): never {
  redirect(`${DOWNLOADS_PATH}?${kind}=${status}`);
}

async function requireAdminWriteAccess() {
  const admin = await requireAuthenticatedAdmin();

  if (admin.role !== 'ADMIN') {
    getRedirectWithStatus('forbidden', 'error');
  }

  return admin;
}

export async function saveDownloadPolicyAction(formData: FormData) {
  await requireAdminWriteAccess();

  const parsedInput = updateDownloadPolicySchema.safeParse({
    productId: formData.get('productId'),
    editionId: formData.get('editionId'),
    channelId: formData.get('channelId'),
    mode: formData.get('mode'),
    isEnabled: formData.get('isEnabled') === 'on',
    requireActiveBuild: formData.get('requireActiveBuild') === 'on',
    requireEmailRegistration: formData.get('requireEmailRegistration') === 'on',
    linkTtlMinutes: formData.get('linkTtlMinutes'),
    internalNotes: toOptionalString(formData.get('internalNotes'))
  });

  if (!parsedInput.success) {
    getRedirectWithStatus('invalid_policy_input', 'error');
  }

  const input = parsedInput.data;

  const [product, edition, channel] = await Promise.all([
    db.product.findUnique({ where: { id: input.productId } }),
    db.productEdition.findUnique({ where: { id: input.editionId } }),
    db.releaseChannel.findUnique({ where: { id: input.channelId } })
  ]);

  if (!product || !product.isActive) {
    getRedirectWithStatus('product_not_found', 'error');
  }

  if (!edition || !edition.isActive || edition.productId !== input.productId) {
    getRedirectWithStatus('edition_not_found', 'error');
  }

  if (!channel || !channel.isActive) {
    getRedirectWithStatus('channel_not_found', 'error');
  }

  if (input.mode === DownloadPolicyMode.TEMPORARY && typeof input.linkTtlMinutes !== 'number') {
    getRedirectWithStatus('ttl_required', 'error');
  }

  await db.downloadPolicy.upsert({
    where: {
      productId_editionId_channelId: {
        productId: input.productId,
        editionId: input.editionId,
        channelId: input.channelId
      }
    },
    update: {
      mode: input.mode,
      isEnabled: Boolean(input.isEnabled),
      requireActiveBuild: Boolean(input.requireActiveBuild),
      requireEmailRegistration: Boolean(input.requireEmailRegistration),
      linkTtlMinutes: input.mode === DownloadPolicyMode.TEMPORARY && typeof input.linkTtlMinutes === 'number'
        ? input.linkTtlMinutes
        : null,
      internalNotes: input.internalNotes
    },
    create: {
      productId: input.productId,
      editionId: input.editionId,
      channelId: input.channelId,
      mode: input.mode,
      isEnabled: Boolean(input.isEnabled),
      requireActiveBuild: Boolean(input.requireActiveBuild),
      requireEmailRegistration: Boolean(input.requireEmailRegistration),
      linkTtlMinutes: input.mode === DownloadPolicyMode.TEMPORARY && typeof input.linkTtlMinutes === 'number'
        ? input.linkTtlMinutes
        : null,
      internalNotes: input.internalNotes
    }
  });

  revalidatePath(DOWNLOADS_PATH);
  revalidatePath('/admin');
  getRedirectWithStatus('policy_saved', 'success');
}
