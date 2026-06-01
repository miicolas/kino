import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { APP_URL } from "@/constants/env";

export const authClient = createAuthClient({
  baseURL: APP_URL,
  plugins: [adminClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
