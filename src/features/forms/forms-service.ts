import { NewsletterSubscriptionStatus } from '@prisma/client';

import { db } from '@/lib/db';
import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { getActiveConsentDefinitions } from '@/features/leads/lead-service';

export async function getFormsAdminOverview() {
  const admin = await requireAuthenticatedAdmin();

  const [newsletterCount, pendingNewsletterCount, activeNewsletterCount, unsubscribedNewsletterCount, contactInquiryCount, enterpriseInterestCount, consentDefinitions, newsletterSubscriptions, contactInquiries, enterpriseInterests] = await Promise.all([
    db.newsletterSubscription.count(),
    db.newsletterSubscription.count({ where: { status: NewsletterSubscriptionStatus.PENDING } }),
    db.newsletterSubscription.count({ where: { status: NewsletterSubscriptionStatus.ACTIVE } }),
    db.newsletterSubscription.count({ where: { status: NewsletterSubscriptionStatus.UNSUBSCRIBED } }),
    db.contactInquiry.count(),
    db.enterpriseInterest.count(),
    getActiveConsentDefinitions(),
    db.newsletterSubscription.findMany({
      include: { lead: true },
      orderBy: [{ subscribedAt: 'desc' }, { createdAt: 'desc' }],
      take: 50
    }),
    db.contactInquiry.findMany({
      include: { lead: true },
      orderBy: [{ createdAt: 'desc' }],
      take: 50
    }),
    db.enterpriseInterest.findMany({
      include: { lead: true },
      orderBy: [{ createdAt: 'desc' }],
      take: 50
    })
  ]);

  return {
    admin,
    consentDefinitions,
    stats: {
      newsletterCount,
      pendingNewsletterCount,
      activeNewsletterCount,
      unsubscribedNewsletterCount,
      contactInquiryCount,
      enterpriseInterestCount
    },
    newsletterSubscriptions,
    contactInquiries,
    enterpriseInterests
  };
}
