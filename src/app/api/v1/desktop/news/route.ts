import { NewsFeedCategory } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getDesktopNewsFeed } from '@/features/desktop/desktop-service';

const desktopNewsSchema = z.object({
  product: z.string().trim().min(1).max(120),
  edition: z.string().trim().min(1).max(120),
  channel: z.string().trim().min(1).max(120),
  currentVersion: z.string().trim().min(1).max(120).optional(),
  category: z.nativeEnum(NewsFeedCategory).optional(),
  limit: z.coerce.number().int().positive().max(50).optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = desktopNewsSchema.safeParse({
    product: searchParams.get('product'),
    edition: searchParams.get('edition'),
    channel: searchParams.get('channel'),
    currentVersion: searchParams.get('currentVersion') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    limit: searchParams.get('limit') ?? undefined
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        status: 'invalid_request',
        message: 'Desktop news request is missing required parameters.'
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const result = await getDesktopNewsFeed({
    productKey: parsed.data.product,
    editionKey: parsed.data.edition,
    channelKey: parsed.data.channel,
    currentVersion: parsed.data.currentVersion,
    category: parsed.data.category,
    limit: parsed.data.limit
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

  return NextResponse.json(
    {
      status: 'ok',
      ...result
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  );
}
