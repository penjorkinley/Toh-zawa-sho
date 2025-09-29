"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function NavLink({
  href,
  children,
  className = "",
  onClick,
}: Props) {
  const path = usePathname();
  // Fix active state logic - exact match for home, startsWith for others
  const isActive = href === "/" ? path === "/" : path.startsWith(href);

  // Base styles for all links
  const baseClasses =
    "text-base font-medium transition-all duration-200 ease-in-out";

  // Special styles for business owners button
  const isButton = href === "/login";

  return (
    <Link
      href={href}
      className={`
        ${baseClasses}
        ${
          isButton
            ? "bg-primary text-white px-4 py-2 rounded-md hover:shadow-md hover:translate-y-[-2px]"
            : `relative px-3 py-2 ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-[#040403] hover:text-primary"
              }`
        }
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
