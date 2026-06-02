import { call } from "@orpc/server";
import { base } from "@/server/context";

import {
  completeBase,
  completeHandler,
  resetServerBase,
  resetServerHandler,
  saveSetupBase,
  saveSetupHandler,
} from "./mutations";
import {
  getSetupBase,
  getSetupHandler,
  getStatusBase,
  getStatusHandler,
} from "./queries";

export const configRouter = base.router({
  getSetup: getSetupBase.route({ method: "GET" }).handler(({ context }) => {
    return call(getSetupHandler, {}, { context });
  }),
  getStatus: getStatusBase.route({ method: "GET" }).handler(({ context }) => {
    return call(getStatusHandler, {}, { context });
  }),
  saveSetup: saveSetupBase.handler(({ context, input }) => {
    return call(saveSetupHandler, input, { context });
  }),
  complete: completeBase.handler(({ context }) => {
    return call(completeHandler, {}, { context });
  }),
  resetServer: resetServerBase.handler(({ context }) => {
    return call(resetServerHandler, {}, { context });
  }),
});
