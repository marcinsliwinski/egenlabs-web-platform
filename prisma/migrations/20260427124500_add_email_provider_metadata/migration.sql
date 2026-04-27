-- AlterTable
ALTER TABLE "EmailLog"
ADD COLUMN "providerName" TEXT,
ADD COLUMN "providerMessageId" TEXT;

-- CreateIndex
CREATE INDEX "EmailLog_providerMessageId_idx" ON "EmailLog"("providerMessageId");
