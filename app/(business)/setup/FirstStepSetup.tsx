import { useState } from "react";
import { motion } from "framer-motion";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";
import ImageUploader from "@/components/ui/ImageUploader";
import SelectField from "@/components/ui/SelectField";
import PaginationIndicator from "@/components/ui/PaginationIndicator";
import { BusinessSetupData } from "./page";

interface FirstStepSetupProps {
  formData: BusinessSetupData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleFileChange: (name: string, file: File) => void;
  handleNext: () => void;
  direction: number;
  slideVariants: any;
  slideTransition: any;
}

export default function FirstStepSetup({
  formData,
  handleChange,
  handleFileChange,
  handleNext,
  direction,
  slideVariants,
  slideTransition,
}: FirstStepSetupProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle file uploads with the dedicated handler
  const handleCoverPhotoChange = (file: File) => {
    if (file && handleFileChange) {
      handleFileChange("coverPhoto", file);
    }
  };

  const handleLogoChange = (file: File) => {
    if (file && handleFileChange) {
      handleFileChange("logo", file);
    }
  };

  // Basic validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Don't validate businessName as it's not an input field
    // Only validate the fields that are actually in the form
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!formData.businessType) {
      newErrors.businessType = "Please select a business type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next with validation
  const handleNextWithValidation = () => {
    if (validateForm()) {
      handleNext();
    }
  };

  // Business type options
  const businessTypeOptions = [
    { value: "restaurant", label: "Restaurant" },
    { value: "cafe", label: "Café" },
    { value: "bakery", label: "Bakery" },
    { value: "food_truck", label: "Food Truck" },
    { value: "bar", label: "Bar" },
    { value: "other", label: "Other" },
  ];

  return (
    <motion.div
      key="step1"
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
          <BackButton
            onClick={() => window.history.back()}
            title="Information Setup"
          />
        </div>

        {/* Cover Photo and Logo combined */}
        <ImageUploader
          coverPhoto={formData.coverPhoto}
          logo={formData.logo}
          onCoverPhotoChange={handleCoverPhotoChange}
          onLogoChange={handleLogoChange}
        />

        {/* Business Name is just a label, not an input field */}
        <h2 className="text-lg font-medium text-center mb-6">Business Name</h2>

        <div className="space-y-4">
          <InputField
            type="email"
            placeholder="Email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <InputField
            type="text"
            placeholder="Phone Number"
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
          />

          <SelectField
            label="Business Type"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            options={businessTypeOptions}
            placeholder="Select Business Type"
            error={errors.businessType}
          />

          <div className="mt-6">
            <Button onClick={handleNextWithValidation}>Next</Button>
          </div>

          {/* Pagination Indicator */}
          <PaginationIndicator currentStep={1} totalSteps={2} />
        </div>
      </div>
    </motion.div>
  );
}
