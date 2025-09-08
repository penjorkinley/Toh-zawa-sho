"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SelectField from "@/components/ui/SelectField";
import LocationInput from "@/components/ui/LocationButton";
import OpeningDaysSelector from "@/components/ui/OpeningDaysSelector";
import TimeSelector from "@/components/ui/TimeSelector";
import InputField from "@/components/ui/InputField";
import { Button } from "@/components/ui/shadcn-button";
import {
  getProfileData,
  updateProfileData,
  ProfileData,
} from "@/lib/actions/profile/actions";
import toast from "react-hot-toast";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalData, setOriginalData] = useState<ProfileData | null>(null);

  // Load profile data on component mount
  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);
        const result = await getProfileData();

        if (result.success && result.data) {
          const data = result.data;
          setOriginalData(data);

          // Convert business hours to opening days format
          const openingDays = data.business_hours
            .filter((hour) => !hour.is_closed)
            .map((hour) => {
              const dayMap: { [key: string]: string } = {
                monday: "Mon",
                tuesday: "Tue",
                wednesday: "Wed",
                thursday: "Thu",
                friday: "Fri",
                saturday: "Sat",
                sunday: "Sun",
              };
              return dayMap[hour.day_of_week] || hour.day_of_week;
            });

          // Get opening and closing times (assuming same for all days)
          const firstHour = data.business_hours[0];

          setFormData({
            email: data.email,
            phoneNumber: data.phone_number,
            openingDays,
            openingTime: firstHour?.opening_time || "09:00 AM",
            closingTime: firstHour?.closing_time || "08:00 PM",
            businessType: data.business_type,
            location: data.location,
            description: data.description,
          });
        } else {
          toast.error(result.error || "Failed to load profile data");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }

    loadProfileData();
  }, []);

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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.openingDays.length === 0) {
      newErrors.openingDays = "Please select at least one opening day";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        email:
          formData.email !== originalData?.email ? formData.email : undefined,
        phoneNumber:
          formData.phoneNumber !== originalData?.phone_number
            ? formData.phoneNumber
            : undefined,
        businessType:
          formData.businessType !== originalData?.business_type
            ? formData.businessType
            : undefined,
        location:
          formData.location !== originalData?.location
            ? formData.location
            : undefined,
        description:
          formData.description !== originalData?.description
            ? formData.description
            : undefined,
        openingDays: formData.openingDays,
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
      };

      const result = await updateProfileData(updateData);

      if (result.success) {
        toast.success("Profile updated successfully!");
        // Reload data to get updated values
        const refreshResult = await getProfileData();
        if (refreshResult.success && refreshResult.data) {
          setOriginalData(refreshResult.data);
        }
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      // Convert business hours back to form format
      const openingDays = originalData.business_hours
        .filter((hour) => !hour.is_closed)
        .map((hour) => {
          const dayMap: { [key: string]: string } = {
            monday: "Mon",
            tuesday: "Tue",
            wednesday: "Wed",
            thursday: "Thu",
            friday: "Fri",
            saturday: "Sat",
            sunday: "Sun",
          };
          return dayMap[hour.day_of_week] || hour.day_of_week;
        });

      const firstHour = originalData.business_hours[0];

      setFormData({
        email: originalData.email,
        phoneNumber: originalData.phone_number,
        openingDays,
        openingTime: firstHour?.opening_time || "09:00 AM",
        closingTime: firstHour?.closing_time || "08:00 PM",
        businessType: originalData.business_type,
        location: originalData.location,
        description: originalData.description,
      });
    }
    setErrors({});
  };

  const businessTypeOptions = [
    { value: "restaurant", label: "Restaurant" },
    { value: "cafe", label: "Café" },
    { value: "bakery", label: "Bakery" },
    { value: "food_truck", label: "Food Truck" },
    { value: "bar", label: "Bar" },
    { value: "other", label: "Other" },
  ];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-primary border-2 p-6 rounded-lg"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-primary border-2 p-6 rounded-lg"
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
          <label className="text-text font-normal block mb-2 md:mb-3">
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
          <Button
            variant="outline"
            type="button"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
