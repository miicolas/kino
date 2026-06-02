import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env"),
});

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/**/schema.ts",
  out: "./drizzle",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
