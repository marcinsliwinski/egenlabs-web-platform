import { TelemetrySeverity } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { resolveDesktopContextByKeys } from '@/features/desktop/desktop-service';
import { db } from '@/lib/db';

const desktopTelemetrySchema = z.object({
  product: z.string().trim().min(1).max(120),
  edition: z.string().trim().min(1).max(120),
  channel: z.string().trim().min(1).max(120),
  installationId: z.string().trim().max(190).optional(),
  appVersion: z.string().trim().min(1).max(120),
  eventType: z.string().trim().min(1).max(160),
  severity: z.nativeEnum(TelemetrySeverity).optional(),
  message: z.string().trim().max(2000).optional(),
  payload: z.unknown().optional(),
  occurredAt: z.string().datetime().optional()
});

function extractClientIp(forwardedForHeader: string | null): string | undefined {
  if (!forwardedForHeader) {
    return undefined;
  }

  const [firstAddress] = forwardedForHeader.split(',');
  const normalizedAddress = firstAddress?.trim();
  return normalizedAddress ? normalizedAddress : undefined;
}

function normalizeOptionalText(value: string | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = desktopTelemetrySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        status: 'invalid_request',
        message: 'Desktop telemetry payload is invalid.'
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const context = await resolveDesktopContextByKeys(parsed.data.product, parsed.data.edition, parsed.data.channel);

  if (!context) {
    return NextResponse.json(
      {
        status: 'combination_not_found',
        message: 'The requested desktop telemetry combination does not exist.'
      },
      { status: 404, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const telemetryEvent = await db.desktopTelemetryEvent.create({
    data: {
      productId: context.product.id,
      editionId: context.edition.id,
      channelId: context.channel.id,
      installationId: normalizeOptionalText(parsed.data.installationId),
      appVersion: parsed.data.appVersion,
      eventType: parsed.data.eventType,
      severity: parsed.data.severity ?? TelemetrySeverity.INFO,
      message: normalizeOptionalText(parsed.data.message),
      payloadJson: parsed.data.payload === undefined ? null : JSON.stringify(parsed.data.payload),
      occurredAt: parsed.data.occurredAt ? new Date(parsed.data.occurredAt) : null,
      ipAddress: extractClientIp(request.headers.get('x-forwarded-for')),
      userAgent: request.headers.get('user-agent') ?? undefined
    }
  });

  return NextResponse.json(
    {
      status: 'accepted',
      telemetryEventId: telemetryEvent.id,
      receivedAt: telemetryEvent.receivedAt.toISOString()
    },
    { status: 202, headers: { 'Cache-Control': 'no-store' } }
  );
}
