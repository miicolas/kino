---
created_at: 2026-06-02T08:33:50.626225+00:00
updated_at: 2026-06-02T08:33:50.626225+00:00
category: project_memory
source: dream
---

# kino Tailwind source path fix

kino Tailwind source path fix

In `apps/web/src/app/globals.css`, the `@source` directive for `@repo/ui` components must use **4x `../`** (not 3x) to reach the repo root from `apps/web/src/app/`:

```css
/* ✅ correct */
@source "../../../../packages/ui/src/**/*.{ts,tsx}";

/* ❌ wrong — resolves to apps/packages/ui/src which doesn't exist */
@source "../../../packages/ui/src/**/*.{ts,tsx}";
```

Depth: `apps/web/src/app/` → `apps/web/src/` → `apps/web/` → `apps/` → repo root → `packages/ui/src`

**Why:** With the wrong depth, Tailwind never scanned `@repo/ui` component files, so all utility classes used by `Button`, `Input`, `Card`, etc. (`bg-primary`, `border`, `rounded-md`, `h-9`, `px-3`…) were not generated. Components rendered as unstyled HTML.

**How to apply:** After any restructuring that changes the depth of `globals.css`, recount the `../` hops to `packages/ui/src` and update the `@source` directive.
