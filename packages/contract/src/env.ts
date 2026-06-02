import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url().optional(),
    // Extra hosts allowed for auth (comma-separated), e.g. the Cloudflare tunnel
    // domain. localhost:3000 is always allowed (see auth.ts).
    AUTH_ALLOWED_HOSTS: z.string().optional(),
    NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
