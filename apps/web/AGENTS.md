<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:data-fetching-convention -->
## Data Fetching Convention (TanStack Query + Next.js App Router)

Every page follows this three-file pattern:

| File | Role |
|------|------|
| `page.tsx` | Server Component — calls `getQueryClient()`, runs `prefetchQuery()`, wraps with `<HydrateClient>` |
| `page.client.tsx` | `"use client"` — thin boundary, delegates to `_components/` |
| `_components/` | Actual UI components — use `useSuspenseQuery` (data is already hydrated, no loading state) |

### Helpers
- `@/orpc/query/hydration` → `getQueryClient()` + `HydrateClient` (React `cache()`-wrapped, oRPC serializer)
- `@/orpc/client` → `orpc` (TanStack Query utils: `orpc.resource.list.queryOptions(...)`)
- `@/orpc/server` → `api` (server-side direct calls, import side-effect wires `globalThis.$client`)

### page.tsx template
```tsx
import { getQueryClient, HydrateClient } from "@/orpc/query/hydration";
import "@/orpc/server"; // wires globalThis.$client for prefetch
import PageClient from "./page.client";

export default async function Page() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(
      orpc.resource.list.queryOptions({ input: undefined })
    ),
  ]);

  return (
    <HydrateClient client={queryClient}>
      <PageClient />
    </HydrateClient>
  );
}
```

### page.client.tsx template
```tsx
"use client";

import { SomeComponent } from "./_components/some-component";

export default function PageClient() {
  return <SomeComponent />;
}
```

### _components/some-component.tsx template
```tsx
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";

export function SomeComponent() {
  const { data } = useSuspenseQuery(
    orpc.resource.list.queryOptions({ input: undefined })
  );

  return <div>{/* UI */}</div>;
}
```

`orpc.*.*.queryOptions()` generates the `queryKey` automatically — no risk of mismatch between server prefetch and client query.

**Critical:** `queryKey` must be identical between `prefetchQuery` (server) and `useSuspenseQuery` (client) — this is what enables zero loading state on first render.

### Route groups
```
app/
├── layout.tsx              # Root layout — QueryProvider
├── (marketing)/            # Public pages
│   ├── page.tsx
│   ├── page.client.tsx
│   └── _components/
├── (app)/                  # Auth-protected app shell
│   ├── layout.tsx          # Auth check + UI shell
│   └── [feature]/
│       ├── page.tsx
│       ├── page.client.tsx
│       └── _components/
└── (auth)/                 # Auth pages — no TanStack Query prefetch needed
    └── sign-in/page.tsx
```
<!-- END:data-fetching-convention -->

<!-- BEGIN:url-query-state-convention -->
## URL Query State Convention (nuqs)

Use [`nuqs`](https://nuqs.dev) for type-safe URL query state (`?search=`, `?page=`, filters, sort, tabs). Prefer it over `useState` whenever the state should be shareable, bookmarkable, or survive a refresh.

### Setup (already done — global)
`<NuqsAdapter>` (from `nuqs/adapters/next/app`) is mounted in `src/providers/query-provider.tsx`, which wraps the whole app via the root layout. No per-page provider is needed — any `"use client"` component can use the hooks directly.

### Convention: one `search-params.ts` per feature
Colocate a `search-params.ts` next to the feature. Export a named parsers object **and** a `createSearchParamsCache(parsers)`. Import parsers from `nuqs/server` (works in both server and client files).

```ts
// app/(app)/expenses/search-params.ts
import { createSearchParamsCache, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";

export const expensesParsers = {
  search: parseAsString,
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
  sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
};

export const expensesSearchParamsCache = createSearchParamsCache(expensesParsers);
```

### Client components — `useQueryState` / `useQueryStates` (from `nuqs`)
```tsx
"use client";

import { useQueryState, useQueryStates } from "nuqs";
import { expensesParsers } from "../search-params";

export function ExpenseFilters() {
  // single key
  const [search, setSearch] = useQueryState("search", expensesParsers.search);
  // multiple keys
  const [{ page, sortOrder }, setQuery] = useQueryStates(expensesParsers);

  return (
    <input
      value={search ?? ""}
      onChange={(e) => setSearch(e.target.value || null)} // null clears the param
    />
  );
}
```

### Server `page.tsx` — parse the cache, feed the prefetch
Call `cache.parse(await searchParams)` at the top of the async page, then use the typed values to drive `prefetchQuery` so server hydration matches the client query.

```tsx
import type { SearchParams } from "nuqs/server";
import { getQueryClient, HydrateClient } from "@/orpc/query/hydration";
import "@/orpc/server";
import { orpc } from "@/orpc/client";
import { expensesSearchParamsCache } from "./search-params";
import PageClient from "./page.client";

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { page, limit, search } = expensesSearchParamsCache.parse(await searchParams);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    orpc.expenses.list.queryOptions({ input: { page, limit, search } })
  );

  return (
    <HydrateClient client={queryClient}>
      <PageClient />
    </HydrateClient>
  );
}
```

**Rules**
- Parsers live in `nuqs/server`; hooks (`useQueryState`, `useQueryStates`) live in `nuqs`.
- Set a param to `null` to remove it from the URL.
- Keep the parsers object as the single source of truth — reuse it in the client hooks, the cache, and the server query input so all three stay in sync.
<!-- END:url-query-state-convention -->
