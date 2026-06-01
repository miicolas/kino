import "server-only";

import { createRouterClient } from "@orpc/server";
import { db } from "@repo/contract/drizzle";
import { headers } from "next/headers";
import { appRouter } from "@/server/routers/_app";

globalThis.$client = createRouterClient(appRouter, {
  context: async () => ({
    headers: await headers(),
    db,
  }),
});

export const api = createRouterClient(appRouter, {
  context: async () => ({
    headers: await headers(),
    db,
  }),
});
