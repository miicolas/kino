import { createSearchParamsCache, parseAsStringLiteral } from "nuqs/server";

export const SETUP_STEPS = ["server", "libraries", "summary"] as const;

export type SetupStep = (typeof SETUP_STEPS)[number];

export const setupParsers = {
  step: parseAsStringLiteral(SETUP_STEPS)
    .withDefault("server")
    .withOptions({ history: "push" }),
};

export const setupSearchParamsCache = createSearchParamsCache(setupParsers);
