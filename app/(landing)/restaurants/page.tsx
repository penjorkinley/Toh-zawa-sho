"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/shadcn-button";
import {
  ArrowRight,
  CheckCircle,
  Edit3,
  QrCode,
  Smartphone,
  Upload,
  BarChart3,
  Users,
} from "lucide-react";

export default function RestaurantsPage() {
  const features = [
    {
      icon: Edit3,
      title: "Complete Menu Control",
      description:
        "Create, edit, and organize your entire menu with our intuitive dashboard. Add categories, items, prices, and descriptions with ease.",
      benefits: [
        "Drag & drop organization",
        "Bulk operations",
        "Category management",
        "Real-time preview",
      ],
    },
    {
      icon: Upload,
      title: "Rich Media Support",
      description:
        "Upload high-quality images for your dishes and provide detailed descriptions to entice customers.",
      benefits: [
        "Image optimization",
        "Multiple formats supported",
        "Ingredient lists",
        "Dietary information",
      ],
    },
    {
      icon: QrCode,
      title: "Dynamic QR Codes",
      description:
        "Generate beautiful, printable QR codes for each table. Changes to your menu automatically reflect - no reprinting needed!",
      benefits: [
        "Professional designs",
        "Table-specific codes",
        "Automatic updates",
        "Print-ready formats",
      ],
    },
    {
      icon: BarChart3,
      title: "Digital First Approach",
      description:
        "No more paper waste, reprinting costs, or unprofessional menu patches. Your menu is always current and professional.",
      benefits: [
        "Zero printing costs",
        "Instant updates",
        "Professional appearance",
        "Eco-friendly solution",
      ],
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Set Up Your Menu",
      description:
        "Use our intuitive dashboard to create your digital menu with categories, items, prices, and beautiful images.",
      icon: Edit3,
      color: "bg-blue-500",
    },
    {
      step: "2",
      title: "Create Tables & Generate QR Codes",
      description:
        "Add your restaurant tables and generate unique QR codes for each one. Download professional printable designs.",
      icon: QrCode,
      color: "bg-green-500",
    },
    {
      step: "3",
      title: "Print & Place QR Codes",
      description:
        "Print the QR codes once and place them on your tables. They'll automatically update when you change your menu.",
      icon: Smartphone,
      color: "bg-purple-500",
    },
    {
      step: "4",
      title: "Customers Scan & Browse",
      description:
        "Customers scan the QR code to instantly access your beautiful digital menu with images and descriptions.",
      icon: Users,
      color: "bg-orange-500",
    },
  ];

  return (
    <main className="min-h-screen w-full flex flex-col px-6 sm:px-8 lg:px-12 pt-4">
      <div className="container mx-auto pt-[100px] md:pt-[110px] lg:pt-[120px] pb-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#CD8B65] leading-tight mb-6">
            For Restaurant Owners
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Take complete control of your menu management. No more printing
            costs, no more menu patches, no more customer complaints about
            unclear information.
          </p>
          <div className="w-24 h-1 bg-[#CD8B65] mx-auto"></div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How It <span className="text-[#CD8B65]">Solves</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple, powerful platform designed
              specifically for restaurant owners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 ${step.color} rounded-full flex items-center justify-center relative`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-900">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Problem Statement */}
        <div className="bg-[#F8F6EE] rounded-2xl p-8 md:p-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#CD8B65] mb-6">
                Tired of These Common Problems?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-[#CD8B65] rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    Constantly reprinting menus for price changes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-[#CD8B65] rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    Unprofessional paper patches over old items
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-[#CD8B65] rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    Deteriorated, worn-out menus that look terrible
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-[#CD8B65] rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    Not enough menus for large groups
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-[#CD8B65] rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    No way to show food images or detailed descriptions
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative h-[300px] md:h-[400px]">
              <Image
                src="/tired.png"
                alt="Restaurant problems solved"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#CD8B65] to-[#CD8B65]/80 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Restaurant Menu?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Transform your restaurant operations with intelligent menu
            management. Experience instant updates, professional presentation,
            and enhanced customer engagement - all through one powerful
            platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                variant="secondary"
                className="text-[#CD8B65] bg-white hover:bg-gray-100 font-semibold"
              >
                Register Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#CD8B65] font-semibold transition-all duration-300"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
