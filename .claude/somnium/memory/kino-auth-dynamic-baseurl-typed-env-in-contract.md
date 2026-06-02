---
created_at: 2026-06-02T09:02:38.422093+00:00
updated_at: 2026-06-02T09:04:34.505322+00:00
category: project_memory
source: dream
---

# kino auth: dynamic baseURL + typed env in contract

kino auth: dynamic baseURL + typed env in contract

**Typed env (mirrors pm-os's `env.ts`, adapted to the monorepo split).** Because `apps/web` imports FROM `@repo/contract` (never the reverse), the single typed env lives in the shared package: `packages/contract/src/env.ts` using **`@t3-oss/env-core`** (NOT `env-nextjs` — contract is a plain TS package, env-nextjs would break outside Next) + zod. Validates `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL?`, `AUTH_ALLOWED_HOSTS?`, `NODE_ENV?` with `emptyStringAsUndefined: true`, `runtimeEnv: process.env`. Exported as `@repo/contract/env`. Consumed by `auth.ts` (`env.AUTH_ALLOWED_HOSTS`, `env.BETTER_AUTH_SECRET`) and `drizzle/db.ts` (`env.DATABASE_URL`). `drizzle.config.ts` still reads `process.env.DATABASE_URL` directly (loads its own dotenv), so the `migrate` container never triggers full env validation.

**Dynamic baseURL (better-auth 1.6.13 native API, added 2026-06-02):**
```ts
// packages/contract/src/auth/auth.ts
function getAllowedHosts(): string[] {
  const base = ["localhost:3000"];
  const extra = env.AUTH_ALLOWED_HOSTS?.split(",").map(h => h.trim()).filter(Boolean) ?? [];
  return [...base, ...extra];
}
export const auth = betterAuth({
  baseURL: { allowedHosts: getAllowedHosts(), protocol: "auto" },
  trustedProxyHeaders: true,  // honors x-forwarded-host from Cloudflare tunnel
  ...
});
```
- `allowedHosts` is auto-added to `trustedOrigins` by better-auth.
- `protocol: "auto"` → http locally, https via tunnel, derived per-request.
- `trustedProxyHeaders: true` → required for Cloudflare to pass the real host; safe because bounded by `allowedHosts`.

**Auth client (`apps/web/src/lib/auth-client.ts`):** NO `baseURL` → uses `window.location.origin` automatically (critical for Cloudflare tunnel — hardcoded localhost would break it). `organizationClient` plugin removed (org plugin is off server-side, no usages anywhere).

**`AUTH_ALLOWED_HOSTS`** added to `.env`, `.env.example`, and `turbo.json` `globalEnv` (strict mode). To allow Cloudflare tunnel access: `AUTH_ALLOWED_HOSTS=kino.yourdomain.com`. Multiple hosts comma-separated.
