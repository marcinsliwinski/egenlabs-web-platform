import { NextResponse } from 'next/server';
import { z } from 'zod';

import { resolveDesktopContextByKeys } from '@/features/desktop/desktop-service';
import { db } from '@/lib/db';

const featureRequestSchema = z.object({
  product: z.string().trim().min(1).max(120),
  edition: z.string().trim().min(1).max(120),
  channel: z.string().trim().min(1).max(120),
  installationId: z.string().trim().max(190).optional(),
  appVersion: z.string().trim().max(120).optional(),
  email: z.string().trim().email().max(320).optional(),
  title: z.string().trim().min(3).max(180),
  description: z.string().trim().min(10).max(4000)
});

function normalizeOptionalText(value: string | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function normalizeOptionalEmail(value: string | undefined) {
  const normalized = value?.trim().toLowerCase();
  return normalized ? normalized : undefined;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = featureRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        status: 'invalid_request',
        message: 'Desktop feature request payload is invalid.'
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const context = await resolveDesktopContextByKeys(parsed.data.product, parsed.data.edition, parsed.data.channel);

  if (!context) {
    return NextResponse.json(
      {
        status: 'combination_not_found',
        message: 'The requested desktop feature request combination does not exist.'
      },
      { status: 404, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const featureRequest = await db.featureRequest.create({
    data: {
      productId: context.product.id,
      editionId: context.edition.id,
      channelId: context.channel.id,
      installationId: normalizeOptionalText(parsed.data.installationId),
      appVersion: normalizeOptionalText(parsed.data.appVersion),
      email: normalizeOptionalEmail(parsed.data.email),
      title: parsed.data.title,
      description: parsed.data.description
    }
  });

  return NextResponse.json(
    {
      status: 'accepted',
      featureRequestId: featureRequest.id,
      createdAt: featureRequest.createdAt.toISOString()
    },
    { status: 202, headers: { 'Cache-Control': 'no-store' } }
  );
}
