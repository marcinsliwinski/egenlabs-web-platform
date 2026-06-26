import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { emailEnv } from '@/features/email/email-env';
import { confirmNewsletterSubscription } from '@/features/forms/newsletter-service';

function extractClientIp(value: string | null) {
  return value?.split(',')[0]?.trim() || undefined;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const tokenValue = formData.get('token');
  const token = typeof tokenValue === 'string' ? tokenValue : '';
  const validToken = token.length >= 32 && token.length <= 256;
  const result = validToken
    ? await confirmNewsletterSubscription({
        token,
        ipAddress: extractClientIp(request.headers.get('x-forwarded-for')),
        userAgent: request.headers.get('user-agent') ?? undefined
      })
    : { status: 'invalid' as const };

  revalidatePath('/admin');
  revalidatePath('/admin/forms');
  revalidatePath('/admin/leads');

  const response = NextResponse.redirect(
    new URL(`/newsletter/confirmation?status=${result.status}`, emailEnv.APP_URL),
    303
  );
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
