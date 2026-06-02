import { call } from "@orpc/server";
import { base } from "@/server/context";
import {
  createBase,
  createHandler,
  deleteBase,
  deleteHandler,
  scanBase,
  scanHandler,
} from "./mutations";
import {
  listBase,
  listDirectoriesBase,
  listDirectoriesHandler,
  listHandler,
  validatePathBase,
  validatePathHandler,
} from "./queries";

export const libraryRouter = base.router({
  list: listBase.route({ method: "GET" }).handler(({ context }) => {
    return call(listHandler, {}, { context });
  }),
  validatePath: validatePathBase.handler(({ context, input }) => {
    return call(validatePathHandler, input, { context });
  }),
  listDirectories: listDirectoriesBase
    .route({ method: "GET" })
    .handler(({ context, input }) => {
      return call(listDirectoriesHandler, input, { context });
    }),
  create: createBase.handler(({ context, input }) => {
    return call(createHandler, input, { context });
  }),
  delete: deleteBase.handler(({ context, input }) => {
    return call(deleteHandler, input, { context });
  }),
  scan: scanBase.handler(({ context, input }) => {
    return call(scanHandler, input, { context });
  }),
});
