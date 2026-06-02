import { call } from "@orpc/server";
import { base } from "@/server/context";

import { getStatusBase, getStatusHandler } from "./queries";

export const configRouter = base.router({
  getStatus: getStatusBase.route({ method: "GET" }).handler(({ context }) => {
    return call(getStatusHandler, {}, { context });
  }),
});
