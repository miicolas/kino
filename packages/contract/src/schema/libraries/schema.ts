import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "../auth/schema";

export const libraryTypeEnum = pgEnum("library_type", ["movie"]);

export const libraries = pgTable("libraries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  path: text("path").notNull().unique(),
  type: libraryTypeEnum("type").default("movie").notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
