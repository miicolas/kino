import { serverConfig } from "@repo/contract/drizzle";
import { adminProcedure } from "@/server/procedure/admin.procedure";
import { saveSetupInput } from "../validators";

export const saveSetupBase = adminProcedure.input(saveSetupInput).errors({
  FAIL_SAVE_SETUP: { status: 500 },
});

export const saveSetupHandler = saveSetupBase.handler(
  async ({ context, input, errors }) => {
    const { db, session } = context;

    try {
      const [config] = await db
        .insert(serverConfig)
        .values({
          singletonKey: "server",
          serverName: input.serverName,
          defaultLanguage: input.defaultLanguage,
          defaultSubtitleLanguage: input.defaultSubtitleLanguage,
          createdBy: session.user.id,
        })
        .onConflictDoUpdate({
          target: serverConfig.singletonKey,
          set: {
            serverName: input.serverName,
            defaultLanguage: input.defaultLanguage,
            defaultSubtitleLanguage: input.defaultSubtitleLanguage,
            updatedAt: new Date(),
          },
        })
        .returning();

      if (!config) {
        throw errors.FAIL_SAVE_SETUP();
      }

      return config;
    } catch {
      throw errors.FAIL_SAVE_SETUP();
    }
  }
);
