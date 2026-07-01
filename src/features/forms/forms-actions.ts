'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { db } from '@/lib/db';
import { getActiveConsentDefinitions } from '@/features/leads/lead-service';
import { registerNewsletterSignup } from '@/features/forms/newsletter-service';
import { verifyPublicFormTurnstile } from '@/features/turnstile/turnstile-service';

const NEWSLETTER_PATH = '/newsletter';
const CONTACT_PATH = '/contact';
const ENTERPRISE_PATH = '/enterprise';

const newsletterSignupSchema = z.object({
  email: z.string().trim().email().max(320),
  marketingConsent: z.literal(true),
  returnPath: z.enum(['/', '/contact', '/newsletter']).default('/newsletter')
});

const contactInquirySchema = z.object({
  email: z.string().trim().email().max(320),
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  topic: z.enum(['GENERAL', 'PRODUCT', 'SUPPORT', 'PARTNERSHIP']),
  message: z.string().trim().min(10).max(4000),
  marketingConsent: z.boolean().optional()
});

const enterpriseInterestSchema = z.object({
  email: z.string().trim().email().max(320),
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  role: z.string().trim().max(120).optional().or(z.literal('')),
  teamSize: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().min(20).max(4000),
  marketingConsent: z.boolean().optional()
});

function redirectWithStatus(path: string, status: string, kind: 'success' | 'error'): never {
  redirect(`${path}?${kind}=${status}`);
}

function redirectNewsletterWithStatus(path: string, status: string, kind: 'success' | 'error'): never {
  const parameter = kind === 'success' ? 'newsletterSuccess' : 'newsletterError';
  redirect(`${path}?${parameter}=${status}#newsletter`);
}

function extractClientIp(forwardedForHeader: string | null): string | undefined {
  if (!forwardedForHeader) {
    return undefined;
  }

  const [firstAddress] = forwardedForHeader.split(',');
  const normalizedAddress = firstAddress?.trim();

  return normalizedAddress ? normalizedAddress : undefined;
}

function normalizeOptionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function revalidatePublicFormPaths() {
  revalidatePath('/');
  revalidatePath('/products/fito-gen');
  revalidatePath('/newsletter');
  revalidatePath('/contact');
  revalidatePath('/enterprise');
  revalidatePath('/admin');
  revalidatePath('/admin/forms');
  revalidatePath('/admin/leads');
}

async function getMarketingConsentDefinition() {
  const consentDefinitions = await getActiveConsentDefinitions();
  return consentDefinitions.marketingEmail;
}

export async function createNewsletterSignupAction(formData: FormData) {
  const parsedInput = newsletterSignupSchema.safeParse({
    email: formData.get('email'),
    marketingConsent: formData.get('marketingConsent') === 'on',
    returnPath: formData.get('returnPath') || NEWSLETTER_PATH
  });

  if (!parsedInput.success) {
    redirectNewsletterWithStatus(NEWSLETTER_PATH, 'invalid_newsletter_input', 'error');
  }

  const headerStore = await headers();
  const turnstileResult = await verifyPublicFormTurnstile({
    formData,
    headerStore,
    expectedAction: 'newsletter_signup'
  });

  if (!turnstileResult.success) {
    redirectNewsletterWithStatus(parsedInput.data.returnPath, 'turnstile_verification_failed', 'error');
  }

  const result = await registerNewsletterSignup({
    email: normalizeEmail(parsedInput.data.email),
    ipAddress: extractClientIp(headerStore.get('x-forwarded-for')),
    userAgent: headerStore.get('user-agent') ?? undefined
  });

  if (!result.success) {
    redirectNewsletterWithStatus(parsedInput.data.returnPath, result.reason, 'error');
  }

  revalidatePublicFormPaths();

  switch (result.status) {
    case 'pending':
      redirectNewsletterWithStatus(parsedInput.data.returnPath, 'newsletter_confirmation_sent', 'success');
    case 'pending_email_failed':
      redirectNewsletterWithStatus(parsedInput.data.returnPath, 'newsletter_confirmation_failed', 'error');
    case 'already_active':
      redirectNewsletterWithStatus(parsedInput.data.returnPath, 'newsletter_already_active', 'success');
    case 'active':
    default:
      redirectNewsletterWithStatus(parsedInput.data.returnPath, 'newsletter_saved', 'success');
  }
}

