import { base } from "@/server/context";
import { configRouter } from "./config/router";

export const appRouter = base.router({
  config: configRouter,
});

export type AppRouter = typeof appRouter;
