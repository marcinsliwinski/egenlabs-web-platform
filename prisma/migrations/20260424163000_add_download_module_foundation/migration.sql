-- CreateEnum
CREATE TYPE "DownloadPolicyMode" AS ENUM ('PUBLIC_DIRECT', 'ONE_TIME', 'TEMPORARY', 'PRIVATE_STATIC');

-- CreateEnum
CREATE TYPE "DownloadRequestStatus" AS ENUM ('PENDING', 'ISSUED', 'EXPIRED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "DownloadLinkStatus" AS ENUM ('ACTIVE', 'CONSUMED', 'EXPIRED', 'REVOKED');

-- CreateTable
CREATE TABLE "DownloadPolicy" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "mode" "DownloadPolicyMode" NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "linkTtlMinutes" INTEGER,
    "requireActiveBuild" BOOLEAN NOT NULL DEFAULT true,
    "requireEmailRegistration" BOOLEAN NOT NULL DEFAULT true,
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DownloadPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownloadLink" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "buildId" TEXT NOT NULL,
    "requestId" TEXT,
    "mode" "DownloadPolicyMode" NOT NULL,
    "status" "DownloadLinkStatus" NOT NULL DEFAULT 'ACTIVE',
    "tokenHash" TEXT,
    "publicSlug" TEXT,
    "expiresAt" TIMESTAMP(3),
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DownloadLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownloadRequest" (
    "id" TEXT NOT NULL,
    "policyId" TEXT,
    "productId" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "buildId" TEXT,
    "email" TEXT,
    "status" "DownloadRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DownloadRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DownloadPolicy_productId_editionId_channelId_key" ON "DownloadPolicy"("productId", "editionId", "channelId");

-- CreateIndex
CREATE INDEX "DownloadPolicy_productId_editionId_channelId_idx" ON "DownloadPolicy"("productId", "editionId", "channelId");

-- CreateIndex
CREATE UNIQUE INDEX "DownloadLink_tokenHash_key" ON "DownloadLink"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "DownloadLink_publicSlug_key" ON "DownloadLink"("publicSlug");

-- CreateIndex
CREATE INDEX "DownloadLink_policyId_idx" ON "DownloadLink"("policyId");

-- CreateIndex
CREATE INDEX "DownloadLink_buildId_idx" ON "DownloadLink"("buildId");

-- CreateIndex
CREATE INDEX "DownloadLink_requestId_idx" ON "DownloadLink"("requestId");

-- CreateIndex
CREATE INDEX "DownloadLink_status_idx" ON "DownloadLink"("status");

-- CreateIndex
CREATE INDEX "DownloadRequest_policyId_idx" ON "DownloadRequest"("policyId");

-- CreateIndex
CREATE INDEX "DownloadRequest_productId_editionId_channelId_idx" ON "DownloadRequest"("productId", "editionId", "channelId");

-- CreateIndex
CREATE INDEX "DownloadRequest_buildId_idx" ON "DownloadRequest"("buildId");

-- CreateIndex
CREATE INDEX "DownloadRequest_status_idx" ON "DownloadRequest"("status");

-- AddForeignKey
ALTER TABLE "DownloadPolicy" ADD CONSTRAINT "DownloadPolicy_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadPolicy" ADD CONSTRAINT "DownloadPolicy_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "ProductEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadPolicy" ADD CONSTRAINT "DownloadPolicy_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "ReleaseChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadLink" ADD CONSTRAINT "DownloadLink_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "DownloadPolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadLink" ADD CONSTRAINT "DownloadLink_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadLink" ADD CONSTRAINT "DownloadLink_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "DownloadRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadRequest" ADD CONSTRAINT "DownloadRequest_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "DownloadPolicy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadRequest" ADD CONSTRAINT "DownloadRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadRequest" ADD CONSTRAINT "DownloadRequest_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "ProductEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadRequest" ADD CONSTRAINT "DownloadRequest_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "ReleaseChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadRequest" ADD CONSTRAINT "DownloadRequest_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE SET NULL ON UPDATE CASCADE;
