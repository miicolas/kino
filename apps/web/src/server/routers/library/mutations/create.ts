import { libraries } from "@repo/contract/drizzle";
import { getErrorCode } from "@/server/lib/error-code";
import {
  type PathValidationFailureReason,
  validateLibraryPath,
} from "@/server/lib/fs/validate-library-path";
import { adminProcedure } from "@/server/procedure/admin.procedure";
import { createLibraryInput } from "../validators";

export const createBase = adminProcedure.input(createLibraryInput).errors({
  PATH_OUTSIDE_ROOT: { status: 400 },
  PATH_NOT_FOUND: { status: 400 },
  PATH_NOT_A_DIRECTORY: { status: 400 },
  PATH_NOT_READABLE: { status: 400 },
  LIBRARY_PATH_ALREADY_EXISTS: { status: 409 },
  FAIL_CREATE_LIBRARY: { status: 500 },
});

const REASON_TO_ERROR: Record<
  PathValidationFailureReason,
  | "PATH_OUTSIDE_ROOT"
  | "PATH_NOT_FOUND"
  | "PATH_NOT_A_DIRECTORY"
  | "PATH_NOT_READABLE"
> = {
  OUTSIDE_ROOT: "PATH_OUTSIDE_ROOT",
  NOT_FOUND: "PATH_NOT_FOUND",
  NOT_A_DIRECTORY: "PATH_NOT_A_DIRECTORY",
  NOT_READABLE: "PATH_NOT_READABLE",
};

export const createHandler = createBase.handler(
  async ({ context, input, errors }) => {
    const { db, session } = context;

    let validation: Awaited<ReturnType<typeof validateLibraryPath>>;
    try {
      validation = await validateLibraryPath(input.path);
    } catch {
      throw errors.FAIL_CREATE_LIBRARY();
    }

    if (!validation.ok) {
      throw errors[REASON_TO_ERROR[validation.reason]]();
    }

    // 2. Insert avec le chemin absolu canonique (contrainte UNIQUE fiable).
    try {
      const [created] = await db
        .insert(libraries)
        .values({
          name: input.name,
          path: validation.absolutePath,
          type: input.type,
          createdBy: session.user.id,
        })
        .returning();

      return created;
    } catch (error) {
      // 23505 = violation de contrainte UNIQUE Postgres (path déjà utilisé).
      if (getErrorCode(error) === "23505") {
        throw errors.LIBRARY_PATH_ALREADY_EXISTS();
      }
      throw errors.FAIL_CREATE_LIBRARY();
    }
  }
);
