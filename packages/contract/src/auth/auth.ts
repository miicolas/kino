import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { db } from "../drizzle/db";
import { env } from "../env";

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
});
