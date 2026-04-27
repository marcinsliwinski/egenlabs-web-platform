-- CreateEnum
CREATE TYPE "TelemetrySeverity" AS ENUM ('INFO', 'WARN', 'ERROR');

-- CreateEnum
CREATE TYPE "FeedbackItemStatus" AS ENUM ('NEW', 'REVIEWED', 'PLANNED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "DesktopTelemetryEvent" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "editionId" TEXT NOT NULL,
  "channelId" TEXT NOT NULL,
  "installationId" TEXT,
  "appVersion" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "severity" "TelemetrySeverity" NOT NULL DEFAULT 'INFO',
  "message" TEXT,
  "payloadJson" TEXT,
  "occurredAt" TIMESTAMP(3),
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ipAddress" TEXT,
  "userAgent" TEXT,

  CONSTRAINT "DesktopTelemetryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureRequest" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "editionId" TEXT NOT NULL,
  "channelId" TEXT NOT NULL,
  "installationId" TEXT,
  "appVersion" TEXT,
  "email" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "FeedbackItemStatus" NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "FeatureRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoftwareDemandRequest" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "editionId" TEXT NOT NULL,
  "channelId" TEXT NOT NULL,
  "installationId" TEXT,
  "appVersion" TEXT,
  "email" TEXT,
  "company" TEXT,
  "requestedSoftwareName" TEXT NOT NULL,
  "useCase" TEXT NOT NULL,
  "details" TEXT,
  "status" "FeedbackItemStatus" NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SoftwareDemandRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DesktopTelemetryEvent_productId_editionId_channelId_receivedAt_idx" ON "DesktopTelemetryEvent"("productId", "editionId", "channelId", "receivedAt");
CREATE INDEX "DesktopTelemetryEvent_installationId_idx" ON "DesktopTelemetryEvent"("installationId");
CREATE INDEX "DesktopTelemetryEvent_eventType_receivedAt_idx" ON "DesktopTelemetryEvent"("eventType", "receivedAt");
CREATE INDEX "DesktopTelemetryEvent_severity_receivedAt_idx" ON "DesktopTelemetryEvent"("severity", "receivedAt");

-- CreateIndex
CREATE INDEX "FeatureRequest_productId_editionId_channelId_createdAt_idx" ON "FeatureRequest"("productId", "editionId", "channelId", "createdAt");
CREATE INDEX "FeatureRequest_installationId_idx" ON "FeatureRequest"("installationId");
CREATE INDEX "FeatureRequest_status_createdAt_idx" ON "FeatureRequest"("status", "createdAt");
CREATE INDEX "FeatureRequest_email_idx" ON "FeatureRequest"("email");

-- CreateIndex
CREATE INDEX "SoftwareDemandRequest_productId_editionId_channelId_createdAt_idx" ON "SoftwareDemandRequest"("productId", "editionId", "channelId", "createdAt");
CREATE INDEX "SoftwareDemandRequest_installationId_idx" ON "SoftwareDemandRequest"("installationId");
CREATE INDEX "SoftwareDemandRequest_status_createdAt_idx" ON "SoftwareDemandRequest"("status", "createdAt");
CREATE INDEX "SoftwareDemandRequest_email_idx" ON "SoftwareDemandRequest"("email");

-- AddForeignKey
ALTER TABLE "DesktopTelemetryEvent" ADD CONSTRAINT "DesktopTelemetryEvent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DesktopTelemetryEvent" ADD CONSTRAINT "DesktopTelemetryEvent_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "ProductEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DesktopTelemetryEvent" ADD CONSTRAINT "DesktopTelemetryEvent_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "ReleaseChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "FeatureRequest" ADD CONSTRAINT "FeatureRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FeatureRequest" ADD CONSTRAINT "FeatureRequest_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "ProductEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FeatureRequest" ADD CONSTRAINT "FeatureRequest_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "ReleaseChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "SoftwareDemandRequest" ADD CONSTRAINT "SoftwareDemandRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SoftwareDemandRequest" ADD CONSTRAINT "SoftwareDemandRequest_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "ProductEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SoftwareDemandRequest" ADD CONSTRAINT "SoftwareDemandRequest_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "ReleaseChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
