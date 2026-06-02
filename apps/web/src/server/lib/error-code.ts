import "server-only";

/**
 * Extrait le `code` d'une erreur Node/Postgres (errno comme "ENOENT" / "EACCES",
 * ou code SQLSTATE comme "23505"). Remonte la chaîne `cause` car Drizzle enveloppe
 * l'erreur pg (DrizzleQueryError → cause: DatabaseError). Retourne `undefined` si absent.
 */
export function getErrorCode(error: unknown): string | undefined {
  let current: unknown = error;

  for (let depth = 0; depth < 5 && current != null; depth++) {
    if (typeof current === "object" && "code" in current) {
      const code = (current as { code?: unknown }).code;
      if (typeof code === "string") {
        return code;
      }
    }
    current = (current as { cause?: unknown }).cause;
  }

  return undefined;
}
