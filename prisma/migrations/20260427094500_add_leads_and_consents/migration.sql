-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentDefinition" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsentDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "downloadRequestId" TEXT,
    "granted" BOOLEAN NOT NULL,
    "source" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "DownloadRequest" ADD COLUMN "leadId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ConsentDefinition_key_version_key" ON "ConsentDefinition"("key", "version");

-- CreateIndex
CREATE INDEX "ConsentDefinition_key_isActive_idx" ON "ConsentDefinition"("key", "isActive");

-- CreateIndex
CREATE INDEX "ConsentRecord_leadId_idx" ON "ConsentRecord"("leadId");

-- CreateIndex
CREATE INDEX "ConsentRecord_definitionId_idx" ON "ConsentRecord"("definitionId");

-- CreateIndex
CREATE INDEX "ConsentRecord_downloadRequestId_idx" ON "ConsentRecord"("downloadRequestId");

-- CreateIndex
CREATE INDEX "ConsentRecord_capturedAt_idx" ON "ConsentRecord"("capturedAt");

-- CreateIndex
CREATE INDEX "DownloadRequest_leadId_idx" ON "DownloadRequest"("leadId");

-- AddForeignKey
ALTER TABLE "DownloadRequest" ADD CONSTRAINT "DownloadRequest_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "ConsentDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_downloadRequestId_fkey" FOREIGN KEY ("downloadRequestId") REFERENCES "DownloadRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed current consent definitions
INSERT INTO "ConsentDefinition" (
    "id",
    "key",
    "version",
    "title",
    "description",
    "isRequired",
    "isActive",
    "createdAt",
    "updatedAt"
)
VALUES
    (
        'consent_definition_download_registration_v1',
        'DOWNLOAD_REGISTRATION',
        1,
        'Download registration consent',
        'Required operational consent for handling a product download registration request.',
        true,
        true,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'consent_definition_marketing_email_v1',
        'MARKETING_EMAIL',
        1,
        'Marketing email consent',
        'Optional consent for future marketing and newsletter email communication.',
        false,
        true,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
