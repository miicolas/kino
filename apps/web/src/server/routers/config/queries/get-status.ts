import { protectedProcedure } from "@/server/procedure/protected.procedure";

export const getStatusBase = protectedProcedure.errors({
  FAIL_GET_STATUS: {
    status: 500,
  },
});

export const getStatusHandler = getStatusBase.handler(
  async ({ context, errors }) => {
    try {
      const { db, session } = context;

      const config = await db.query.serverConfig.findFirst();

      return {
        setupCompleted: config?.setupCompletedAt != null,
        isAdmin: session.user.role === "admin",
      };
    } catch (error) {
      throw errors.FAIL_GET_STATUS();
    }
  }
);
