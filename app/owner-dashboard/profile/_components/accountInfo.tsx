"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SelectField from "@/components/ui/SelectField";
import LocationInput from "@/components/ui/LocationButton";
import OpeningDaysSelector from "@/components/ui/OpeningDaysSelector";
import TimeSelector from "@/components/ui/TimeSelector";
import InputField from "@/components/ui/InputField";
import { Button } from "@/components/ui/shadcn-button";

export default function AccountInfo() {
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    openingDays: [] as string[],
    openingTime: "09:00 AM",
    closingTime: "08:00 PM",
    businessType: "",
    location: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDaySelection = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      openingDays: prev.openingDays.includes(day)
        ? prev.openingDays.filter((d) => d !== day)
        : [...prev.openingDays, day],
    }));
  };

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

  const handleMapClick = () => {
    console.log("Open map functionality");
    // Map popup logic can go here
  };

  //   const validateForm = () => {
  //     const newErrors: Record<string, string> = {};

  //     if (!formData.email.trim()) {
  //       newErrors.email = "Email is required";
  //     } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
  //       newErrors.email = "Invalid email format";
  //     }

  //     if (!formData.phoneNumber.trim()) {
  //       newErrors.phoneNumber = "Phone number is required";
  //     }

  //     if (!formData.businessType) {
  //       newErrors.businessType = "Please select a business type";
  //     }

  //     setErrors(newErrors);
  //     return Object.keys(newErrors).length === 0;
  //   };

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 border-primary border-2 p-6 rounded-lg"
    >
      <InputField
        type="email"
        placeholder="Enter your business email"
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        className="col-span-2"
      />
      <InputField
        type="tel"
        placeholder="+975-17-xxx-xxx"
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        error={errors.phoneNumber}
        className="col-span-2"
      />
      <div className="col-span-2">
        <OpeningDaysSelector
          selectedDays={formData.openingDays}
          onChange={handleDaySelection}
          onPresetSelect={handlePresetDays}
          error={errors.openingDays}
          // className="col-span-2"
        />
      </div>
      <div className="grid grid-cols-2 col-span-2 gap-4">
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
      <SelectField
        label="Business Type"
        name="businessType"
        value={formData.businessType}
        onChange={handleChange}
        options={businessTypeOptions}
        placeholder="Select Business Type"
        error={errors.businessType}
        className="col-span-2"
      />
      <div className="col-span-2">
        <LocationInput
          value={formData.location}
          onChange={handleChange}
          onMapClick={handleMapClick}
          error={errors.location}
        />
      </div>
      <div className="col-span-2">
        <label className="text-text font-normal block mb-2 md:mb-3 ">
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
      <div className="col-span-2 flex justify-between mt-4">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </motion.div>
  );
}
