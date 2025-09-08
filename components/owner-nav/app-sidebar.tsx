// Replace the entire components/owner-nav/app-sidebar.tsx file
import { UtensilsCrossed } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { getSidebarData } from "@/lib/actions/user/actions";

// Navigation items with string icon identifiers instead of components
const navItems = [
  {
    title: "Menu Setup",
    url: "menu-setup",
    icon: "Utensils" as const,
  },
  {
    title: "Tables",
    url: "tables",
    icon: "LayoutGrid" as const,
  },
];

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // Fetch dynamic data
  const sidebarResult = await getSidebarData();

  // Fallback data for error cases
  const fallbackData = {
    businessName: "Your Business",
    businessType: "Restaurant",
    logoUrl: undefined,
    email: "user@example.com",
    initials: "YB",
  };

  const sidebarData = sidebarResult.success
    ? sidebarResult.data!
    : fallbackData;

  // Format business type for display
  const formatBusinessType = (type: string): string => {
    return type
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Sidebar className="bg-background" collapsible="icon" {...props}>
      {/* Header Section - Business Info */}
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          {/* Business Logo/Icon - Always static */}
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground p-2">
            <UtensilsCrossed className="h-6 w-6" />
          </div>

          {/* Business Name and Type */}
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-bold leading-none">
              {sidebarData.businessName}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatBusinessType(sidebarData.businessType)}
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      {/* Footer Section - User Info */}
      <SidebarFooter>
        <NavUser
          user={{
            name: sidebarData.businessName,
            email: sidebarData.email,
            avatar: sidebarData.logoUrl || `/placeholder-avatar.jpg`, // Use dynamic logo with fallback
            initials: sidebarData.initials,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
