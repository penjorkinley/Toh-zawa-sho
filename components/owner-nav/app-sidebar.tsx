"use client";

import type * as React from "react";
import {
  LayoutGrid,
  ShoppingCart,
  Users,
  Utensils,
  UtensilsCrossed,
} from "lucide-react";

import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Order",
      url: "order",
      icon: ShoppingCart,
      isActive: true,
    },
    {
      title: "Menu Setup",
      url: "menu-setup",
      icon: Utensils,
    },
    {
      title: "Tables",
      url: "tables",
      icon: LayoutGrid,
    },
    {
      title: "Employee",
      url: "employee",
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="bg-background" collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground p-2">
            <UtensilsCrossed className="h-6 w-6 " />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-bold leading-none">Bistro</span>
            <span className="text-xs text-muted-foreground">Fine Dining</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {/* <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <span className="text-sm font-medium">CN</span>
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">{data.user.name}</span>
            <span className="text-xs text-muted-foreground">
              {data.user.email}
            </span>
          </div>
        </div> */}
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
