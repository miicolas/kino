import { z } from "zod";
import type { SetupConfig } from "./setup-types";

// Le formulaire utilise "" comme sentinelle "Aucun" (les <Select> Radix interdisent
// la valeur vide) ; côté serveur, "" est converti en `null` via toServerInput.
export const serverFormSchema = z.object({
  serverName: z.string().trim().min(1, "Nom requis"),
  defaultLanguage: z.enum(["fr", "en"]),
  defaultSubtitleLanguage: z.enum(["", "fr", "en"]),
});

export type ServerFormValues = z.infer<typeof serverFormSchema>;

export function toServerFormValues(config: SetupConfig): ServerFormValues {
  return {
    serverName: config?.serverName ?? "Kino",
    defaultLanguage: config?.defaultLanguage === "en" ? "en" : "fr",
    defaultSubtitleLanguage:
      config?.defaultSubtitleLanguage === "en" ||
      config?.defaultSubtitleLanguage === "fr"
        ? config.defaultSubtitleLanguage
        : "",
  };
}

export function toServerInput(values: ServerFormValues) {
  return {
    serverName: values.serverName,
    defaultLanguage: values.defaultLanguage,
    defaultSubtitleLanguage: values.defaultSubtitleLanguage || null,
  };
}
