import { db } from '@/lib/db';
import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { getActiveConsentDefinitions } from '@/features/leads/lead-service';

export async function getFormsAdminOverview() {
  const admin = await requireAuthenticatedAdmin();

  const [newsletterCount, activeNewsletterCount, contactInquiryCount, enterpriseInterestCount, consentDefinitions, newsletterSubscriptions, contactInquiries, enterpriseInterests] = await Promise.all([
    db.newsletterSubscription.count(),
    db.newsletterSubscription.count({ where: { isActive: true } }),
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
      activeNewsletterCount,
      contactInquiryCount,
      enterpriseInterestCount
    },
    newsletterSubscriptions,
    contactInquiries,
    enterpriseInterests
  };
}
