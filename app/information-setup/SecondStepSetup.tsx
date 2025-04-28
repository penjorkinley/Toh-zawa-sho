import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";
import LocationInput from "@/components/ui/LocationButton";
import OpeningDaysSelector from "@/components/ui/OpeningDaysSelector";
import TimeSelector from "@/components/ui/TimeSelector";
import PaginationIndicator from "@/components/ui/PaginationIndicator";
import { BusinessSetupData } from "@/lib/validations/information-setup/setup";

interface SecondStepSetupProps {
  formData: BusinessSetupData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleDaySelection: (day: string) => void;
  handlePresetDays: (preset: "all" | "weekdays" | "weekends") => void;
  handleBack: () => void;
  handleSubmit: () => void;
  direction: number;
  slideVariants: any;
  slideTransition: any;
}

export default function SecondStepSetup({
  formData,
  handleChange,
  handleDaySelection,
  handlePresetDays,
  handleBack,
  handleSubmit,
  direction,
  slideVariants,
  slideTransition,
}: SecondStepSetupProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Basic validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.openingDays.length === 0) {
      newErrors.openingDays = "Please select at least one opening day";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle map click
  const handleMapClick = () => {
    console.log("Open map functionality");
    // Implement map functionality here
  };

  // Handle submit with validation
  const handleSubmitWithValidation = () => {
    if (validateForm()) {
      handleSubmit();
    }
  };

  return (
    <motion.div
      key="step2"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={slideTransition}
      className="min-h-screen w-full bg-white pb-8"
    >
      {/* Container with responsive layout */}
      <div className="w-full mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
        <div className="py-4 md:py-6 lg:py-8">
          <BackButton onClick={handleBack} title="Information Setup" />
        </div>

        {/* Card-like layout for larger screens */}
        <div className="md:bg-gray-50 md:rounded-xl md:p-8 lg:p-10 md:mt-4">
          {/* Two-column layout for larger screens */}
          <div className="md:grid md:grid-cols-2 md:gap-8 lg:gap-12">
            {/* Left column */}
            <div className="space-y-6 md:space-y-8">
              {/* Location Input */}
              <LocationInput
                value={formData.location}
                onChange={handleChange}
                onMapClick={handleMapClick}
                error={errors.location}
              />

              {/* Opening and Closing Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <TimeSelector
                  label="Opening Time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                />

                <TimeSelector
                  label="Closing Time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="mt-6 md:mt-0 space-y-6 md:space-y-8">
              {/* Opening Days Selector */}
              <OpeningDaysSelector
                selectedDays={formData.openingDays}
                onChange={handleDaySelection}
                onPresetSelect={handlePresetDays}
                error={errors.openingDays}
              />
            </div>
          </div>

          {/* Description - full width */}
          <div className="mt-6 md:mt-10 lg:mt-12">
            <label className="text-black font-normal block mb-2 md:mb-3 lg:text-lg">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter your business description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-text/40 focus:outline-none focus:border-primary resize-none md:p-4 lg:p-5"
            />
          </div>

          {/* Complete Button with different position on different screens */}
          <div className="mt-8 md:mt-10 lg:mt-12">
            <div className="md:flex md:justify-end">
              <div className="w-full md:w-1/3 lg:w-1/4">
                <Button onClick={handleSubmitWithValidation}>Complete</Button>
              </div>
            </div>
          </div>

          {/* Pagination Indicator */}
          <div className="mt-6 md:mt-8">
            <PaginationIndicator currentStep={2} totalSteps={2} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
