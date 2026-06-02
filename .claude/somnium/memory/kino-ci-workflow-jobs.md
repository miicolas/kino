---
created_at: 2026-06-02T09:19:08.747786+00:00
updated_at: 2026-06-02T09:24:22.469544+00:00
category: project_memory
source: dream
tags: ["ci", "turborepo", "github-actions"]
---

# kino CI workflow jobs

kino CI workflow: single Turborepo-aligned job

The `.github/workflows/ci.yml` has **one job** (`ci`) following Turborepo's CI recommendations:
- `actions/checkout` with `fetch-depth: 2`
- `bun install`
- Cache `.turbo` via `actions/cache`
- Step: **Lint & format** → `bun run check` (ultracite/biome)
- Step: **Type check** → `bun run check-types` (turbo run check-types, cached via .tsbuildinfo)
- `TURBO_TOKEN` (secret) + `TURBO_TEAM` (var) wired at workflow level for remote caching (optional — falls back to local cache if unset)
- `timeout-minutes: 15`

**Why:** Previously had 3 separate jobs (Lint, Format, Type Check) each reinstalling deps; Turborepo docs recommend one job with turbo orchestrating tasks. Lint and Format were identical (`ultracite check`) so they were merged.

**How to apply:** Don't split CI into per-task jobs — let turbo parallelize. If adding a new check task, add it to `turbo.json` pipeline and add a step here.
