"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import NavLinks from "@/components/header/nav-links/nav-links";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP menu animations
  useEffect(() => {
    if (!menuRef.current) return;

    const menu = menuRef.current;
    const overlay = overlayRef.current;
    const menuItemsContainer = menuItemsRef.current;

    if (isMenuOpen && menuItemsContainer) {
      const menuItems = Array.from(menuItemsContainer.children);

      // Open animations
      gsap.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(menu, { x: "100%" }, { x: 0, duration: 0.5, ease: "power3.out" });

      if (menuItems.length) {
        gsap.fromTo(
          menuItems,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.2, ease: "power2.out" }
        );
      }
    } else if (menu && overlay) {
      // Close animations
      gsap.to(overlay, { opacity: 0, duration: 0.4, ease: "power2.in" });
      gsap.to(menu, { x: "100%", duration: 0.3, ease: "power3.in" });

      if (menuItemsContainer) {
        const menuItems = Array.from(menuItemsContainer.children);
        gsap.to(menuItems, { opacity: 0, duration: 0.2, ease: "power2.in" });
      }
    }
  }, [isMenuOpen]);

  const AuthButtons = () => {
    return (
      <div className="hidden lg:flex items-center space-x-4">
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 text-primary font-medium hover:text-primary/80 transition-colors">
                <span>{session.user?.name || "User"}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/login" className="text-primary font-medium">
              Log In
            </Link>
            <Link href="/signup" className="text-primary font-medium">
              Sign Up
            </Link>
          </>
        )}
      </div>
    );
  };

  const MenuButton = () => (
    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden" aria-label="Open menu">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-7 h-7"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>
  );

  const MobileMenu = () => {
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

    return (
      <div
        ref={overlayRef}
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 pointer-events-none opacity-0"
        style={{ pointerEvents: isMenuOpen ? "auto" : "none" }}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          ref={menuRef}
          className="fixed top-0 right-0 h-full w-[300px] bg-screen z-50 p-6 transform translate-x-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end">
            <button onClick={() => setIsMenuOpen(false)} className="p-1" aria-label="Close menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={menuItemsRef} className="mt-8">
            <NavLinks
              orientation="vertical"
              className="mt-8 space-y-6"
              onLinkClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Auth Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              {session ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                    className="flex items-center justify-between w-full text-primary font-medium"
                  >
                    <span>{session.user?.name || "User"}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isMobileDropdownOpen && (
                    <div className="ml-4 space-y-3">
                      <Link
                        href="/profile"
                        className="block text-gray-700 hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left text-gray-700 hover:text-primary transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Link
                    href="/login"
                    className="block text-primary font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="block text-primary font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-8 lg:px-12 
                 py-4 md:py-5 lg:py-6 w-full flex justify-between items-center 
                 transition-all duration-300 bg-screen h-[80px] md:h-[90px] lg:h-[100px] 
                 ${isScrolled ? "shadow-md" : ""}`}
    >
      <Link href="/" className="flex-shrink-0">
        <Image
          src="/tzs-logo.svg"
          alt="Toh Zawa Sho Logo"
          width={isScrolled ? 50 : 60}
          height={isScrolled ? 54 : 65}
          className="lg:w-[70px] lg:h-auto"
        />
      </Link>

      <div className="hidden lg:block">
        <NavLinks />
      </div>

      <AuthButtons />
      <MenuButton />
      <MobileMenu />
    </header>
  );
}
