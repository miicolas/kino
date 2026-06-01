import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { BatchHandlerPlugin, StrictGetMethodPlugin } from "@orpc/server/plugins";
import { db } from "@repo/contract/drizzle";
import { Elysia } from "elysia";
import { appRouter } from "../src/server/routers/_app";

const rpcHandler = new RPCHandler(appRouter, {
  plugins: [new StrictGetMethodPlugin(), new BatchHandlerPlugin()],
  interceptors: [
    onError((error) => {
      console.error("[oRPC Error]", error);
    }),
  ],
});

export const router = new Elysia({ name: "router" })
  .all(
    "/rpc*",
    async ({ request }: { request: Request }) => {
      const { response } = await rpcHandler.handle(request, {
        prefix: "/api/rpc",
        context: {
          headers: request.headers,
          db,
        },
      });

      return response ?? new Response("Not Found", { status: 404 });
    },
    { parse: "none" }
  );
