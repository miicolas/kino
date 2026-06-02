import type { User } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { count } from "drizzle-orm";
import { db } from "../drizzle/db";
import { env } from "../env";
import { user } from "../schema/auth/schema";

function getAllowedHosts(): string[] {
  const hosts = ["localhost:3000"];
  const extra = env.AUTH_ALLOWED_HOSTS;
  if (extra) {
    hosts.push(
      ...extra
        .split(",")
        .map((host) => host.trim())
        .filter(Boolean)
    );
  }
  return hosts;
}

export const auth = betterAuth({
  baseURL: {
    allowedHosts: getAllowedHosts(),
    protocol: "auto",
  },
  trustedProxyHeaders: true,
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [nextCookies(), admin({ defaultRole: "user" })],
  databaseHooks: {
    user: {
      create: {
        before: async (newUser: User) => {
          const [row] = await db.select({ count: count() }).from(user);
          const isFirstUser = (row?.count ?? 0) === 0;

          return {
            data: {
              ...newUser,
              role: isFirstUser ? "admin" : "user",
            },
          };
        },
      },
    },
  },
});
