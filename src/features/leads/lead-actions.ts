'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import {
  getActiveConsentDefinitions,
  getPublicDownloadRegistrationOverview
} from '@/features/leads/lead-service';
import { db } from '@/lib/db';

const DOWNLOAD_REGISTRATION_PATH = '/download/register';

const createDownloadRegistrationSchema = z.object({
  combinationId: z.string().min(1, 'combinationId is required'),
  email: z.string().trim().email().max(320),
  downloadRegistrationConsent: z.literal(true),
  marketingConsent: z.boolean().optional()
});

function getRedirectWithStatus(status: string, kind: 'success' | 'error'): never {
  redirect(`${DOWNLOAD_REGISTRATION_PATH}?${kind}=${status}`);
}

function extractClientIp(forwardedForHeader: string | null): string | undefined {
  if (!forwardedForHeader) {
    return undefined;
  }

  const [firstAddress] = forwardedForHeader.split(',');
  const normalizedAddress = firstAddress?.trim();

  return normalizedAddress ? normalizedAddress : undefined;
}

export async function registerDownloadRequestAction(formData: FormData) {
  const parsedInput = createDownloadRegistrationSchema.safeParse({
    combinationId: formData.get('combinationId'),
    email: formData.get('email'),
    downloadRegistrationConsent: formData.get('downloadRegistrationConsent') === 'on',
    marketingConsent: formData.get('marketingConsent') === 'on'
  });

  if (!parsedInput.success) {
    getRedirectWithStatus('invalid_registration_input', 'error');
  }

  const input = parsedInput.data;
  const [{ combinations }, consentDefinitions, headerStore] = await Promise.all([
    getPublicDownloadRegistrationOverview(),
    getActiveConsentDefinitions(),
    headers()
  ]);

  const combination = combinations.find((item) => item.id === input.combinationId);

  if (!combination) {
    getRedirectWithStatus('download_combination_unavailable', 'error');
  }

  if (!consentDefinitions.downloadRegistration) {
    getRedirectWithStatus('required_consent_missing', 'error');
  }

  if (!consentDefinitions.marketingEmail) {
    getRedirectWithStatus('marketing_consent_missing', 'error');
  }

  const ipAddress = extractClientIp(headerStore.get('x-forwarded-for'));
  const userAgent = headerStore.get('user-agent') ?? undefined;
  const normalizedEmail = input.email.trim().toLowerCase();

  await db.$transaction(async (transaction) => {
    const lead = await transaction.lead.upsert({
      where: { email: normalizedEmail },
      update: {
        lastSeenAt: new Date()
      },
      create: {
        email: normalizedEmail,
        lastSeenAt: new Date()
      }
    });

    const downloadRequest = await transaction.downloadRequest.create({
      data: {
        policyId: combination.policyId ?? undefined,
        productId: combination.productId,
        editionId: combination.editionId,
        channelId: combination.channelId,
        buildId: combination.buildId ?? undefined,
        email: normalizedEmail,
        leadId: lead.id,
        ipAddress,
        userAgent,
        notes: `Registered through public download shell for ${combination.productName} / ${combination.editionName} / ${combination.channelName}.`
      }
    });

    await transaction.consentRecord.createMany({
      data: [
        {
          leadId: lead.id,
          definitionId: consentDefinitions.downloadRegistration.id,
          downloadRequestId: downloadRequest.id,
          granted: true,
          source: 'PUBLIC_DOWNLOAD_REGISTRATION',
          ipAddress,
          userAgent
        },
        {
          leadId: lead.id,
          definitionId: consentDefinitions.marketingEmail.id,
          downloadRequestId: downloadRequest.id,
          granted: Boolean(input.marketingConsent),
          source: 'PUBLIC_DOWNLOAD_REGISTRATION',
          ipAddress,
          userAgent
        }
      ]
    });
  });

  revalidatePath('/admin');
  revalidatePath('/admin/downloads');
  revalidatePath('/admin/leads');
  getRedirectWithStatus('registration_saved', 'success');
}
