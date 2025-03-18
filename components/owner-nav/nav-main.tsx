"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarMenuSub,
  // SidebarMenuSubButton,
  // SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
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
    return pathname.split("/")[2] === url;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Owner Dashboard</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Link key={item.title} href={item.url}>
            {/* <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            > */}
            <SidebarMenuItem>
              {/* <CollapsibleTrigger asChild> */}
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActiveLink(item.url)}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
              {/* </CollapsibleTrigger> */}
              {/* <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent> */}
            </SidebarMenuItem>
            {/* </Collapsible> */}
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
