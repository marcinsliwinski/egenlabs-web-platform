import { EmailLogStatus } from '@prisma/client';

import { emailEnv } from '@/features/email/email-env';

type TransactionalEmailPayload = {
  toEmail: string;
  subject: string;
  textBody: string;
  htmlBody: string;
  templateKey: string;
};

export type TransactionalEmailResult = {
  status: EmailLogStatus;
  transportMode: string;
  sentAt: Date | null;
  providerName?: string;
  providerMessageId?: string;
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
      bodyPreview: '[transactional email body omitted]'
    });

    return {
      status: EmailLogStatus.SENT,
      transportMode: 'LOG_ONLY',
      sentAt: new Date()
    };
  }
}

class BrevoEmailTransport implements EmailTransport {
  async send(payload: TransactionalEmailPayload): Promise<TransactionalEmailResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), emailEnv.BREVO_TIMEOUT_MS);

    try {
      const response = await fetch(`${emailEnv.BREVO_API_BASE_URL}/smtp/email`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': emailEnv.BREVO_API_KEY!,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            email: emailEnv.BREVO_SENDER_EMAIL!,
            name: emailEnv.BREVO_SENDER_NAME!
          },
          to: [
            {
              email: payload.toEmail
            }
          ],
          subject: payload.subject,
          textContent: payload.textBody,
          htmlContent: payload.htmlBody,
          tags: ['egenlabs-web-platform', payload.templateKey.toLowerCase()]
        }),
        signal: controller.signal,
        cache: 'no-store'
      });

      const rawResponse = await response.text();
      const parsedResponse = rawResponse ? safeJsonParse(rawResponse) : null;

      if (!response.ok) {
        return {
          status: EmailLogStatus.FAILED,
          transportMode: 'BREVO',
          providerName: 'Brevo',
          sentAt: null,
          errorMessage: buildBrevoErrorMessage(response.status, parsedResponse, rawResponse)
        };
      }

      return {
        status: EmailLogStatus.SENT,
        transportMode: 'BREVO',
        providerName: 'Brevo',
        providerMessageId: getBrevoMessageId(parsedResponse),
        sentAt: new Date()
      };
    } catch (error) {
      return {
        status: EmailLogStatus.FAILED,
        transportMode: 'BREVO',
        providerName: 'Brevo',
        sentAt: null,
        errorMessage: error instanceof Error ? error.message : 'Unknown Brevo transport error.'
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function getBrevoMessageId(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return undefined;
  }

  const candidate = Reflect.get(payload, 'messageId');

  return typeof candidate === 'string' && candidate.length > 0 ? candidate : undefined;
}

function buildBrevoErrorMessage(statusCode: number, parsedResponse: unknown, rawResponse: string) {
  if (parsedResponse && typeof parsedResponse === 'object') {
    const message = Reflect.get(parsedResponse, 'message');

    if (typeof message === 'string' && message.length > 0) {
      return `Brevo API ${statusCode}: ${message}`;
    }
  }

  const trimmedResponse = rawResponse.trim();

  if (trimmedResponse.length > 0) {
    return `Brevo API ${statusCode}: ${trimmedResponse.slice(0, 500)}`;
  }

  return `Brevo API ${statusCode}: request failed without an error body.`;
}

function createEmailTransport(): EmailTransport {
  switch (emailEnv.EMAIL_TRANSPORT_MODE) {
    case 'BREVO':
      return new BrevoEmailTransport();
    case 'LOG_ONLY':
    default:
      return new LogOnlyEmailTransport();
  }
}

export async function dispatchTransactionalEmail(payload: TransactionalEmailPayload) {
  const transport = createEmailTransport();

  return transport.send(payload);
}
