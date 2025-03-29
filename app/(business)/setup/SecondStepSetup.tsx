import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";
import LocationInput from "@/components/ui/LocationButton";
import OpeningDaysSelector from "@/components/ui/OpeningDaysSelector";
import TimeSelector from "@/components/ui/TimeSelector";
import PaginationIndicator from "@/components/ui/PaginationIndicator";
import { BusinessSetupData } from "@/lib/validations/business/setup";

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
      <div className="w-full max-w-md mx-auto px-6">
        <div className="py-4">
          <BackButton onClick={handleBack} title="Information Setup" />
        </div>

        <div className="space-y-5">
          {/* Location Input */}
          <LocationInput
            value={formData.location}
            onChange={handleChange}
            onMapClick={handleMapClick}
            error={errors.location}
          />

          {/* Opening Days Selector */}
          <div className="mb-5">
            <OpeningDaysSelector
              selectedDays={formData.openingDays}
              onChange={handleDaySelection}
              onPresetSelect={handlePresetDays}
              error={errors.openingDays}
            />
          </div>

          {/* Opening and Closing Time */}
          <div className="flex gap-4 mb-5">
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

          {/* Description */}
          <div className="mb-5">
            <label className="text-text font-normal block mb-2">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter your business description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-text/40 focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Complete Button */}
          <div className="mt-6">
            <Button onClick={handleSubmitWithValidation}>Complete</Button>
          </div>

          {/* Pagination Indicator */}
          <PaginationIndicator currentStep={2} totalSteps={2} />
        </div>
      </div>
    </motion.div>
  );
}
