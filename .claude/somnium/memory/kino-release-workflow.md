---
created_at: 2026-06-02T09:19:08.281487+00:00
updated_at: 2026-06-02T09:19:08.281487+00:00
category: project_memory
source: dream
tags: ["ci", "release", "github-actions"]
---

# kino release workflow

kino release workflow

Trigger: `push` on tags matching `v*.*.*`.

**Force-push strategy (from pm-os `deploy-prod.yml`):**
1. Resolve the tag's commit SHA (`git rev-list -n 1 ${{ github.ref }}`)
2. `git checkout -B main <sha>` — rewrites local main to the exact tag commit
3. `git push origin main --force-with-lease` — overwrites remote main even if it diverged from dev

**Guard workflow (`fail-main-merge.yml`):** Blocks any PR that targets `main` directly. `main` must only be updated via a tag-triggered release run — never by a developer PR.

**GitHub branch protection note:** `main` must allow force-pushes by `github-actions[bot]` for the push step to succeed.

**How to release:**
```bash
git tag v0.0.1 && git push origin v0.0.1
```

**Why:** kino's `main` is the prod branch; `dev` is the development branch. Releases should atomically promote dev → main without a merge commit.
