'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { db } from '@/lib/db';

const CATALOG_PATH = '/admin/catalog';

const createBuildSchema = z
  .object({
    productId: z.string().min(1, 'productId is required'),
    editionId: z.string().min(1, 'editionId is required'),
    channelId: z.string().min(1, 'channelId is required'),
    version: z.string().trim().min(1, 'version is required'),
    buildNumber: z.coerce.number().int().positive('buildNumber must be a positive integer'),
    minSupportedVersion: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    fileName: z.string().trim().optional(),
    storagePath: z.string().trim().optional(),
    fileSizeBytes: z.union([z.literal(''), z.coerce.number().int().positive()]).optional(),
    checksumSha256: z.string().trim().optional(),
    mimeType: z.string().trim().optional(),
    activateNow: z.boolean().optional()
  })
  .superRefine((value, context) => {
    const hasFileName = Boolean(value.fileName);
    const hasStoragePath = Boolean(value.storagePath);

    if (hasFileName !== hasStoragePath) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'asset metadata requires both fileName and storagePath',
        path: ['storagePath']
      });
    }
  });

const activateBuildSchema = z.object({
  buildId: z.string().min(1, 'buildId is required')
});

function toOptionalString(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : undefined;
}

function getRedirectWithStatus(status: string, kind: 'success' | 'error'): never {
  redirect(`${CATALOG_PATH}?${kind}=${status}`);
}

async function requireAdminWriteAccess() {
  const admin = await requireAuthenticatedAdmin();

  if (admin.role !== 'ADMIN') {
    getRedirectWithStatus('forbidden', 'error');
  }

  return admin;
}

export async function createBuildAction(formData: FormData) {
  await requireAdminWriteAccess();

  const parsedInput = createBuildSchema.safeParse({
    productId: formData.get('productId'),
    editionId: formData.get('editionId'),
    channelId: formData.get('channelId'),
    version: formData.get('version'),
    buildNumber: formData.get('buildNumber'),
    minSupportedVersion: toOptionalString(formData.get('minSupportedVersion')),
    notes: toOptionalString(formData.get('notes')),
    fileName: toOptionalString(formData.get('fileName')),
    storagePath: toOptionalString(formData.get('storagePath')),
    fileSizeBytes: formData.get('fileSizeBytes'),
    checksumSha256: toOptionalString(formData.get('checksumSha256')),
    mimeType: toOptionalString(formData.get('mimeType')),
    activateNow: formData.get('activateNow') === 'on'
  });

  if (!parsedInput.success) {
    getRedirectWithStatus('invalid_build_input', 'error');
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

  const existingBuild = await db.build.findUnique({
    where: {
      productId_editionId_channelId_buildNumber: {
        productId: input.productId,
        editionId: input.editionId,
        channelId: input.channelId,
        buildNumber: input.buildNumber
      }
    }
  });

  if (existingBuild) {
    getRedirectWithStatus('build_number_exists', 'error');
  }

  await db.$transaction(async (transaction) => {
    if (input.activateNow) {
      await transaction.build.updateMany({
        where: {
          productId: input.productId,
          editionId: input.editionId,
          channelId: input.channelId,
          isActive: true
        },
        data: {
          isActive: false
        }
      });
    }

    const build = await transaction.build.create({
      data: {
        productId: input.productId,
        editionId: input.editionId,
        channelId: input.channelId,
        version: input.version,
        buildNumber: input.buildNumber,
        minSupportedVersion: input.minSupportedVersion,
        notes: input.notes,
        isActive: input.activateNow,
        publishedAt: input.activateNow ? new Date() : null
      }
    });

    if (input.fileName && input.storagePath) {
      await transaction.buildAsset.create({
        data: {
          buildId: build.id,
          fileName: input.fileName,
          storagePath: input.storagePath,
          fileSizeBytes:
            typeof input.fileSizeBytes === 'number' ? input.fileSizeBytes : undefined,
          checksumSha256: input.checksumSha256,
          mimeType: input.mimeType
        }
      });
    }
  });

  revalidatePath(CATALOG_PATH);
  revalidatePath('/admin');
  getRedirectWithStatus(input.activateNow ? 'build_created_and_activated' : 'build_created', 'success');
}

export async function activateBuildAction(formData: FormData) {
  await requireAdminWriteAccess();

  const parsedInput = activateBuildSchema.safeParse({
    buildId: formData.get('buildId')
  });

  if (!parsedInput.success) {
    getRedirectWithStatus('invalid_build_activation', 'error');
  }

  const build = await db.build.findUnique({
    where: { id: parsedInput.data.buildId },
    select: {
      id: true,
      productId: true,
      editionId: true,
      channelId: true,
      isActive: true,
      publishedAt: true
    }
  });

  if (!build) {
    getRedirectWithStatus('build_not_found', 'error');
  }

  if (build.isActive) {
    getRedirectWithStatus('build_already_active', 'success');
  }

  await db.$transaction(async (transaction) => {
    await transaction.build.updateMany({
      where: {
        productId: build.productId,
        editionId: build.editionId,
        channelId: build.channelId,
        isActive: true
      },
      data: {
        isActive: false
      }
    });

    await transaction.build.update({
      where: { id: build.id },
      data: {
        isActive: true,
        publishedAt: build.publishedAt ?? new Date()
      }
    });
  });

  revalidatePath(CATALOG_PATH);
  revalidatePath('/admin');
  getRedirectWithStatus('build_activated', 'success');
}
