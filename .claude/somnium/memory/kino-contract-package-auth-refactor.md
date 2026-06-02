---
created_at: 2026-06-02T07:43:24.223634+00:00
updated_at: 2026-06-02T08:33:49.644847+00:00
category: project_memory
source: dream
---

# kino contract package auth refactor

kino contract package auth refactor

Auth instance and schema tables are cleanly separated in `packages/contract`:

```
src/
├── auth/                      ← runtime config (betterAuth instance)
│   ├── auth.ts                ← betterAuth({ adapter, plugins })
│   └── index.ts               ← export { auth }
├── schema/
│   └── auth/                  ← data model only (tables)
│       ├── schema.ts          ← pgTable definitions (CLI-generated)
│       ├── relations.ts       ← drizzle v0 relations() (manual)
│       ├── types.ts           ← $inferSelect types
│       └── index.ts           ← export * from all three
└── drizzle/
    ├── db.ts                  ← drizzle(pool, { schema, casing: 'snake_case' })
    └── index.ts
```

**package.json exports:**
- `./auth` → `./src/auth/index.ts` (instance)
- `./drizzle` → `./src/drizzle/index.ts`
- `./schema` → `./src/schema/index.ts`

**`auth:generate` script:** `--output src/schema/auth/schema.ts` — after running, strip the `relations()` blocks the CLI emits from `schema.ts` (they duplicate `relations.ts` and cause double-export errors).

**`drizzle.config.ts`:** schema path is `./src/schema/auth/schema.ts`

**Why:** Separating instance from tables makes the barrel `../schema` tables-only, which was needed to break the circular reference `db → schema → auth → db` (TS7022).
