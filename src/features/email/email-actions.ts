'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { logAdminAuditEvent } from '@/features/audit/audit-service';
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
  const admin = await requireAdminWriteAccess();

  const parsedInput = resendEmailLogSchema.safeParse({
    emailLogId: formData.get('emailLogId')
  });

  if (!parsedInput.success) {
    redirectWithStatus('invalid_resend_request', 'error');
  }

  const resendResult = await resendTransactionalEmailLog(parsedInput.data.emailLogId);

  if (!resendResult.success) {
    await logAdminAuditEvent({
      admin,
      actionType: 'EMAIL_RESEND_REJECTED',
      entityType: 'EmailLog',
      entityId: parsedInput.data.emailLogId,
      summary: `Rejected transactional email resend for log ${parsedInput.data.emailLogId}.`,
      metadata: { reason: resendResult.reason }
    });

    redirectWithStatus(resendResult.reason, 'error');
  }

  await logAdminAuditEvent({
    admin,
    actionType: 'EMAIL_RESEND_REQUESTED',
    entityType: 'EmailLog',
    entityId: parsedInput.data.emailLogId,
    summary: `Resent transactional email log ${parsedInput.data.emailLogId}.`,
    metadata: { resultStatus: resendResult.status }
  });

  revalidatePath(ADMIN_EMAILS_PATH);
  revalidatePath('/admin');

  redirectWithStatus(resendResult.status === 'SENT' ? 'email_resent' : 'email_resend_failed', resendResult.status === 'SENT' ? 'success' : 'error');
}
