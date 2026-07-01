'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { issueTransactionalDownloadForRequest } from '@/features/email/email-service';
import { verifyPublicFormTurnstile } from '@/features/turnstile/turnstile-service';
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
  const headerStore = await headers();
  const turnstileResult = await verifyPublicFormTurnstile({
    formData,
    headerStore,
    expectedAction: 'download_registration'
  });

  if (!turnstileResult.success) {
    getRedirectWithStatus('turnstile_verification_failed', 'error');
  }

  const [{ combinations }, consentDefinitions] = await Promise.all([
    getPublicDownloadRegistrationOverview(),
    getActiveConsentDefinitions()
  ]);

  const combination = combinations.find((item) => item.id === input.combinationId);

  if (!combination) {
    getRedirectWithStatus('download_combination_unavailable', 'error');
  }

  const downloadRegistrationDefinition = consentDefinitions.downloadRegistration;
  const marketingEmailDefinition = consentDefinitions.marketingEmail;

  if (!downloadRegistrationDefinition) {
    getRedirectWithStatus('required_consent_missing', 'error');
  }

  if (!marketingEmailDefinition) {
    getRedirectWithStatus('marketing_consent_missing', 'error');
  }

  const ipAddress = extractClientIp(headerStore.get('x-forwarded-for'));
  const userAgent = headerStore.get('user-agent') ?? undefined;
  const normalizedEmail = input.email.trim().toLowerCase();

  const downloadRequestId = await db.$transaction(async (transaction) => {
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
          definitionId: downloadRegistrationDefinition.id,
          downloadRequestId: downloadRequest.id,
          granted: true,
          source: 'PUBLIC_DOWNLOAD_REGISTRATION',
          ipAddress,
          userAgent
        },
        {
          leadId: lead.id,
          definitionId: marketingEmailDefinition.id,
          downloadRequestId: downloadRequest.id,
          granted: Boolean(input.marketingConsent),
          source: 'PUBLIC_DOWNLOAD_REGISTRATION',
          ipAddress,
          userAgent
        }
      ]
    });

    return downloadRequest.id;
  });

  const issuanceResult = await issueTransactionalDownloadForRequest(downloadRequestId);

  revalidatePath('/admin');
  revalidatePath('/admin/downloads');
  revalidatePath('/admin/leads');
  revalidatePath('/admin/emails');

  if (!issuanceResult.success) {
    getRedirectWithStatus('download_issue_failed', 'error');
  }

  getRedirectWithStatus('registration_saved', 'success');
}
