---
created_at: 2026-06-02T08:52:55.499810+00:00
updated_at: 2026-06-02T09:04:34.054941+00:00
category: project_memory
source: dream
---

# kino is single-origin (port 3000), docker is web-only

kino is single-origin (port 3000), docker is web-only

After the Elysia → oRPC migration, kino is **single-origin**: the entire app (UI + oRPC API + better-auth) runs in one Next.js process on **port 3000**. There is no separate API/server process. `apps/server` never existed in the new architecture.

**better-auth "Invalid origin" gotcha (fixed 2026-06-02):** better-auth derives its trusted origin from `BETTER_AUTH_URL`. The old value (`http://localhost:3001/` — Elysia legacy) rejected every auth request from `:3000`. Rule: `BETTER_AUTH_URL` must equal the app origin (`NEXT_PUBLIC_APP_URL`). No trailing slash. Now also solved via dynamic `baseURL.allowedHosts` — see [[kino auth: dynamic baseURL + typed env in contract]].

**`.env` cleanup (2026-06-02):** removed stale URL vars. Canonical set: `NEXT_PUBLIC_APP_URL` + `BETTER_AUTH_URL` (both `http://localhost:3000`). Dropped `APP_URL`, `SERVER_URL`, `NEXT_PUBLIC_SERVER_URL`, `AUTH_SECRET` (duplicate of `BETTER_AUTH_SECRET`).

**Docker (`docker/docker-compose.yml`) is web-only (as of 2026-06-02):** the `server` service (port 3001, `Dockerfile.server`) was deleted along with `Dockerfile.server` itself — it built non-existent `apps/server`. Services: `postgres`, `migrate`, `web`, `cloudflared` (behind the `remote` profile). The `web` service carries `DATABASE_URL`, `BETTER_AUTH_SECRET/URL`, `AUTH_ALLOWED_HOSTS`, `TMDB_API_KEY` and the media volumes. `migrate` builds `Dockerfile.web` at `target: source` (a source-only stage so migrations run without a full Next build).
