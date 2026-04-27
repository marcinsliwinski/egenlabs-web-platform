import { z } from 'zod';

const emailEnvSchema = z.object({
  APP_URL: z.string().url().default('http://localhost:3000'),
  APP_NAME: z.string().min(1).default('eGen Labs Web Platform'),
  EMAIL_TRANSPORT_MODE: z.enum(['LOG_ONLY']).default('LOG_ONLY')
});

export const emailEnv = emailEnvSchema.parse({
  APP_URL: process.env.APP_URL,
  APP_NAME: process.env.APP_NAME,
  EMAIL_TRANSPORT_MODE: process.env.EMAIL_TRANSPORT_MODE
});
