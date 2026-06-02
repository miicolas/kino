import { adminProcedure } from "@/server/procedure/admin.procedure";

export const getSetupBase = adminProcedure.errors({
  FAIL_GET_SETUP: { status: 500 },
});

export const getSetupHandler = getSetupBase.handler(
  async ({ context, errors }) => {
    try {
      return (await context.db.query.serverConfig.findFirst()) ?? null;
    } catch {
      throw errors.FAIL_GET_SETUP();
    }
  }
);
