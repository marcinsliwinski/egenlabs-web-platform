-- CreateEnum
CREATE TYPE "NewsletterSubscriptionStatus" AS ENUM ('PENDING', 'ACTIVE', 'UNSUBSCRIBED');

-- AlterTable
ALTER TABLE "NewsletterSubscription"
ADD COLUMN "status" "NewsletterSubscriptionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "confirmedAt" TIMESTAMP(3),
ADD COLUMN "confirmationSentAt" TIMESTAMP(3),
ADD COLUMN "confirmationTokenHash" TEXT,
ADD COLUMN "confirmationTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN "confirmationTokenConsumedAt" TIMESTAMP(3);

-- Preserve the meaning of existing records created before double opt-in.
UPDATE "NewsletterSubscription"
SET "status" = CASE
  WHEN "isActive" = TRUE THEN 'ACTIVE'::"NewsletterSubscriptionStatus"
  WHEN "unsubscribedAt" IS NOT NULL THEN 'UNSUBSCRIBED'::"NewsletterSubscriptionStatus"
  ELSE 'PENDING'::"NewsletterSubscriptionStatus"
END,
"confirmedAt" = CASE WHEN "isActive" = TRUE THEN "subscribedAt" ELSE NULL END;

-- New newsletter signups start in PENDING state.
ALTER TABLE "NewsletterSubscription" ALTER COLUMN "isActive" SET DEFAULT FALSE;

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscription_confirmationTokenHash_key" ON "NewsletterSubscription"("confirmationTokenHash");
CREATE INDEX "NewsletterSubscription_status_subscribedAt_idx" ON "NewsletterSubscription"("status", "subscribedAt");
CREATE INDEX "NewsletterSubscription_confirmationTokenExpiresAt_idx" ON "NewsletterSubscription"("confirmationTokenExpiresAt");

-- Seed the newsletter confirmation template.
INSERT INTO "EmailTemplate" (
  "id",
  "key",
  "version",
  "name",
  "subjectTemplate",
  "textBodyTemplate",
  "isActive",
  "createdAt",
  "updatedAt"
)
VALUES (
  'email_template_newsletter_confirmation_v1',
  'NEWSLETTER_CONFIRMATION',
  1,
  'Newsletter double opt-in confirmation',
  'Potwierdź zapis do newslettera eGen Labs',
  E'Dzień dobry,\n\naby potwierdzić zapis do newslettera eGen Labs, otwórz poniższy link:\n{{confirmationUrl}}\n\nLink jest ważny przez {{confirmationTtlHours}} godzin. Jeżeli to nie Ty wysłałeś formularz, zignoruj tę wiadomość.\n\nPozdrawiamy,\n{{appName}}',
  TRUE,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("key", "version") DO NOTHING;
