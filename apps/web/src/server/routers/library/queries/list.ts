import { libraries } from "@repo/contract/drizzle";
import { asc } from "drizzle-orm";
import { getScanState } from "@/server/lib/scan/scan-state";
import { adminProcedure } from "@/server/procedure/admin.procedure";

export const listBase = adminProcedure.errors({
  FAIL_LIST_LIBRARIES: { status: 500 },
});

export const listHandler = listBase.handler(async ({ context, errors }) => {
  try {
    const rows = await context.db.query.libraries.findMany({
      orderBy: asc(libraries.createdAt),
    });

    return rows.map((library) => ({
      ...library,
      scanStatus: getScanState(library.id).status,
    }));
  } catch {
    throw errors.FAIL_LIST_LIBRARIES();
  }
});
