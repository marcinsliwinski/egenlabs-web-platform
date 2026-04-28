import { NextResponse } from 'next/server';

import { resolveMarketingPdfDownloadBySlug } from '@/features/pdf/pdf-service';

function getSlug(value: string | null) {
  const normalizedValue = value?.trim();

  return normalizedValue && normalizedValue.length > 0 ? normalizedValue : undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = getSlug(searchParams.get('slug'));

  if (!slug) {
    return NextResponse.json(
      {
        status: 'invalid_request',
        message: 'PDF download request is missing the required slug parameter.'
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const result = await resolveMarketingPdfDownloadBySlug(slug);

  if (!result.success) {
    return NextResponse.json(
      {
        status: result.status,
        message: result.message
      },
      { status: result.httpStatus, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const responseBody = Uint8Array.from(result.body);

  return new NextResponse(responseBody, {
    status: 200,
    headers: {
      'Content-Type': result.contentType,
      'Content-Disposition': `attachment; filename="${result.fileName}"`,
      'Cache-Control': 'no-store'
    }
  });
}
