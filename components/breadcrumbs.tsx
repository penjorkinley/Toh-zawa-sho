"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export function Breadcrumbs() {
  const pathname = usePathname();

  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment !== "")
    .map((segment) => ({
      title: segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      href: `/${pathname
        .split("/")
        .slice(1, pathname.split("/").indexOf(segment) + 1)
        .join("/")}`,
    }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => (
          <React.Fragment key={segment.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index === pathSegments.length - 1 ? (
                <BreadcrumbPage>{segment.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={segment.href}>
                  {segment.title}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
