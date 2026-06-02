import { resolve } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: resolve(import.meta.dirname, "../../.env") });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/auth/schema.ts",
  out: "./drizzle",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
