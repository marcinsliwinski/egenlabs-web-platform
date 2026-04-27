-- CreateEnum
CREATE TYPE "ContactInquiryStatus" AS ENUM ('NEW', 'REVIEWED', 'CLOSED');

-- CreateEnum
CREATE TYPE "EnterpriseInterestStatus" AS ENUM ('NEW', 'QUALIFIED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "NewsletterSubscription" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "unsubscribedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "NewsletterSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInquiry" (
  "id" TEXT NOT NULL,
  "leadId" TEXT,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "company" TEXT,
  "topic" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "marketingConsentGranted" BOOLEAN NOT NULL DEFAULT false,
  "status" "ContactInquiryStatus" NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnterpriseInterest" (
  "id" TEXT NOT NULL,
  "leadId" TEXT,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "role" TEXT,
  "teamSize" TEXT,
  "message" TEXT NOT NULL,
  "marketingConsentGranted" BOOLEAN NOT NULL DEFAULT false,
  "status" "EnterpriseInterestStatus" NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "EnterpriseInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscription_leadId_key" ON "NewsletterSubscription"("leadId");

-- CreateIndex
CREATE INDEX "NewsletterSubscription_isActive_subscribedAt_idx" ON "NewsletterSubscription"("isActive", "subscribedAt");

-- CreateIndex
CREATE INDEX "ContactInquiry_leadId_idx" ON "ContactInquiry"("leadId");

-- CreateIndex
CREATE INDEX "ContactInquiry_status_createdAt_idx" ON "ContactInquiry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContactInquiry_email_idx" ON "ContactInquiry"("email");

-- CreateIndex
CREATE INDEX "EnterpriseInterest_leadId_idx" ON "EnterpriseInterest"("leadId");

-- CreateIndex
CREATE INDEX "EnterpriseInterest_status_createdAt_idx" ON "EnterpriseInterest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "EnterpriseInterest_email_idx" ON "EnterpriseInterest"("email");

-- AddForeignKey
ALTER TABLE "NewsletterSubscription" ADD CONSTRAINT "NewsletterSubscription_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInquiry" ADD CONSTRAINT "ContactInquiry_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnterpriseInterest" ADD CONSTRAINT "EnterpriseInterest_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
