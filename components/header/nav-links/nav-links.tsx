import NavLink from "./nav-link";

interface NavLinksProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  onLinkClick?: () => void;
}

export default function NavLinks({
  orientation = "horizontal",
  className = "",
  onLinkClick,
}: NavLinksProps) {
  return (
    <nav
      className={`flex ${
        orientation === "horizontal" ? "flex-row items-center" : "flex-col"
      } gap-4 ${className}`}
    >
      <NavLink href="/" onClick={onLinkClick}>
        Home
      </NavLink>

      <NavLink href="/about" onClick={onLinkClick}>
        About
      </NavLink>

      <NavLink href="/restaurants" onClick={onLinkClick}>
        Restaurants
      </NavLink>

      <NavLink href="/contact" onClick={onLinkClick}>
        Contact
      </NavLink>

      <NavLink
        href="/login"
        className={orientation === "horizontal" ? "ml-2" : ""}
        onClick={onLinkClick}
      >
        Business Owners
      </NavLink>
    </nav>
  );
}
