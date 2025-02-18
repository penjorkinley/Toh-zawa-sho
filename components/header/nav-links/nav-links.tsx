import NavLink from "./nav-link";
import { landingNavLinks } from "@/lib/config/nav-links";

export default function NavLinks() {
  return (
    <nav className="h-[50px] w-[705px] grid gap-3 grid-flow-col items-center">
      {landingNavLinks.map((link) => (
        <NavLink key={link.href} href={link.href} className={link.className}>
          {link.text}
        </NavLink>
      ))}
    </nav>
  );
}