export async function createContactInquiryAction(formData: FormData) {
  const parsedInput = contactInquirySchema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
    company: formData.get('company'),
    topic: formData.get('topic'),
    message: formData.get('message'),
    marketingConsent: formData.get('marketingConsent') === 'on'
  });

  if (!parsedInput.success) {
    redirectWithStatus(CONTACT_PATH, 'invalid_contact_input', 'error');
  }

  const headerStore = await headers();
  const turnstileResult = await verifyPublicFormTurnstile({
    formData,
    headerStore,
    expectedAction: 'contact_inquiry'
  });

  if (!turnstileResult.success) {
    redirectWithStatus(CONTACT_PATH, 'turnstile_verification_failed', 'error');
  }

  const marketingDefinition = await getMarketingConsentDefinition();

  if (!marketingDefinition) {
    redirectWithStatus(CONTACT_PATH, 'marketing_consent_missing', 'error');
  }

  const ipAddress = extractClientIp(headerStore.get('x-forwarded-for'));
  const userAgent = headerStore.get('user-agent') ?? undefined;
  const normalizedEmail = normalizeEmail(parsedInput.data.email);
  const company = normalizeOptionalText(parsedInput.data.company || undefined);
  const marketingConsent = Boolean(parsedInput.data.marketingConsent);

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

    await transaction.contactInquiry.create({
      data: {
        leadId: lead.id,
        email: normalizedEmail,
        name: parsedInput.data.name,
        company,
        topic: parsedInput.data.topic,
        message: parsedInput.data.message,
        marketingConsentGranted: marketingConsent
      }
    });

    await transaction.consentRecord.create({
      data: {
        leadId: lead.id,
        definitionId: marketingDefinition.id,
        granted: marketingConsent,
        source: 'PUBLIC_CONTACT_FORM',
        ipAddress,
        userAgent
      }
    });
  });

  revalidatePublicFormPaths();
  redirectWithStatus(CONTACT_PATH, 'contact_saved', 'success');
}

export async function createEnterpriseInterestAction(formData: FormData) {
  const parsedInput = enterpriseInterestSchema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
    company: formData.get('company'),
    role: formData.get('role'),
    teamSize: formData.get('teamSize'),
    message: formData.get('message'),
    marketingConsent: formData.get('marketingConsent') === 'on'
  });

  if (!parsedInput.success) {
    redirectWithStatus(ENTERPRISE_PATH, 'invalid_enterprise_input', 'error');
  }

  const headerStore = await headers();
  const turnstileResult = await verifyPublicFormTurnstile({
    formData,
    headerStore,
    expectedAction: 'enterprise_interest'
  });

  if (!turnstileResult.success) {
    redirectWithStatus(ENTERPRISE_PATH, 'turnstile_verification_failed', 'error');
  }

  const marketingDefinition = await getMarketingConsentDefinition();

  if (!marketingDefinition) {
    redirectWithStatus(ENTERPRISE_PATH, 'marketing_consent_missing', 'error');
  }

  const ipAddress = extractClientIp(headerStore.get('x-forwarded-for'));
  const userAgent = headerStore.get('user-agent') ?? undefined;
  const normalizedEmail = normalizeEmail(parsedInput.data.email);
  const role = normalizeOptionalText(parsedInput.data.role || undefined);
  const teamSize = normalizeOptionalText(parsedInput.data.teamSize || undefined);
  const marketingConsent = Boolean(parsedInput.data.marketingConsent);

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

    await transaction.enterpriseInterest.create({
      data: {
        leadId: lead.id,
        email: normalizedEmail,
        name: parsedInput.data.name,
        company: parsedInput.data.company,
        role,
        teamSize,
        message: parsedInput.data.message,
        marketingConsentGranted: marketingConsent
      }
    });

    await transaction.consentRecord.create({
      data: {
        leadId: lead.id,
        definitionId: marketingDefinition.id,
        granted: marketingConsent,
        source: 'PUBLIC_ENTERPRISE_INTEREST',
        ipAddress,
        userAgent
      }
    });
  });

  revalidatePublicFormPaths();
  redirectWithStatus(ENTERPRISE_PATH, 'enterprise_saved', 'success');
}
