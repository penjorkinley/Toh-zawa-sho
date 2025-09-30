"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, ChevronDown, HelpCircle } from "lucide-react";

export default function ContactPage() {
  const [openIndex, setOpenIndex] = useState(-1);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@tohzawasho.com",
      description: "Get a response within 24 hours",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri, 9 AM - 6 PM EST",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "123 Tech Street, Digital City, DC 12345",
      description: "Schedule an appointment",
    },
  ];

  const faqs = [
    {
      question: "How quickly can I set up my digital menu?",
      answer:
        "Most restaurants can set up their complete digital menu system within 30 minutes. Our intuitive dashboard makes it easy to add categories, items, and images.",
    },
    {
      question: "Do I need to reprint QR codes when I update my menu?",
      answer:
        "No! That's the beauty of our system. Once you generate and print QR codes for your tables, they automatically reflect any menu changes you make. No reprinting ever needed.",
    },
    {
      question: "Can customers order through the digital menu?",
      answer:
        "Currently, our system focuses on menu display and management. Customers can view your beautiful digital menu with images and descriptions, but ordering happens through your existing process.",
    },
    {
      question: "What if my customers don't know how to scan QR codes?",
      answer:
        "QR code scanning is built into most modern smartphones' camera apps. We also provide clear instructions on our QR code templates to guide customers through the process.",
    },
    {
      question: "Is there a limit to how many menu items I can add?",
      answer:
        "No limits! Add as many categories and items as you need. Our system is designed to handle everything from small cafes to large restaurants with extensive menus.",
    },
    {
      question: "Can I customize the appearance of my digital menu?",
      answer:
        "Yes! You can upload high-quality images for each dish, write detailed descriptions, mark vegetarian items, and organize everything into categories that make sense for your restaurant.",
    },
  ];

  return (
    <main className="min-h-screen w-full flex flex-col px-6 sm:px-8 lg:px-12 pt-4">
      <div className="container mx-auto pt-[100px] md:pt-[110px] lg:pt-[120px] pb-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#CD8B65] leading-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Have questions about our digital menu system? Want to see a demo?
            We're here to help you modernize your restaurant.
          </p>
          <div className="w-24 h-1 bg-[#CD8B65] mx-auto"></div>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                style={{ backgroundColor: "#F8F6EE" }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#CD8B65]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-[#CD8B65]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">
                      {info.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {info.description}
                    </p>
                    <p className="text-[#CD8B65] font-medium text-sm">
                      {info.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section - Accordion Design */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#CD8B65]/10 rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-[#CD8B65]" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-relaxed">
              Frequently Asked <span className="text-[#CD8B65]">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Quick answers to common questions about our digital menu system
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => {
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
                      {/* Question Number Badge */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 font-bold ${
                          isOpen
                            ? "bg-[#CD8B65] text-white shadow-lg scale-110"
                            : "bg-[#F8F6EE] text-[#CD8B65] border border-[#CD8B65]/20"
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* Question */}
                      <div className="flex-1">
                        <h3
                          className={`text-base md:text-lg font-bold leading-relaxed transition-colors duration-300 ${
                            isOpen ? "text-[#CD8B65]" : "text-gray-900"
                          }`}
                        >
                          {faq.question}
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
                      isOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2">
                      <div className="pl-10 md:pl-14">
                        <div className="h-px w-full bg-gradient-to-r from-[#CD8B65]/30 to-transparent mb-4"></div>
                        <p className="text-gray-600 text-base leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#CD8B65] to-[#CD8B65]/80 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6 leading-relaxed">
            Still Have Questions?
          </h2>
          <p className="text-xl opacity-90 leading-relaxed">
            We're here to help you transform your restaurant with our digital
            menu solution. Get in touch with our team for personalized support,
            demos, or any questions about getting started.
          </p>
        </div>
      </div>
    </main>
  );
}
