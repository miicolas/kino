import { AppHeader } from "@repo/ui/components/app-header";
import { AppSidebar } from "@repo/ui/components/app-sidebar";
import type { NavUserData } from "@repo/ui/components/nav-user";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";
import { cn } from "@repo/ui/lib/utils";

export function AppShell({
  children,
  user,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  user: NavUserData;
  defaultOpen?: boolean;
}) {
  return (
    <SidebarProvider
      className={cn("[--app-wrapper-max-width:80rem]")}
      defaultOpen={defaultOpen}
    >
      <AppSidebar />
      <SidebarInset>
        <AppHeader user={user} />
        <div
          className={cn(
            "flex flex-1 flex-col p-4 md:p-6",
            "mx-auto w-full max-w-(--app-wrapper-max-width)"
          )}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
