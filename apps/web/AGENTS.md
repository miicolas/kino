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
