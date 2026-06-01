import { os } from "@orpc/server";
import type { db } from "@repo/contract/drizzle";

export type Database = typeof db;

export const base = os.$context<{
  headers: Headers;
  db: Database;
}>();
