import { validateLibraryPath } from "@/server/lib/fs/validate-library-path";
import { adminProcedure } from "@/server/procedure/admin.procedure";
import { validateLibraryPathInput } from "../validators";

export const validatePathBase = adminProcedure
  .input(validateLibraryPathInput)
  .errors({
    FAIL_VALIDATE_PATH: {
      status: 500,
    },
  });

export const validatePathHandler = validatePathBase.handler(
  async ({ input, errors }) => {
    try {
      // Résultat structuré : { ok: true, absolutePath } | { ok: false, reason }
      return await validateLibraryPath(input.path);
    } catch {
      throw errors.FAIL_VALIDATE_PATH();
    }
  }
);
