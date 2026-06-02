import { ORPCError } from "@orpc/server";
import { base } from "../context";

export const adminMiddleware = base.middleware(({ context, next }) => {
  const session = (context as { session?: { user: { role: string | null } } })
    .session;

  if (!session || session.user.role !== "admin") {
    throw new ORPCError("FORBIDDEN");
  }

  return next({ context });
});
