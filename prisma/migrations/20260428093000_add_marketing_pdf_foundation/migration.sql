-- CreateEnum
CREATE TYPE "PdfVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "MarketingPdf" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "visibility" "PdfVisibility" NOT NULL DEFAULT 'PUBLIC',
  "fileName" TEXT NOT NULL,
  "storagePath" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL DEFAULT 'application/pdf',
  "fileSizeBytes" INTEGER,
  "isEnabled" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MarketingPdf_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketingPdf_productId_key" ON "MarketingPdf"("productId");
CREATE UNIQUE INDEX "MarketingPdf_slug_key" ON "MarketingPdf"("slug");
CREATE INDEX "MarketingPdf_visibility_isEnabled_publishedAt_idx" ON "MarketingPdf"("visibility", "isEnabled", "publishedAt");

-- AddForeignKey
ALTER TABLE "MarketingPdf" ADD CONSTRAINT "MarketingPdf_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
