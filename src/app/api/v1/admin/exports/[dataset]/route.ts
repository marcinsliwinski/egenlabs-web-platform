import { NextResponse } from 'next/server';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { logAdminAuditEvent } from '@/features/audit/audit-service';
import { getCsvExportByDataset } from '@/features/exports/csv-service';

export async function GET(_: Request, { params }: { params: Promise<{ dataset: string }> }) {
  const admin = await requireAuthenticatedAdmin();
  const { dataset } = await params;
  const result = await getCsvExportByDataset(dataset);

  if (!result.success) {
    return NextResponse.json(
      {
        status: 'error',
        message: result.body
      },
      { status: result.status }
    );
  }

  await logAdminAuditEvent({
    admin,
    actionType: "CSV_EXPORTED",
    entityType: "CsvExport",
    entityId: dataset,
    summary: `Exported CSV dataset ${dataset}.`,
    metadata: { fileName: result.fileName }
  });

  return new NextResponse(result.csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${result.fileName}"`,
      'Cache-Control': 'no-store'
    }
  });
}
