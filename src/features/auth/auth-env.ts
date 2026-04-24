import { z } from 'zod';

const authEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters long'),
  AUTH_SESSION_COOKIE_NAME: z.string().min(1).default('egenlabs_admin_session'),
  AUTH_SESSION_TTL_HOURS: z.coerce.number().int().positive().default(12),
  AUTH_MAX_FAILED_LOGIN_ATTEMPTS: z.coerce.number().int().positive().default(5),
  AUTH_LOCKOUT_MINUTES: z.coerce.number().int().positive().default(15)
});

export const authEnv = authEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_SESSION_COOKIE_NAME: process.env.AUTH_SESSION_COOKIE_NAME,
  AUTH_SESSION_TTL_HOURS: process.env.AUTH_SESSION_TTL_HOURS,
  AUTH_MAX_FAILED_LOGIN_ATTEMPTS: process.env.AUTH_MAX_FAILED_LOGIN_ATTEMPTS,
  AUTH_LOCKOUT_MINUTES: process.env.AUTH_LOCKOUT_MINUTES
});
