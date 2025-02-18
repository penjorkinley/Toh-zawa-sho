import NavLink from "./nav-link";

export default function NavLinks() {
  return (
    <nav className="h-[50px] w-[705px] grid gap-3 grid-flow-col items-center">
      <NavLink href="/about">About</NavLink>
      <NavLink href="/restaurants">Restaurants</NavLink>
      <NavLink href="/contact">Contact</NavLink>
      <NavLink
        href="#"
        className="bg-primary w-auto h-full rounded-md text-white transition-transform duration-300 transform-cpu hover:scale-105"
      >
        Business Owners
      </NavLink>
    </nav>
  );
}
