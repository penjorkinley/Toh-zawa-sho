// components/super-admin-nav/super-admin-sidebar.tsx
"use client";

import type * as React from "react";
import {
  Shield,
  Building2,
  UserCheck,
  BarChart3,
  Settings,
} from "lucide-react";

import { SuperAdminNavMain } from "./super-admin-nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SuperAdminNavUser } from "./super-admin-nav-user";

// Super Admin navigation data
const data = {
  user: {
    name: "Super Admin",
    email: "admin@tohzawasho.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/super-admin-dashboard/dashboard",
      icon: BarChart3,
      isActive: true,
    },
    {
      title: "Pending Registrations",
      url: "/super-admin-dashboard/pending-registrations",
      icon: UserCheck,
    },
    {
      title: "Restaurants",
      url: "/super-admin-dashboard/restaurants",
      icon: Building2,
    },
  ],
};

export function SuperAdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="bg-background" collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-600 text-white p-2">
            <Shield className="h-6 w-6" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-bold leading-none text-red-600">
              Super Admin
            </span>
            <span className="text-xs text-muted-foreground">
              System Management
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SuperAdminNavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SuperAdminNavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
