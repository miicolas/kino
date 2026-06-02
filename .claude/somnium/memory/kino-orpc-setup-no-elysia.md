---
created_at: 2026-06-02T07:43:23.403522+00:00
updated_at: 2026-06-02T07:59:33.235986+00:00
category: project_memory
source: dream
tags: ["orpc", "api", "next"]
---

# kino oRPC setup — no Elysia

# kino oRPC setup — no Elysia

Elysia and @elysiajs/eden have been fully removed from kino. The oRPC RPCHandler is mounted directly in a Next.js route handler at `apps/web/src/app/api/rpc/[[...rest]]/route.ts` — identical pattern to pm-os.

Plugins on the handler: `StrictGetMethodPlugin`, `BatchHandlerPlugin`, `onError` interceptor.

`API_RPC_PATH = "/api/rpc"` in `apps/web/src/constants/env.ts`.

Two usage modes:
- **Server-side** (RSC / server actions): `@/orpc/server` via `createRouterClient` — zero HTTP
- **Client-side** (react-query): `@/orpc/client` → `RPCLink` → `/api/rpc`

The old Elysia wrapper (`apps/web/server/server.ts`), the Eden client (`apps/web/src/lib/eden.ts`), and the `api/v1/[[...slugs]]/route.ts` route were all deleted. The `~/*` tsconfig alias (pointing to `../web/server/*`) was also removed.

**Why:** Elysia was purely a pass-through wrapper around RPCHandler with no added value; oRPC's RPCHandler handles fetch Request/Response natively.
