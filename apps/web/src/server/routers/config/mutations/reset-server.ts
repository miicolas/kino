import { libraries, serverConfig } from "@repo/contract/drizzle";
import { clearScanState } from "@/server/lib/scan/scan-state";
import { adminProcedure } from "@/server/procedure/admin.procedure";

export const resetServerBase = adminProcedure.errors({
  FAIL_RESET_SERVER: { status: 500 },
});

export const resetServerHandler = resetServerBase.handler(
  async ({ context, errors }) => {
    const { db } = context;

    try {
      const rows = await db.select({ id: libraries.id }).from(libraries);

      await db.transaction(async (tx) => {
        await tx.delete(libraries);
        await tx.delete(serverConfig);
      });

      for (const { id } of rows) {
        clearScanState(id);
      }

      return { ok: true } as const;
    } catch {
      throw errors.FAIL_RESET_SERVER();
    }
  }
);
