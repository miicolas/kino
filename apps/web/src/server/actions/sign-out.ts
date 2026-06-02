"use server";

import { auth } from "@repo/contract/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PAGES } from "@/constants/page";

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
  revalidatePath(PAGES.SIGN_IN);
  redirect(PAGES.SIGN_IN);
}
