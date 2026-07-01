import { z } from 'zod';

const booleanString = z.enum(['true', 'false']).default('false').transform((value) => value === 'true');

const turnstileEnvSchema = z
  .object({
    APP_URL: z.string().url().default('http://localhost:3000'),
    TURNSTILE_ENABLED: booleanString,
    TURNSTILE_SITE_KEY: z.string().trim().optional(),
    TURNSTILE_SECRET_KEY: z.string().trim().optional(),
    TURNSTILE_VERIFY_URL: z
      .string()
      .url()
      .default('https://challenges.cloudflare.com/turnstile/v0/siteverify'),
    TURNSTILE_TIMEOUT_MS: z.coerce.number().int().positive().max(30000).default(5000),
    TURNSTILE_TOKEN_MAX_AGE_SECONDS: z.coerce.number().int().positive().max(300).default(300),
    TURNSTILE_CLOCK_SKEW_SECONDS: z.coerce.number().int().nonnegative().max(120).default(30)
  })
  .superRefine((value, context) => {
    if (!value.TURNSTILE_ENABLED) {
      return;
    }

    if (!value.TURNSTILE_SITE_KEY) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['TURNSTILE_SITE_KEY'],
        message: 'TURNSTILE_SITE_KEY is required when TURNSTILE_ENABLED=true'
      });
    }

    if (!value.TURNSTILE_SECRET_KEY) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['TURNSTILE_SECRET_KEY'],
        message: 'TURNSTILE_SECRET_KEY is required when TURNSTILE_ENABLED=true'
      });
    }
  });

export const turnstileEnv = turnstileEnvSchema.parse({
  APP_URL: process.env.APP_URL,
  TURNSTILE_ENABLED: process.env.TURNSTILE_ENABLED,
  TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  TURNSTILE_VERIFY_URL: process.env.TURNSTILE_VERIFY_URL,
  TURNSTILE_TIMEOUT_MS: process.env.TURNSTILE_TIMEOUT_MS,
  TURNSTILE_TOKEN_MAX_AGE_SECONDS: process.env.TURNSTILE_TOKEN_MAX_AGE_SECONDS,
  TURNSTILE_CLOCK_SKEW_SECONDS: process.env.TURNSTILE_CLOCK_SKEW_SECONDS
});
