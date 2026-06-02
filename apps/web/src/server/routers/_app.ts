import { base } from "@/server/context";
import { configRouter } from "./config/router";
import { libraryRouter } from "./library/router";

export const appRouter = base.router({
  config: configRouter,
  library: libraryRouter,
});

export type AppRouter = typeof appRouter;
