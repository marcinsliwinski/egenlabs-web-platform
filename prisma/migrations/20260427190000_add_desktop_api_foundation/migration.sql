-- CreateEnum
CREATE TYPE "NewsFeedCategory" AS ENUM ('GENERAL', 'RELEASE', 'UPDATE', 'ALERT');

-- CreateTable
CREATE TABLE "NewsFeedItem" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "category" "NewsFeedCategory" NOT NULL DEFAULT 'GENERAL',
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "minVersion" TEXT,
    "maxVersion" TEXT,
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsFeedItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsFeedItem_slug_key" ON "NewsFeedItem"("slug");

-- CreateIndex
CREATE INDEX "NewsFeedItem_productId_editionId_channelId_status_publishedAt_idx" ON "NewsFeedItem"("productId", "editionId", "channelId", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "NewsFeedItem_category_status_publishedAt_idx" ON "NewsFeedItem"("category", "status", "publishedAt");

-- AddForeignKey
ALTER TABLE "NewsFeedItem" ADD CONSTRAINT "NewsFeedItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NewsFeedItem" ADD CONSTRAINT "NewsFeedItem_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "ProductEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NewsFeedItem" ADD CONSTRAINT "NewsFeedItem_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "ReleaseChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
