import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getDesktopUpdateSnapshot } from '@/features/desktop/desktop-service';

const desktopUpdateSchema = z.object({
  product: z.string().trim().min(1).max(120),
  edition: z.string().trim().min(1).max(120),
  channel: z.string().trim().min(1).max(120),
  currentVersion: z.string().trim().min(1).max(120)
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = desktopUpdateSchema.safeParse({
    product: searchParams.get('product'),
    edition: searchParams.get('edition'),
    channel: searchParams.get('channel'),
    currentVersion: searchParams.get('currentVersion')
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        status: 'invalid_request',
        message: 'Desktop update request is missing required parameters.'
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const result = await getDesktopUpdateSnapshot({
    productKey: parsed.data.product,
    editionKey: parsed.data.edition,
    channelKey: parsed.data.channel,
    currentVersion: parsed.data.currentVersion
  });

  if (!result.found) {
    return NextResponse.json(
      {
        status: result.status,
        message: result.message
      },
      { status: 404, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (result.status !== 'ok') {
    return NextResponse.json(
      {
        status: result.status,
        message: result.message
      },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  return NextResponse.json(
    result,
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  );
}
