import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { BatchLinkPlugin, DedupeRequestsPlugin } from "@orpc/client/plugins";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { appRouter } from "@/server/routers/_app";
import { API_RPC_PATH } from "@/constants/env";

declare global {
  // eslint-disable-next-line no-var
  var $client: RouterClient<typeof appRouter> | undefined;
}

const GET_METHOD_REGEX = /^(?:get|find|list|search)(?:[A-Z].*)?$/;

const link = new RPCLink({
  url: () => {
    if (typeof window === "undefined") {
      throw new Error("RPCLink is not allowed on the server side.");
    }
    return `${window.location.origin}${API_RPC_PATH}`;
  },
  method: (_options, path) => {
    const last = path.at(-1);
    if (last && GET_METHOD_REGEX.test(last)) {
      return "GET";
    }
    return "POST";
  },
  plugins: [
    new DedupeRequestsPlugin({
      filter: ({ request }) => request.method === "GET",
      groups: [{ condition: () => true, context: {} }],
    }),
    new BatchLinkPlugin({
      groups: [{ condition: () => true, context: {} }],
    }),
  ],
});

export const orpcClient: RouterClient<typeof appRouter> =
  globalThis.$client ?? createORPCClient(link);

export const orpc = createTanstackQueryUtils(orpcClient);
