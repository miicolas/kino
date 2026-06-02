import "server-only";
import path from "node:path";

export function getMediaRoot(): string {
  const raw = process.env.MEDIA_ROOT;

  if (!raw) {
    throw new Error(
      "MEDIA_ROOT n'est pas défini. Configurez-le (ex: /media en Docker, un dossier absolu en local)."
    );
  }

  return path.resolve(raw);
}
