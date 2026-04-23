import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    await db.$queryRaw(Prisma.sql`SELECT 1`);

    return NextResponse.json(
      {
        status: 'ok',
        database: 'up',
        timestamp
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed', error);

    return NextResponse.json(
      {
        status: 'degraded',
        database: 'down',
        timestamp
      },
      { status: 503 }
    );
  }
}
