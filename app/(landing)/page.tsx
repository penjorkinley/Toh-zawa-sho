"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/shadcn-button";
import { CheckCircle } from "lucide-react";

export default function LandingPage() {
  // Key features for the right column
  const keyFeatures = [
    {
      icon: "/icons/qr-code.svg",
      title: "QR Code Menu Access",
      subtitle: "Customers scan to view menu",
    },
    {
      icon: "/icons/menu.svg",
      title: "Easy Menu Management",
      subtitle: "Add, edit, remove menu items",
    },
    {
      icon: "/icons/mobile-order.svg",
      title: "Instant Updates",
      subtitle: "Change prices immediately",
    },
    {
      icon: "/icons/satisfaction.svg",
      title: "Beautiful Food Photos",
      subtitle: "Show dishes with images",
    },
  ];

  return (
    <main className="min-h-screen w-full flex flex-col px-6 sm:px-8 lg:px-12 pt-4 sm:pt-0">
      <div className="container mx-auto pt-[50px] md:pt-[120px] flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-8">
          {/* Left column - Enhanced text content */}
          <div className="lg:col-span-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[#CD8B65] leading-tight mb-6">
              End Paper Menu Problems Forever!
            </h1>
            <p className="text-gray-600 mb-6 text-lg">
              Transform your restaurant with our digital QR menu system. No more
              reprinting, no more deteriorated menus, no more waiting.
            </p>

            {/* Problem solution highlights */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  Restaurant owners easily manage their menus
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  Print QR codes once, they work forever
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  Customers see beautiful menus with food photos
                </span>
              </div>
            </div>
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

          {/* Right column - Key features */}
          <div className="lg:col-span-3 space-y-6">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={48}
                  height={48}
                />
                <div>
                  <div className="font-medium">{feature.title}</div>
                  <div className="text-sm text-gray-500">
                    {feature.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Us button - centered below everything */}
        <div className="w-full flex justify-center items-center mt-20 mb-8 sm:mb-0">
          <Link
            href="/signup"
            className="w-full max-w-[90%] sm:max-w-[70%] md:max-w-[50%] lg:max-w-[30%] xl:max-w-[15%]"
          >
            <Button className="w-full text-base" size="lg">
              Join Us!
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
