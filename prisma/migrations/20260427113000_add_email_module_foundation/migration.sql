-- CreateEnum
CREATE TYPE "EmailLogStatus" AS ENUM ('SENT', 'FAILED');

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "subjectTemplate" TEXT NOT NULL,
    "textBodyTemplate" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "templateId" TEXT,
    "templateKey" TEXT NOT NULL,
    "templateVersion" INTEGER,
    "leadId" TEXT,
    "downloadRequestId" TEXT,
    "downloadLinkId" TEXT,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "textBody" TEXT NOT NULL,
    "status" "EmailLogStatus" NOT NULL,
    "transportMode" TEXT NOT NULL,
    "errorMessage" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_key_version_key" ON "EmailTemplate"("key", "version");

-- CreateIndex
CREATE INDEX "EmailTemplate_key_isActive_idx" ON "EmailTemplate"("key", "isActive");

-- CreateIndex
CREATE INDEX "EmailLog_templateKey_templateVersion_idx" ON "EmailLog"("templateKey", "templateVersion");

-- CreateIndex
CREATE INDEX "EmailLog_leadId_idx" ON "EmailLog"("leadId");

-- CreateIndex
CREATE INDEX "EmailLog_downloadRequestId_idx" ON "EmailLog"("downloadRequestId");

-- CreateIndex
CREATE INDEX "EmailLog_downloadLinkId_idx" ON "EmailLog"("downloadLinkId");

-- CreateIndex
CREATE INDEX "EmailLog_toEmail_idx" ON "EmailLog"("toEmail");

-- CreateIndex
CREATE INDEX "EmailLog_status_idx" ON "EmailLog"("status");

-- CreateIndex
CREATE INDEX "EmailLog_createdAt_idx" ON "EmailLog"("createdAt");

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "EmailTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_downloadRequestId_fkey" FOREIGN KEY ("downloadRequestId") REFERENCES "DownloadRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_downloadLinkId_fkey" FOREIGN KEY ("downloadLinkId") REFERENCES "DownloadLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed baseline transactional templates
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
VALUES
    (
        'email_template_download_welcome_v1',
        'DOWNLOAD_WELCOME',
        1,
        'Download registration welcome',
        'Your {{productName}} registration is recorded',
        'Hello,\n\nYour download registration for {{productName}} / {{editionName}} / {{channelName}} has been recorded in the accepted MVP flow.\n\nBuild: {{buildVersion}} (#{{buildNumber}})\nRequest ID: {{requestId}}\n\nThis environment currently uses the transactional email shell in {{transportMode}} mode.\n\nRegards,\n{{appName}}',
        true,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'email_template_download_link_v1',
        'DOWNLOAD_LINK',
        1,
        'Download access email',
        'Your {{productName}} download access shell link',
        'Hello,\n\nYour download access shell link for {{productName}} / {{editionName}} / {{channelName}} is ready:\n{{accessUrl}}\n\nPolicy mode: {{policyMode}}\nBuild: {{buildVersion}} (#{{buildNumber}})\n\nThis shell confirms issuance and link validation. Final binary delivery is not enabled yet in this step.\n\nRegards,\n{{appName}}',
        true,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
