// Replace the entire components/owner-nav/nav-main.tsx file
"use client";

import { Utensils, LayoutGrid, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Icon mapping for string identifiers
const iconMap: Record<string, LucideIcon> = {
  Utensils,
  LayoutGrid,
};

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: string | LucideIcon; // Accept both string and LucideIcon for flexibility
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  const isActiveLink = (url: string) => {
    return pathname.split("/")[2] === url;
  };

  // Helper function to resolve icon
  const getIconComponent = (icon: string | LucideIcon | undefined) => {
    if (!icon) return null;

    // If it's already a component, return it
    if (typeof icon === "function") return icon;

    // If it's a string, resolve it from iconMap
    if (typeof icon === "string") {
      const IconComponent = iconMap[icon];
      return IconComponent || null;
    }

    return null;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Owner Dashboard</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const IconComponent = getIconComponent(item.icon);

          return (
            <Link key={item.title} href={item.url}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActiveLink(item.url)}
                >
                  {IconComponent && <IconComponent />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
