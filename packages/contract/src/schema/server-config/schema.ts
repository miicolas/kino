import { sql } from "drizzle-orm";
import { check, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "../auth/schema";

export const serverConfig = pgTable(
  "server_config",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverName: text("server_name").notNull(),
    defaultLanguage: text("default_language").notNull(),
    defaultSubtitleLanguage: text("default_subtitle_language").notNull(),
    setupCompletedAt: timestamp("setup_completed_at"),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    check("server_config_singleton_check", sql`${table.id} = ${table.id}`),
  ]
);
