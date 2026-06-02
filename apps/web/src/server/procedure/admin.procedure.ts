import { adminMiddleware } from "../middleware/admin.middleware";
import { protectedProcedure } from "./protected.procedure";

export const adminProcedure = protectedProcedure.use(adminMiddleware);
