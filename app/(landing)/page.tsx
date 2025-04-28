"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function LandingPage() {
  // Feature items for the right column
  const features = [
    {
      icon: "/icons/qr-code.svg",
      title: "Contactless & Convenient",
    },
    {
      icon: "/icons/mobile-order.svg",
      title: "Faster & Error-Free Ordering",
    },
    {
      icon: "/icons/menu.svg",
      title: "Easy Menu Management",
    },
    {
      icon: "/icons/satisfaction.svg",
      title: "Increased Customer Satisfaction",
    },
  ];

  return (
    <main className="min-h-screen w-full flex flex-col px-6 sm:px-8 lg:px-12 pt-4 sm:pt-0">
      <div className="container mx-auto pt-[50px] md:pt-[120px] flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-8">
          {/* Left column - Text content */}
          <div className="lg:col-span-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[#CD8B65] leading-tight mb-6">
              Revolutionizing Restaurant Dining with Digital Menus!
            </h1>
            <p className="text-gray-600 mb-8">
              A smart, contactless menu and ordering system designed for
              efficiency and better customer experience.
            </p>
          </div>

          {/* Middle column - Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full h-[350px] md:h-[450px]">
              <Image
                src="/restaurant-illustration.svg"
                alt="Restaurant digital menu illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right column - Feature icons */}
          <div className="lg:col-span-3 space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={48}
                  height={48}
                />
                <span className="font-medium">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Join Us button - centered below the grid */}
        <div className="mt-8 mb-12 flex justify-center">
          <Link href="/signup" className="w-full max-w-xs">
            <Button>Join Us!</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
