import { ORPCError } from "@orpc/server";
import { ROLES } from "@/constants";
import { base } from "../context";

export const adminMiddleware = base.middleware(({ context, next }) => {
  const session = (context as { session?: { user: { role: string | null } } })
    .session;

  if (!session || session.user.role !== ROLES.ADMIN) {
    throw new ORPCError("FORBIDDEN");
  }

  return next({ context });
});
