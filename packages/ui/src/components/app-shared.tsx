import {
  BarChart3Icon,
  BookOpenIcon,
  BriefcaseIcon,
  CreditCardIcon,
  HelpCircleIcon,
  KeyRoundIcon,
  LayoutGridIcon,
  LibraryIcon,
  PlugIcon,
  ServerIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export type SidebarNavItem = {
  title: string;
  path?: string;
  icon?: ReactNode;
  isActive?: boolean;
  subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
  label?: string;
  items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
  {
    label: "Product",
    items: [
      {
        title: "Dashboard",
        path: "#/dashboard",
        icon: <LayoutGridIcon />,
        isActive: true,
      },
      {
        title: "Analytics",
        path: "#/analytics",
        icon: <BarChart3Icon />,
      },
      {
        title: "Projects",
        path: "#/projects",
        icon: <BriefcaseIcon />,
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      {
        title: "Team",
        path: "#/team",
        icon: <UsersIcon />,
      },
      {
        title: "Integrations",
        path: "#/integrations",
        icon: <PlugIcon />,
      },
      {
        title: "API Keys",
        path: "#/api-keys",
        icon: <KeyRoundIcon />,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Settings",
        icon: <SettingsIcon />,
        subItems: [
          {
            title: "Server",
            path: "/settings/server",
            icon: <ServerIcon />,
          },
          {
            title: "Libraries",
            path: "/settings/libraries",
            icon: <LibraryIcon />,
          },
          {
            title: "Account",
            path: "/settings/account",
            icon: <UserIcon />,
          },
        ],
      },
      {
        title: "Billing",
        path: "#/billing",
        icon: <CreditCardIcon />,
      },
    ],
  },
];

export const footerNavLinks: SidebarNavItem[] = [
  {
    title: "Help Center",
    path: "#/help",
    icon: <HelpCircleIcon />,
  },
  {
    title: "Documentation",
    path: "#/documentation",
    icon: <BookOpenIcon />,
  },
];

export const navLinks: SidebarNavItem[] = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item]
    )
  ),
  ...footerNavLinks,
];
