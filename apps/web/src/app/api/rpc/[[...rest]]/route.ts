import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import {
  BatchHandlerPlugin,
  StrictGetMethodPlugin,
} from "@orpc/server/plugins";
import { db } from "@repo/contract/drizzle";
import { appRouter } from "@/server/routers/_app";

const handler = new RPCHandler(appRouter, {
  plugins: [new StrictGetMethodPlugin(), new BatchHandlerPlugin()],
  interceptors: [
    onError((error) => {
      console.error("[oRPC Error]", error);
    }),
  ],
});

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/api/rpc",
    context: {
      headers: request.headers,
      db,
    },
  });

  return response ?? new Response("Not Found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
