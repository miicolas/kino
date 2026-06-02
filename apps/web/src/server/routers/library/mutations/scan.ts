import { libraries } from "@repo/contract/drizzle";
import { eq } from "drizzle-orm";
import { getScanState, startScan } from "@/server/lib/scan/scan-state";
import { adminProcedure } from "@/server/procedure/admin.procedure";
import { scanLibraryInput } from "../validators";

export const scanBase = adminProcedure.input(scanLibraryInput).errors({
  LIBRARY_NOT_FOUND: { status: 404 },
});

export const scanHandler = scanBase.handler(
  async ({ context, input, errors }) => {
    const { db } = context;

    const library = await db.query.libraries.findFirst({
      where: eq(libraries.id, input.libraryId),
    });

    if (!library) {
      throw errors.LIBRARY_NOT_FOUND();
    }

    // Stub : démarre le scan in-memory. Le vrai pipeline (Sprint 2) se branche ici.
    startScan(input.libraryId);

    return getScanState(input.libraryId);
  }
);
