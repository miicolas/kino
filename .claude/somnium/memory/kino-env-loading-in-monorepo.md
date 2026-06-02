---
created_at: 2026-06-02T08:41:25.052526+00:00
updated_at: 2026-06-02T09:04:33.561317+00:00
category: project_memory
source: dream
---

# kino env loading in monorepo

kino env loading in monorepo

**Root cause:** `next dev` runs from `apps/web/`, so Next.js only loads `apps/web/.env*` — it does NOT read the root `.env`. The root `.env` is used by Docker (`docker:up` via `--env-file .env`) and `@repo/contract` drizzle/`db:*` scripts, but is invisible to the Next.js runtime. This caused `process.env.DATABASE_URL` to be `undefined`, producing `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string` from the pg Pool in `packages/contract/src/drizzle/db.ts`.

**Fix applied (symlink — single source of truth):**
```sh
ln -sf ../../.env apps/web/.env.local
```
`apps/web/.env*` is gitignored, so it's safe. Restart the dev server afterwards.

**turbo.json config applied (as of 2026-06-02):**
```jsonc
{
  "globalDependencies": ["**/.env.*local"],
  "globalEnv": ["NODE_ENV", "DATABASE_URL", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL", "TMDB_API_KEY", "AUTH_ALLOWED_HOSTS"],
  "tasks": {
    "build": {
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "env": ["NEXT_PUBLIC_APP_URL"]
    }
  }
}
```

**Task alias fix:** The task was previously named `type-check` in `turbo.json` but all scripts call `check-types` — the alias was dead. Corrected to `check-types`.

**`envMode: strict` (default):** Turborepo filters env passed to tasks — only vars declared in `globalEnv` or per-task `env` are forwarded. Next.js reads its own `.env*` directly (bypassing this), but scripts relying on inherited env are affected. Always declare new runtime secrets in `globalEnv`.
