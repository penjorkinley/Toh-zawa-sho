"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function NavLink({ href, children, className, onClick }: Props) {
  const path = usePathname();
  return (
    <Link
      href={href}
      className={
        path.startsWith(href)
          ? `${className} border-b-[3px] border-primary text-[20px] min-h-8 font-medium flex items-center justify-center transition-all duration-200 ease-in-out`
          : `${className} text-[#040403] text-[20px] min-h-8 font-medium flex items-center justify-center transition-all duration-200 ease-in-out`
      }
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
