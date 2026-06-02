import { listDirectories } from "@/server/lib/fs/list-directories";
import { adminProcedure } from "@/server/procedure/admin.procedure";
import { listDirectoriesInput } from "../validators";

export const listDirectoriesBase = adminProcedure
  .input(listDirectoriesInput)
  .errors({
    INVALID_DIRECTORY: {
      status: 400,
    },
    FAIL_LIST_DIRECTORIES: {
      status: 500,
    },
  });

export const listDirectoriesHandler = listDirectoriesBase.handler(
  async ({ input, errors }) => {
    let result: Awaited<ReturnType<typeof listDirectories>>;

    try {
      result = await listDirectories(input.path);
    } catch {
      throw errors.FAIL_LIST_DIRECTORIES();
    }

    if (!result.ok) {
      throw errors.INVALID_DIRECTORY({ message: result.reason });
    }

    return { entries: result.entries };
  }
);
