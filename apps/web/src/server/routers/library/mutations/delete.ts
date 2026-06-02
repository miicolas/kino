import { ORPCError } from "@orpc/server";
import { libraries } from "@repo/contract/drizzle";
import { eq } from "drizzle-orm";
import { clearScanState } from "@/server/lib/scan/scan-state";
import { adminProcedure } from "@/server/procedure/admin.procedure";
import { deleteLibraryInput } from "../validators";

export const deleteBase = adminProcedure.input(deleteLibraryInput).errors({
  LIBRARY_NOT_FOUND: { status: 404 },
  FAIL_DELETE_LIBRARY: { status: 500 },
});

export const deleteHandler = deleteBase.handler(
  async ({ context, input, errors }) => {
    try {
      const [deleted] = await context.db
        .delete(libraries)
        .where(eq(libraries.id, input.libraryId))
        .returning({ id: libraries.id });

      if (!deleted) {
        throw errors.LIBRARY_NOT_FOUND();
      }

      clearScanState(deleted.id);

      return deleted;
    } catch (error) {
      if (error instanceof ORPCError) {
        throw error;
      }
      throw errors.FAIL_DELETE_LIBRARY();
    }
  }
);
