import { AppShell } from "@repo/ui/components/app-shell";
import { SIDEBAR_COOKIE_NAME } from "@repo/ui/components/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PAGES } from "@/constants/page";
import { getServerSession } from "@/lib/auth/utils";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cookieStore, session] = await Promise.all([
    cookies(),
    getServerSession(),
  ]);

  if (!session) {
    redirect(PAGES.SIGN_IN);
  }

  // Persisted sidebar state — absent or anything but "false" means open.
  const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value !== "false";

  return (
    <AppShell
      defaultOpen={defaultOpen}
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
    >
      {children}
    </AppShell>
  );
}
