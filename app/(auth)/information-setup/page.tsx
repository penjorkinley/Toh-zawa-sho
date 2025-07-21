"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";
import ImageUploader from "@/components/ui/ImageUploader";
import SelectField from "@/components/ui/SelectField";
import LocationInput from "@/components/ui/LocationButton";
import OpeningDaysSelector from "@/components/ui/OpeningDaysSelector";
import TimeSelector from "@/components/ui/TimeSelector";
import { BusinessSetupData } from "@/lib/validations/information-setup/setup";

export default function BusinessSetupPage() {
  // Initialize form data
  const [formData, setFormData] = useState<BusinessSetupData>({
    businessType: "",
    logo: null,
    coverPhoto: null,
    location: "",
    openingDays: [],
    openingTime: "09:00 AM",
    closingTime: "05:00 PM",
    description: "",
  });

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

  // Handle map click
  const handleMapClick = () => {
    console.log("Open map functionality");
    // Implement map functionality here
  };
  // Submit the form
  const handleSubmit = () => {
    try {
      console.log("Business setup data submitted:", formData);
      // Redirect to dashboard or confirmation page
    } catch (err) {
      console.error("Submission error:", err);
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
    <div className="font-poppins relative min-h-screen w-full bg-white pb-8">
      <div className="w-full mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
        <div className="py-4 md:py-6 lg:py-8">
          <BackButton
            onClick={() => window.history.back()}
            title="Information Setup"
          />
        </div>

        {/* Main content layout */}
        <div className="md:flex md:flex-row md:gap-8 lg:gap-16">
          {/* Left column with image uploader */}
          <div className="md:w-1/2 lg:w-2/5">
            <div className="md:sticky md:top-8">
              <ImageUploader
                coverPhoto={formData.coverPhoto || null}
                logo={formData.logo || null}
                onCoverPhotoChange={(file) =>
                  handleFileChange("coverPhoto", file)
                }
                onLogoChange={(file) => handleFileChange("logo", file)}
              />
            </div>
          </div>

          {/* Right column with form fields */}
          <div className="md:w-1/2 lg:w-3/5 md:mt-0">
            <div className="mt-10 space-y-4 md:space-y-6 lg:space-y-8 md:mt-0 md:p-6 lg:p-8 md:bg-gray-50 md:rounded-xl">
              <SelectField
                label="Business Type"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                options={businessTypeOptions}
                placeholder="Select Business Type"
                className="lg:col-span-2"
              />

              <LocationInput
                value={formData.location}
                onChange={handleChange}
                onMapClick={handleMapClick}
              />

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

              <OpeningDaysSelector
                selectedDays={formData.openingDays}
                onChange={handleDaySelection}
                onPresetSelect={handlePresetDays}
              />
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

              {/* Submit Button */}
              <div className="mt-8 md:mt-10 lg:mt-12">
                <div className="md:flex md:justify-center">
                  <div className="w-full">
                    <Button onClick={handleSubmit}>Complete Setup</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
