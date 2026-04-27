'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { resendTransactionalEmailLog } from '@/features/email/email-service';

const ADMIN_EMAILS_PATH = '/admin/emails';

const resendEmailLogSchema = z.object({
  emailLogId: z.string().min(1, 'emailLogId is required')
});

function redirectWithStatus(status: string, kind: 'success' | 'error'): never {
  redirect(`${ADMIN_EMAILS_PATH}?${kind}=${status}`);
}

async function requireAdminWriteAccess() {
  const admin = await requireAuthenticatedAdmin();

  if (admin.role !== 'ADMIN') {
    redirectWithStatus('forbidden', 'error');
  }

  return admin;
}

export async function resendEmailLogAction(formData: FormData) {
  await requireAdminWriteAccess();

  const parsedInput = resendEmailLogSchema.safeParse({
    emailLogId: formData.get('emailLogId')
  });

  if (!parsedInput.success) {
    redirectWithStatus('invalid_resend_request', 'error');
  }

  const resendResult = await resendTransactionalEmailLog(parsedInput.data.emailLogId);

  revalidatePath(ADMIN_EMAILS_PATH);
  revalidatePath('/admin');

  if (!resendResult.success) {
    redirectWithStatus('email_log_not_found', 'error');
  }

  redirectWithStatus(resendResult.status === 'SENT' ? 'email_resent' : 'email_resend_failed', resendResult.status === 'SENT' ? 'success' : 'error');
}
