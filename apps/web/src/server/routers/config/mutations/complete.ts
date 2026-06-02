import { ORPCError } from "@orpc/server";
import { libraries, serverConfig } from "@repo/contract/drizzle";
import { eq } from "drizzle-orm";
import { getScanState } from "@/server/lib/scan/scan-state";
import { adminProcedure } from "@/server/procedure/admin.procedure";

export const completeBase = adminProcedure.errors({
  SERVER_CONFIG_NOT_FOUND: { status: 400 },
  NO_LIBRARY: { status: 400 },
  SCANS_PENDING: { status: 400 },
  FAIL_COMPLETE_SETUP: { status: 500 },
});

export const completeHandler = completeBase.handler(
  async ({ context, errors }) => {
    const { db } = context;

    try {
      const [config, rows] = await Promise.all([
        db.query.serverConfig.findFirst(),
        db.select({ id: libraries.id }).from(libraries),
      ]);

      if (!config) {
        throw errors.SERVER_CONFIG_NOT_FOUND();
      }

      if (rows.length === 0) {
        throw errors.NO_LIBRARY();
      }

      if (rows.some(({ id }) => getScanState(id).status !== "completed")) {
        throw errors.SCANS_PENDING();
      }

      const setupCompletedAt = new Date();

      await db
        .update(serverConfig)
        .set({ setupCompletedAt })
        .where(eq(serverConfig.id, config.id));

      return { setupCompletedAt };
    } catch (error) {
      if (error instanceof ORPCError) {
        throw error;
      }
      throw errors.FAIL_COMPLETE_SETUP();
    }
  }
);
