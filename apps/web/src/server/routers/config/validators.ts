import { z } from "zod";

export const setupLanguage = z.enum(["fr", "en"]);

export const saveSetupInput = z.object({
  serverName: z.string().trim().min(1, "Nom requis"),
  defaultLanguage: setupLanguage,
  defaultSubtitleLanguage: setupLanguage.nullable(),
});

export type SaveSetupInput = z.infer<typeof saveSetupInput>;
