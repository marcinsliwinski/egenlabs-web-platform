import { NextResponse } from 'next/server';
import { z } from 'zod';

import { resolveDesktopContextByKeys } from '@/features/desktop/desktop-service';
import { db } from '@/lib/db';

const softwareDemandSchema = z.object({
  product: z.string().trim().min(1).max(120),
  edition: z.string().trim().min(1).max(120),
  channel: z.string().trim().min(1).max(120),
  installationId: z.string().trim().max(190).optional(),
  appVersion: z.string().trim().max(120).optional(),
  email: z.string().trim().email().max(320).optional(),
  company: z.string().trim().max(160).optional(),
  requestedSoftwareName: z.string().trim().min(2).max(180),
  useCase: z.string().trim().min(10).max(4000),
  details: z.string().trim().max(4000).optional()
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
  const parsed = softwareDemandSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        status: 'invalid_request',
        message: 'Desktop software demand payload is invalid.'
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const context = await resolveDesktopContextByKeys(parsed.data.product, parsed.data.edition, parsed.data.channel);

  if (!context) {
    return NextResponse.json(
      {
        status: 'combination_not_found',
        message: 'The requested desktop software demand combination does not exist.'
      },
      { status: 404, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const softwareDemandRequest = await db.softwareDemandRequest.create({
    data: {
      productId: context.product.id,
      editionId: context.edition.id,
      channelId: context.channel.id,
      installationId: normalizeOptionalText(parsed.data.installationId),
      appVersion: normalizeOptionalText(parsed.data.appVersion),
      email: normalizeOptionalEmail(parsed.data.email),
      company: normalizeOptionalText(parsed.data.company),
      requestedSoftwareName: parsed.data.requestedSoftwareName,
      useCase: parsed.data.useCase,
      details: normalizeOptionalText(parsed.data.details)
    }
  });

  return NextResponse.json(
    {
      status: 'accepted',
      softwareDemandRequestId: softwareDemandRequest.id,
      createdAt: softwareDemandRequest.createdAt.toISOString()
    },
    { status: 202, headers: { 'Cache-Control': 'no-store' } }
  );
}
