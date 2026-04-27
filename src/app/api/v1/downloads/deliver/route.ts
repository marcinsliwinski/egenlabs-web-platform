import { NextResponse } from 'next/server';

import { deliverIssuedDownloadLinkShell } from '@/features/downloads/download-service';

function getSearchParamValue(value: string | null) {
  const normalizedValue = value?.trim();

  return normalizedValue && normalizedValue.length > 0 ? normalizedValue : undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = getSearchParamValue(searchParams.get('token'));
  const slug = getSearchParamValue(searchParams.get('slug'));
  const result = await deliverIssuedDownloadLinkShell({ token, slug });

  if (!result.success) {
    return NextResponse.json(
      {
        status: result.status,
        message: result.summary
      },
      {
        status: result.httpStatus,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );
  }

  return new NextResponse(result.body, {
    status: 200,
    headers: {
      'Content-Type': result.contentType,
      'Content-Disposition': `attachment; filename="${result.fileName}"`,
      'Cache-Control': 'no-store',
      'X-Download-Link-Mode': result.link.mode,
      'X-Download-Link-Status': result.link.status,
      'X-Delivery-Shell-Summary': result.summary
    }
  });
}
