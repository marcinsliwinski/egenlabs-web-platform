import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const appUrl = process.env.APP_URL || '';
const confirmed = process.argv.includes('--confirm');
const emails = [...new Set(
  (process.env.TEST_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
)];

function fail(message) {
  throw new Error(message);
}

function isSafeEnvironment(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('staging.');
  } catch {
    return false;
  }
}

function isValidEmail(value) {
  return value.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function main() {
  if (!isSafeEnvironment(appUrl)) {
    fail('Cleanup is allowed only when APP_URL points to localhost, 127.0.0.1, or a staging.* host.');
  }

  if (!confirmed) {
    fail('Pass --confirm to acknowledge deletion of staging test data.');
  }

  if (emails.length === 0 || emails.some((email) => !isValidEmail(email))) {
    fail('Set TEST_EMAILS to a comma-separated list of valid test email addresses.');
  }

  const result = await prisma.$transaction(async (transaction) => {
    const leads = await transaction.lead.findMany({
      where: { email: { in: emails } },
      select: { id: true }
    });
    const leadIds = leads.map((lead) => lead.id);
    const leadWhere = leadIds.length > 0 ? { leadId: { in: leadIds } } : null;

    const emailLogs = await transaction.emailLog.deleteMany({
      where: {
        OR: [
          { toEmail: { in: emails } },
          ...(leadWhere ? [leadWhere] : [])
        ]
      }
    });

    const consents = leadIds.length > 0
      ? await transaction.consentRecord.deleteMany({ where: { leadId: { in: leadIds } } })
      : { count: 0 };

    const newsletters = leadIds.length > 0
      ? await transaction.newsletterSubscription.deleteMany({ where: { leadId: { in: leadIds } } })
      : { count: 0 };

    const contacts = await transaction.contactInquiry.deleteMany({
      where: {
        OR: [
          { email: { in: emails } },
          ...(leadWhere ? [leadWhere] : [])
        ]
      }
    });

    const enterprise = await transaction.enterpriseInterest.deleteMany({
      where: {
        OR: [
          { email: { in: emails } },
          ...(leadWhere ? [leadWhere] : [])
        ]
      }
    });

    const downloads = await transaction.downloadRequest.deleteMany({
      where: {
        OR: [
          { email: { in: emails } },
          ...(leadWhere ? [leadWhere] : [])
        ]
      }
    });

    const featureRequests = await transaction.featureRequest.deleteMany({
      where: { email: { in: emails } }
    });

    const softwareDemand = await transaction.softwareDemandRequest.deleteMany({
      where: { email: { in: emails } }
    });

    const deletedLeads = await transaction.lead.deleteMany({
      where: { id: { in: leadIds } }
    });

    return {
      leads: deletedLeads.count,
      consents: consents.count,
      newsletterSubscriptions: newsletters.count,
      contactInquiries: contacts.count,
      enterpriseInterests: enterprise.count,
      downloadRequests: downloads.count,
      emailLogs: emailLogs.count,
      featureRequests: featureRequests.count,
      softwareDemandRequests: softwareDemand.count
    };
  });

  console.log('Staging test data cleanup completed.');
  console.table(result);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
