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

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    } else if (formData.businessName.length < 2) {
      newErrors.businessName = "Business name must be at least 2 characters";
    }

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
      {/* Container with responsive layout */}
      <div className="w-full mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
        <div className="py-4 md:py-6 lg:py-8">
          <BackButton
            onClick={() => window.history.back()}
            title="Information Setup"
          />
        </div>

        {/* Completely different layout for md and above */}
        <div className="md:flex md:flex-row md:gap-8 lg:gap-16">
          {/* Left column with image uploader on md+ screens */}
          <div className="md:w-1/2 lg:w-2/5">
            <div className="md:sticky md:top-8">
              <ImageUploader
                coverPhoto={formData.coverPhoto}
                logo={formData.logo}
                onCoverPhotoChange={handleCoverPhotoChange}
                onLogoChange={handleLogoChange}
              />

              {/* Adding spacing to balance the layout */}
              <div className="mt-24 md:mt-20"></div>
            </div>
          </div>

          {/* Right column with form fields on md+ screens */}
          <div className="md:w-1/2 lg:w-3/5 md:mt-0">
            <div className="space-y-4 md:space-y-6 lg:space-y-8 md:mt-0 md:p-6 lg:p-8 md:bg-gray-50 md:rounded-xl">
              {/* Business Name input field - newly added */}
              <InputField
                type="text"
                placeholder="Enter your business name"
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                error={errors.businessName}
                className="lg:col-span-2"
              />

              <div className="md:grid md:grid-cols-1 lg:grid-cols-2 md:gap-6 lg:gap-8">
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
              </div>

              <SelectField
                label="Business Type"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                options={businessTypeOptions}
                placeholder="Select Business Type"
                error={errors.businessType}
                className="lg:col-span-2"
              />

              {/* Button with different widths based on screen */}
              <div className="mt-8 md:mt-10 lg:mt-12">
                <div className="md:flex md:justify-end">
                  <div className="w-full md:w-1/3 lg:w-1/4">
                    <Button onClick={handleNextWithValidation}>Next</Button>
                  </div>
                </div>
              </div>

              {/* Pagination Indicator */}
              <PaginationIndicator currentStep={1} totalSteps={2} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
