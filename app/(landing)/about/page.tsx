"use client";

import { useState } from "react";
import {
  CheckCircle,
  Target,
  Users,
  Lightbulb,
  Recycle,
  DollarSign,
  Star,
  ImageOff,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  ChevronDown,
} from "lucide-react";

export default function AboutPage() {
  const [openIndex, setOpenIndex] = useState(-1);

  const problemSolutions = [
    {
      icon: Recycle,
      problemTitle: "Environmental Impact & Constant Reprinting",
      problemDesc:
        "Traditional menus use excessive paper and plastic, contributing to waste. Every price change requires expensive reprinting, laminating, or creating entirely new menus.",
      solutionTitle: "Complete Digital Menu Management",
      solutionDesc:
        "Restaurant owners get a powerful dashboard to create, edit, and organize their entire menu digitally - eliminating paper waste and reprinting costs forever.",
      benefits: [
        "Zero paper waste - completely eco-friendly",
        "Update prices instantly with no reprinting",
        "Add or remove items in seconds",
        "Organize by categories effortlessly",
      ],
    },
    {
      icon: Star,
      problemTitle: "Unprofessional Menu Patches",
      problemDesc:
        "Restaurants often paste paper over old prices or items, creating an unprofessional appearance that affects customer perception and brand image.",
      solutionTitle: "Instant Professional Updates",
      solutionDesc:
        "Make changes through your dashboard and they appear instantly on all customer devices - always maintaining a polished, professional presentation.",
      benefits: [
        "No more taped-over prices or items",
        "Changes reflect immediately everywhere",
        "Always maintain professional appearance",
        "Upload high-quality images for each item",
      ],
    },
    {
      icon: Users,
      problemTitle: "Limited Menu Availability",
      problemDesc:
        "Large groups often wait for physical menus to be passed around, creating delays and frustration during peak hours when menus are scarce.",
      solutionTitle: "Dynamic QR Code System",
      solutionDesc:
        "Generate unique QR codes for each table. Everyone in the group can scan and view the menu simultaneously on their own device - no waiting required.",
      benefits: [
        "Print QR codes once, use forever",
        "Everyone views menu at the same time",
        "Works for groups of any size",
        "Professional printable QR designs",
      ],
    },
    {
      icon: ImageOff,
      problemTitle: "Poor Information Quality",
      problemDesc:
        "Traditional menus lack visual appeal, detailed ingredient lists, and high-quality images that help customers make informed and confident choices.",
      solutionTitle: "Rich Visual Experience",
      solutionDesc:
        "Customers access beautiful, image-rich menus with detailed descriptions, ingredients, and dietary information - all optimized for mobile viewing.",
      benefits: [
        "Stunning high-quality food photography",
        "Detailed descriptions for every item",
        "Clear ingredient and allergen information",
        "Mobile-optimized for easy browsing",
      ],
    },
    {
      icon: DollarSign,
      problemTitle: "Hidden Costs & Time Waste",
      problemDesc:
        "Between design costs, printing fees, laminating, and staff time spent managing physical menus, the true cost of traditional menus adds up quickly.",
      solutionTitle: "Complete Cost Savings",
      solutionDesc:
        "One simple platform replaces all menu-related expenses. Update anytime without additional costs, and free up your staff to focus on customers.",
      benefits: [
        "Eliminate all printing and reprinting costs",
        "No design or laminating fees",
        "Save staff time on menu management",
        "One affordable monthly subscription",
      ],
    },
  ];

  return (
    <main className="min-h-screen w-full flex flex-col px-6 sm:px-8 lg:px-12 pt-4">
      <div className="container mx-auto pt-[100px] md:pt-[110px] lg:pt-[120px] pb-12">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#CD8B65] leading-tight mb-6">
            About Toh Zawa Sho
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're revolutionizing the restaurant industry by solving age-old
            menu problems with modern digital solutions.
          </p>
          <div className="w-24 h-1 bg-[#CD8B65] mx-auto"></div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-[#CD8B65]/10 to-[#CD8B65]/5 rounded-2xl p-8 md:p-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center justify-center gap-3 mb-6">
                <Target className="h-8 w-8 text-[#CD8B65]" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                To eliminate the inefficiencies, waste, and frustrations of
                traditional paper menus while empowering restaurants with
                complete digital menu control and providing customers with rich,
                interactive dining experiences.
              </p>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">
                  Sustainable and eco-friendly
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">
                  Cost-effective for restaurants
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">
                  Enhanced customer experience
                </span>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px]">
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <img
                  src="/our-mission.png"
                  alt="Our Mission - Digital Menu Revolution"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Combined: Problems & Solutions */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Problems We <span className="text-[#CD8B65]">Solve</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Traditional restaurant menus create multiple challenges. Here's
              the problem, and how we solve it with our complete digital
              solution:
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-4">
            {problemSolutions.map((item, index) => {
              const IconComponent = item.icon;
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={`rounded-2xl border-2 transition-all duration-300 ${
                    isOpen
                      ? "border-[#CD8B65] bg-gradient-to-br from-[#F8F6EE] to-white shadow-xl"
                      : "border-[#CD8B65]/20 bg-gradient-to-r from-[#CD8B65]/10 to-[#CD8B65]/5 shadow-md hover:border-[#CD8B65]/40 hover:shadow-lg"
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full p-4 md:p-6 flex items-center justify-between gap-4 text-left"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isOpen
                            ? "bg-[#CD8B65] shadow-lg scale-110"
                            : "bg-[#F8F6EE] border border-[#CD8B65]/20"
                        }`}
                      >
                        <IconComponent
                          className={`h-6 w-6 md:h-7 md:w-7 transition-colors duration-300 ${
                            isOpen ? "text-white" : "text-[#CD8B65]"
                          }`}
                        />
                      </div>

                      {/* Title */}
                      <div className="flex-1">
                        <h3
                          className={`text-base md:text-lg font-bold transition-colors duration-300 ${
                            isOpen ? "text-[#CD8B65]" : "text-gray-900"
                          }`}
                        >
                          {item.problemTitle}
                        </h3>
                      </div>
                    </div>

                    {/* Chevron */}
                    <ChevronDown
                      className={`w-6 h-6 text-[#CD8B65] transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-[800px]" : "max-h-0"
                    }`}
                  >
                    <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2">
                      <div className="pl-12 md:pl-[72px]">
                        {/* Problem Section */}
                        <div className="mb-6">
                          <div className="inline-block px-3 py-1 bg-red-50 text-red-500 text-sm font-semibold rounded-full mb-3">
                            THE PROBLEM
                          </div>
                          <p className="text-gray-600 text-base leading-relaxed">
                            {item.problemDesc}
                          </p>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-[#CD8B65]/30 via-[#CD8B65]/10 to-transparent mb-6"></div>

                        {/* Solution Section */}
                        <div className="mb-6">
                          <div className="inline-block px-3 py-1 bg-green-50 text-green-600 text-sm font-semibold rounded-full mb-3">
                            OUR SOLUTION
                          </div>
                          <h4 className="text-base md:text-lg font-bold text-[#CD8B65] mb-3">
                            {item.solutionTitle}
                          </h4>
                          <p className="text-gray-600 text-base leading-relaxed mb-4">
                            {item.solutionDesc}
                          </p>

                          {/* Benefits Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            {item.benefits.map((benefit, benefitIndex) => (
                              <div
                                key={benefitIndex}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 text-sm">
                                  {benefit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-[#F8F6EE] rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <Lightbulb className="h-12 w-12 text-[#CD8B65] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#CD8B65] mb-4">
              Why Choose Toh Zawa Sho?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                For Restaurant Owners
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Complete control over your menu with instant updates
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Eliminate printing and reprinting costs forever
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Professional presentation that enhances your brand
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Easy-to-use dashboard for menu management
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                For Customers
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Instant access to menus via QR code scanning
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Beautiful food images and detailed descriptions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Clear ingredient and dietary information
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    No waiting - everyone in your group can view simultaneously
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
