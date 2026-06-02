---
created_at: 2026-06-02T09:24:23.193545+00:00
updated_at: 2026-06-02T09:24:23.193545+00:00
category: project_memory
source: dream
tags: ["dx", "tooling", "scripts"]
---

# kino precommit scripts

kino root package.json precommit scripts

```json
"precommit":     "bun run check && bun run check-types",
"precommit:fix": "bun run fix && bun run check-types"
```

- `bun run precommit` — gates lint/format (ultracite) + TypeScript (turbo). Use before committing.
- `bun run precommit:fix` — auto-corrects format/lint issues then checks types. Useful to fix the 200+ pre-existing biome warnings in one shot.

**Why:** CI does the same checks; precommit lets devs catch failures locally without pushing.

**How to apply:** Run `bun run precommit` before any commit or PR. If it fails on format, run `bun run precommit:fix` first.
