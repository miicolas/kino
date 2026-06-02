---
created_at: 2026-06-02T07:43:23.675115+00:00
updated_at: 2026-06-02T08:33:49.956223+00:00
category: project_memory
source: dream
---

# kino server folder structure

kino server folder structure

kino's server folder mirrors pm-os exactly, rooted at `apps/web/src/server/`:

```
server/
├── context.ts                 # oRPC base context
├── procedure/
│   ├── public.procedure.ts
│   ├── protected.procedure.ts  # .use(authMiddleware)
│   ├── org.procedure.ts        # .use(orgMiddleware) — non-functional (org plugin off)
│   └── admin.procedure.ts      # .use(adminMiddleware)
├── middleware/
│   ├── auth.middleware.ts      # session or UNAUTHORIZED
│   ├── org.middleware.ts       # activeOrganizationId or FORBIDDEN — non-functional
│   └── admin.middleware.ts     # role === 'admin' or FORBIDDEN
├── actions/
│   └── sign-out.ts             # server action
└── routers/
    └── _app.ts                 # feature routers mount here
```

**Auth util:** `apps/web/src/lib/auth/utils.ts` → `getServerSession()` (wraps `@repo/contract/auth`)

**Pages constants:** `apps/web/src/constants/page.ts` → `PAGES` object

**oRPC route:** `apps/web/src/app/api/rpc/[[...rest]]/route.ts` — RPCHandler direct (no Elysia)

**To add a feature endpoint:** create `server/routers/<feature>/router.ts` with `protectedProcedure.input(...).handler(...)`, then register in `_app.ts`.

**Note:** `orgProcedure`/`orgMiddleware` are wired but non-functional — the `organization()` plugin is not active in better-auth (kino has `emailAndPassword`, `nextCookies`, `admin` only). Code activates when plugin is re-added.

**Why:** All files implemented to match pm-os patterns during server setup session.
