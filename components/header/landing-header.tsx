"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import NavLinks from "./nav-links/nav-links";
import gsap from "gsap";

export default function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  // Add scroll event listener to detect when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP animations for menu
  useEffect(() => {
    // Exit early if our menu reference isn't available yet
    if (!menuRef.current) return;

    // Store references to DOM elements we want to animate
    const menu = menuRef.current;
    const overlay = overlayRef.current;
    const menuItemsContainer = menuItemsRef.current;

    if (isMenuOpen && menuItemsContainer) {
      // Convert HTML collection to array for GSAP to work with
      const menuItems = Array.from(menuItemsContainer.children);

      // ANIMATION 1: Fade in the overlay
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      // ANIMATION 2: Slide in the menu panel from right to left
      gsap.fromTo(
        menu,
        { x: "100%" },
        {
          x: 0,
          duration: 0.5,
          ease: "power3.out",
        }
      );

      // ANIMATION 3: Staggered fade-in for each menu item
      if (menuItems.length) {
        gsap.fromTo(
          menuItems,
          {
            opacity: 0,
            x: 20,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.2,
            ease: "power2.out",
          }
        );
      }
    } else if (menu && overlay) {
      // CLOSE ANIMATIONS - Run when menu is closing

      // ANIMATION 1: Fade out the overlay

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });

      // ANIMATION 2: Slide the menu back off-screen

      gsap.to(menu, {
        x: "100%",
        duration: 0.3,
        ease: "power3.in",
      });

      // ANIMATION 3: Fade out menu items
      if (menuItemsRef.current) {
        const menuItems = Array.from(menuItemsRef.current.children);
        gsap.to(menuItems, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }
  }, [isMenuOpen]);

  // Toggle menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-8 lg:px-12 
                 py-4 md:py-5 lg:py-6 w-full flex justify-between items-center 
                 transition-all duration-300 bg-screen ${
                   isScrolled ? "shadow-md" : ""
                 } h-[80px] md:h-[90px] lg:h-[100px]`}
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

      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <NavLinks />
      </div>

      {/* Mobile Menu Button */}
      <button onClick={toggleMenu} className="lg:hidden" aria-label="Open menu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-7 h-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Mobile Menu Overlay - Always rendered but with opacity controlled by GSAP */}
      <div
        ref={overlayRef}
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 pointer-events-none opacity-0"
        style={{ opacity: 0, pointerEvents: isMenuOpen ? "auto" : "none" }}
        onClick={() => setIsMenuOpen(false)}
      >
        {/* Menu Panel */}
        <div
          ref={menuRef}
          className="fixed top-0 right-0 h-full w-[300px] bg-screen z-50 p-6 transform translate-x-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div ref={menuItemsRef} className="mt-8">
            <NavLinks
              orientation="vertical"
              className="mt-8 space-y-6"
              onLinkClick={() => setIsMenuOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
