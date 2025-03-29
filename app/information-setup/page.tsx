"use client";

import { useState, useTransition } from "react";
import { AnimatePresence } from "framer-motion";
import FirstStepSetup from "./FirstStepSetup";
import SecondStepSetup from "./SecondStepSetup";
import {
  slideVariants,
  slideTransition,
  useStepNavigation,
} from "@/lib/framer-motion/utils";

// Define the setup data interface
export interface BusinessSetupData {
  coverPhoto: File | null;
  logo: File | null;
  businessName: string;
  email: string;
  phoneNumber: string;
  businessType: string;
  location: string;
  openingDays: string[];
  openingTime: string;
  closingTime: string;
  description: string;
}

export default function BusinessSetupPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Initialize form data
  const [formData, setFormData] = useState<BusinessSetupData>({
    coverPhoto: null,
    logo: null,
    businessName: "",
    email: "",
    phoneNumber: "",
    businessType: "",
    location: "",
    openingDays: [],
    openingTime: "09:00 AM",
    closingTime: "05:00 PM",
    description: "",
  });

  const { handleNext, handleBack } = useStepNavigation(setStep, setDirection);

  // Handle input changes for text/select inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file changes
  const handleFileChange = (name: string, file: File) => {
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  // Handle day selection
  const handleDaySelection = (day: string) => {
    setFormData((prev) => {
      if (prev.openingDays.includes(day)) {
        return {
          ...prev,
          openingDays: prev.openingDays.filter((d) => d !== day),
        };
      } else {
        return {
          ...prev,
          openingDays: [...prev.openingDays, day],
        };
      }
    });
  };

  // Handle preset day selections
  const handlePresetDays = (preset: "all" | "weekdays" | "weekends") => {
    if (preset === "all") {
      setFormData((prev) => ({
        ...prev,
        openingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      }));
    } else if (preset === "weekdays") {
      setFormData((prev) => ({
        ...prev,
        openingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      }));
    } else if (preset === "weekends") {
      setFormData((prev) => ({
        ...prev,
        openingDays: ["Sat", "Sun"],
      }));
    }
  };

  // Submit the form
  const handleSubmit = () => {
    startTransition(() => {
      try {
        // Here you would call your API to save the business information
        console.log("Business setup data submitted:", formData);
        // Redirect to dashboard or confirmation page
        setError(null);
      } catch (err) {
        console.error("Submission error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    });
  };

  return (
    <div className="font-poppins relative">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        {step === 1 ? (
          <FirstStepSetup
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleNext={handleNext}
            direction={direction}
            slideVariants={slideVariants}
            slideTransition={slideTransition}
          />
        ) : (
          <SecondStepSetup
            formData={formData}
            handleChange={handleChange}
            handleDaySelection={handleDaySelection}
            handlePresetDays={handlePresetDays}
            handleBack={handleBack}
            handleSubmit={handleSubmit}
            direction={direction}
            slideVariants={slideVariants}
            slideTransition={slideTransition}
          />
        )}
      </AnimatePresence>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {isPending && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">Submitting...</div>
        </div>
      )}
    </div>
  );
}
