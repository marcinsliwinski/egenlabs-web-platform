import { createHash, randomBytes } from 'node:crypto';
import { NewsletterSubscriptionStatus } from '@prisma/client';

import { db } from '@/lib/db';
import { emailEnv } from '@/features/email/email-env';
import { issueNewsletterConfirmationEmail } from '@/features/email/email-service';

const SOURCE = 'PUBLIC_NEWSLETTER_SIGNUP';

export function createNewsletterConfirmationToken() {
  return randomBytes(32).toString('base64url');
}

export function createNewsletterConfirmationTokenHash(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function buildNewsletterConfirmationUrl(token: string) {
  const url = new URL('/newsletter/confirm', emailEnv.APP_URL);
  url.searchParams.set('token', token);
  return url.toString();
}

async function getMarketingConsentDefinition() {
  return db.consentDefinition.findFirst({
    where: { key: 'MARKETING_EMAIL', isActive: true },
    orderBy: { version: 'desc' }
  });
}

export async function registerNewsletterSignup(input: {
  email: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const definition = await getMarketingConsentDefinition();
  if (!definition) return { success: false as const, reason: 'marketing_consent_missing' as const };

  const now = new Date();
  const lead = await db.lead.upsert({
    where: { email: input.email },
    update: { lastSeenAt: now },
    create: { email: input.email, lastSeenAt: now }
  });

  const existing = await db.newsletterSubscription.findUnique({ where: { leadId: lead.id } });
  if (existing?.status === NewsletterSubscriptionStatus.ACTIVE && existing.isActive) {
    return { success: true as const, status: 'already_active' as const };
  }

  if (!emailEnv.ENABLE_DOUBLE_OPT_IN) {
    await db.$transaction([
      db.newsletterSubscription.upsert({
        where: { leadId: lead.id },
        update: {
          source: SOURCE,
          subscribedAt: now,
          status: NewsletterSubscriptionStatus.ACTIVE,
          isActive: true,
          confirmedAt: now,
          confirmationSentAt: null,
          confirmationTokenHash: null,
          confirmationTokenExpiresAt: null,
          confirmationTokenConsumedAt: null,
          unsubscribedAt: null
        },
        create: {
          leadId: lead.id,
          source: SOURCE,
          status: NewsletterSubscriptionStatus.ACTIVE,
          isActive: true,
          confirmedAt: now
        }
      }),
      db.consentRecord.create({
        data: {
          leadId: lead.id,
          definitionId: definition.id,
          granted: true,
          source: SOURCE,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent
        }
      })
    ]);

    return { success: true as const, status: 'active' as const };
  }

  const rawToken = createNewsletterConfirmationToken();
  const tokenHash = createNewsletterConfirmationTokenHash(rawToken);
  const expiresAt = new Date(now.getTime() + emailEnv.NEWSLETTER_CONFIRMATION_TTL_HOURS * 60 * 60 * 1000);

  await db.newsletterSubscription.upsert({
    where: { leadId: lead.id },
    update: {
      source: SOURCE,
      subscribedAt: now,
      status: NewsletterSubscriptionStatus.PENDING,
      isActive: false,
      confirmedAt: null,
      confirmationSentAt: null,
      confirmationTokenHash: tokenHash,
      confirmationTokenExpiresAt: expiresAt,
      confirmationTokenConsumedAt: null,
      unsubscribedAt: null
    },
    create: {
      leadId: lead.id,
      source: SOURCE,
      status: NewsletterSubscriptionStatus.PENDING,
      isActive: false,
      confirmationSentAt: null,
      confirmationTokenHash: tokenHash,
      confirmationTokenExpiresAt: expiresAt
    }
  });

  const dispatch = await issueNewsletterConfirmationEmail({
    leadId: lead.id,
    toEmail: lead.email,
    confirmationUrl: buildNewsletterConfirmationUrl(rawToken),
    confirmationTtlHours: emailEnv.NEWSLETTER_CONFIRMATION_TTL_HOURS
  });

  if (dispatch.sentAt) {
    await db.newsletterSubscription.update({
      where: { leadId: lead.id },
      data: { confirmationSentAt: dispatch.sentAt }
    });
  }

  return {
    success: true as const,
    status: dispatch.status === 'SENT' ? ('pending' as const) : ('pending_email_failed' as const)
  };
}

export async function confirmNewsletterSubscription(input: {
  token: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const tokenHash = createNewsletterConfirmationTokenHash(input.token);
  const subscription = await db.newsletterSubscription.findUnique({
    where: { confirmationTokenHash: tokenHash },
    include: { lead: true }
  });

  if (!subscription) return { status: 'invalid' as const };
  if (subscription.status === NewsletterSubscriptionStatus.ACTIVE && subscription.isActive) {
    return { status: 'already_confirmed' as const };
  }
  if (!subscription.confirmationTokenExpiresAt || subscription.confirmationTokenExpiresAt <= new Date()) {
    return { status: 'expired' as const };
  }

  const definition = await getMarketingConsentDefinition();
  if (!definition) return { status: 'consent_definition_missing' as const };

  const now = new Date();
  const result = await db.$transaction(async (transaction) => {
    const updated = await transaction.newsletterSubscription.updateMany({
      where: {
        id: subscription.id,
        status: NewsletterSubscriptionStatus.PENDING,
        isActive: false,
        confirmationTokenHash: tokenHash,
        confirmationTokenExpiresAt: { gt: now }
      },
      data: {
        status: NewsletterSubscriptionStatus.ACTIVE,
        isActive: true,
        confirmedAt: now,
        confirmationTokenConsumedAt: now,
        unsubscribedAt: null
      }
    });

    if (updated.count === 0) return false;

    await transaction.consentRecord.create({
      data: {
        leadId: subscription.leadId,
        definitionId: definition.id,
        granted: true,
        source: 'PUBLIC_NEWSLETTER_CONFIRMATION',
        ipAddress: input.ipAddress,
        userAgent: input.userAgent
      }
    });

    return true;
  });

  if (!result) {
    const current = await db.newsletterSubscription.findUnique({ where: { id: subscription.id } });
    return { status: current?.status === NewsletterSubscriptionStatus.ACTIVE ? ('already_confirmed' as const) : ('invalid' as const) };
  }

  return { status: 'confirmed' as const };
}
