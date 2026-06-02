import { AppHeader } from "@repo/ui/components/app-header";
import { AppSidebar } from "@repo/ui/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";
import { cn } from "@repo/ui/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className={cn("[--app-wrapper-max-width:80rem]")}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
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
