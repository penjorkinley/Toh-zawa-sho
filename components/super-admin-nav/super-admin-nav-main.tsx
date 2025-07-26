// components/super-admin-nav/super-admin-nav-main.tsx
"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SuperAdminNavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  const isActiveLink = (url: string) => {
    return pathname === url || pathname.startsWith(url);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Super Admin Panel</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Link key={item.title} href={item.url}>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActiveLink(item.url)}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
