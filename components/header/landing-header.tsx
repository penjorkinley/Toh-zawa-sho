"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavLinks from "./nav-links/nav-links";
import { landingNavLinks } from "@/lib/config/nav-links";
import NavLink from "./nav-links/nav-link";

export default function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="h-[125px] px-4 sm:px-[50px] py-[30px] w-full flex justify-between items-center">
      <Link href="/">
        <Image src="/tzs-logo.svg" alt="tzs-logo" width={60} height={65} />
      </Link>

      <div className="hidden lg:block">
        <NavLinks />
      </div>

      <button
        onClick={() => setIsMenuOpen(true)}
        className="lg:hidden"
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <div
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-[300px] bg-screen z-50 p-4 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <nav className="flex flex-col mt-12 space-y-4">
            {landingNavLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  link.text === "Business Owners"
                    ? `${link.className}`
                    : link.className
                } w-full text-left px-4 py-2`}
              >
                {link.text}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
