import { createHash, randomBytes } from 'node:crypto';
import { PrismaClient, NewsletterSubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();
const baseUrl = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const runId = `${Date.now()}-${randomBytes(4).toString('hex')}`;
const emails = {
  valid: `newsletter-doi-valid-${runId}@example.invalid`,
  expired: `newsletter-doi-expired-${runId}@example.invalid`
};

function token() {
  return randomBytes(32).toString('base64url');
}

function hash(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function callConfirmation(rawToken) {
  const response = await fetch(`${baseUrl}/api/v1/newsletter/confirm`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ token: rawToken }),
    redirect: 'manual'
  });
  return { status: response.status, location: response.headers.get('location') || '' };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function createPending(email, rawToken, expiresAt) {
  const lead = await prisma.lead.create({ data: { email } });
  const subscription = await prisma.newsletterSubscription.create({
    data: {
      leadId: lead.id,
      source: 'SMOKE_NEWSLETTER_DOUBLE_OPT_IN',
      status: NewsletterSubscriptionStatus.PENDING,
      isActive: false,
      confirmationSentAt: new Date(),
      confirmationTokenHash: hash(rawToken),
      confirmationTokenExpiresAt: expiresAt
    }
  });
  return { lead, subscription };
}

async function main() {
  const definition = await prisma.consentDefinition.findFirst({
    where: { key: 'MARKETING_EMAIL', isActive: true },
    orderBy: { version: 'desc' }
  });
  assert(definition, 'Active MARKETING_EMAIL consent definition is missing.');

  const validToken = token();
  const valid = await createPending(emails.valid, validToken, new Date(Date.now() + 60 * 60 * 1000));

  const preview = await fetch(`${baseUrl}/newsletter/confirm?token=${encodeURIComponent(validToken)}`, {
    redirect: 'manual'
  });
  assert(preview.status === 200, `Expected 200 for confirmation preview, received ${preview.status}.`);
  const beforePost = await prisma.newsletterSubscription.findUnique({ where: { id: valid.subscription.id } });
  assert(beforePost?.status === NewsletterSubscriptionStatus.PENDING, 'GET preview activated a subscription.');

  const first = await callConfirmation(validToken);
  assert(first.status === 303, `Expected 303 for valid token, received ${first.status}.`);
  assert(first.location.includes('status=confirmed'), `Expected confirmed redirect, received ${first.location}.`);

  const activated = await prisma.newsletterSubscription.findUnique({ where: { id: valid.subscription.id } });
  assert(activated?.status === NewsletterSubscriptionStatus.ACTIVE, 'Subscription did not become ACTIVE.');
  assert(activated?.isActive === true, 'Subscription isActive was not set to true.');
  assert(activated?.confirmedAt, 'confirmedAt was not recorded.');

  const consent = await prisma.consentRecord.findFirst({
    where: { leadId: valid.lead.id, definitionId: definition.id, granted: true, source: 'PUBLIC_NEWSLETTER_CONFIRMATION' }
  });
  assert(consent, 'Granted consent record was not created.');

  const repeated = await callConfirmation(validToken);
  assert(repeated.status === 303, `Expected 303 for repeated token, received ${repeated.status}.`);
  assert(repeated.location.includes('status=already_confirmed'), `Expected idempotent redirect, received ${repeated.location}.`);

  const expiredToken = token();
  const expired = await createPending(emails.expired, expiredToken, new Date(Date.now() - 60 * 1000));
  const expiredResponse = await callConfirmation(expiredToken);
  assert(expiredResponse.location.includes('status=expired'), `Expected expired redirect, received ${expiredResponse.location}.`);
  const expiredState = await prisma.newsletterSubscription.findUnique({ where: { id: expired.subscription.id } });
  assert(expiredState?.status === NewsletterSubscriptionStatus.PENDING, 'Expired token activated a subscription.');

  const invalidResponse = await callConfirmation(token());
  assert(invalidResponse.location.includes('status=invalid'), `Expected invalid redirect, received ${invalidResponse.location}.`);

  console.log('Newsletter double opt-in smoke checks passed.');
}

main()
  .finally(async () => {
    await prisma.lead.deleteMany({ where: { email: { in: Object.values(emails) } } });
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
