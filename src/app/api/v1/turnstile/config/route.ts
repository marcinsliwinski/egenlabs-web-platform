import { NextResponse } from 'next/server';

import { getPublicTurnstileConfig } from '@/features/turnstile/turnstile-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getPublicTurnstileConfig(), {
    headers: {
      'cache-control': 'no-store, max-age=0'
    }
  });
}
