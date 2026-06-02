import { AppBreadcrumbs } from "@repo/ui/components/app-breadcrumbs";
import { navLinks } from "@repo/ui/components/app-shared";
import { Button } from "@repo/ui/components/button";
import { CustomSidebarTrigger } from "@repo/ui/components/custom-sidebar-trigger";
import { DecorIcon } from "@repo/ui/components/decor-icon";
import { NavUser, type NavUserData } from "@repo/ui/components/nav-user";
import { Separator } from "@repo/ui/components/separator";
import { cn } from "@repo/ui/lib/utils";
import { BellIcon, SendIcon } from "lucide-react";

const activeItem = navLinks.find((item) => item.isActive);

export function AppHeader({ user }: { user: NavUserData }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 md:px-6",
        "bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50"
      )}
    >
      <DecorIcon className="hidden md:block" position="bottom-left" />
      <div className="flex items-center gap-3">
        <CustomSidebarTrigger />
        <Separator
          className="mr-2 h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <AppBreadcrumbs page={activeItem} />
      </div>
      <div className="flex items-center gap-3">
        <Button size="icon-sm" variant="outline">
          <SendIcon />
        </Button>
        <Button aria-label="Notifications" size="icon-sm" variant="outline">
          <BellIcon />
        </Button>
        <Separator
          className="h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <NavUser user={user} />
      </div>
    </header>
  );
}
