import { z } from 'zod';

const emailTransportModeSchema = z.enum(['LOG_ONLY', 'BREVO']);
const booleanEnvSchema = z.enum(['true', 'false']).default('true').transform((value) => value === 'true');

const emailEnvSchema = z
  .object({
    APP_URL: z.string().url().default('http://localhost:3000'),
    APP_NAME: z.string().min(1).default('eGen Labs Web Platform'),
    EMAIL_TRANSPORT_MODE: emailTransportModeSchema.default('LOG_ONLY'),
    ENABLE_DOUBLE_OPT_IN: booleanEnvSchema,
    NEWSLETTER_CONFIRMATION_TTL_HOURS: z.coerce.number().int().positive().default(24),
    BREVO_API_BASE_URL: z.string().url().default('https://api.brevo.com/v3'),
    BREVO_API_KEY: z.string().trim().optional(),
    BREVO_SENDER_EMAIL: z.string().trim().email().optional(),
    BREVO_SENDER_NAME: z.string().trim().min(1).optional(),
    BREVO_TIMEOUT_MS: z.coerce.number().int().positive().default(10000)
  })
  .superRefine((value, context) => {
    if (value.EMAIL_TRANSPORT_MODE !== 'BREVO') {
      return;
    }

    if (!value.BREVO_API_KEY || value.BREVO_API_KEY.length < 10) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['BREVO_API_KEY'],
        message: 'BREVO_API_KEY is required when EMAIL_TRANSPORT_MODE=BREVO'
      });
    }

    if (!value.BREVO_SENDER_EMAIL) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['BREVO_SENDER_EMAIL'],
        message: 'BREVO_SENDER_EMAIL is required when EMAIL_TRANSPORT_MODE=BREVO'
      });
    }

    if (!value.BREVO_SENDER_NAME) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['BREVO_SENDER_NAME'],
        message: 'BREVO_SENDER_NAME is required when EMAIL_TRANSPORT_MODE=BREVO'
      });
    }
  });

export const emailEnv = emailEnvSchema.parse({
  APP_URL: process.env.APP_URL,
  APP_NAME: process.env.APP_NAME,
  EMAIL_TRANSPORT_MODE: process.env.EMAIL_TRANSPORT_MODE,
  ENABLE_DOUBLE_OPT_IN: process.env.ENABLE_DOUBLE_OPT_IN,
  NEWSLETTER_CONFIRMATION_TTL_HOURS: process.env.NEWSLETTER_CONFIRMATION_TTL_HOURS,
  BREVO_API_BASE_URL: process.env.BREVO_API_BASE_URL,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
  BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME,
  BREVO_TIMEOUT_MS: process.env.BREVO_TIMEOUT_MS
});
