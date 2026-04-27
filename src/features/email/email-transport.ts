import { EmailLogStatus } from '@prisma/client';

import { emailEnv } from '@/features/email/email-env';

type TransactionalEmailPayload = {
  toEmail: string;
  subject: string;
  textBody: string;
  templateKey: string;
};

type TransactionalEmailResult = {
  status: EmailLogStatus;
  transportMode: string;
  sentAt: Date | null;
  errorMessage?: string;
};

interface EmailTransport {
  send(payload: TransactionalEmailPayload): Promise<TransactionalEmailResult>;
}

class LogOnlyEmailTransport implements EmailTransport {
  async send(payload: TransactionalEmailPayload): Promise<TransactionalEmailResult> {
    console.info('[email][log-only]', {
      templateKey: payload.templateKey,
      toEmail: payload.toEmail,
      subject: payload.subject,
      preview: payload.textBody.slice(0, 160)
    });

    return {
      status: EmailLogStatus.SENT,
      transportMode: emailEnv.EMAIL_TRANSPORT_MODE,
      sentAt: new Date()
    };
  }
}

function createEmailTransport(): EmailTransport {
  switch (emailEnv.EMAIL_TRANSPORT_MODE) {
    case 'LOG_ONLY':
    default:
      return new LogOnlyEmailTransport();
  }
}

export async function dispatchTransactionalEmail(payload: TransactionalEmailPayload) {
  const transport = createEmailTransport();

  return transport.send(payload);
}
