"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/shadcn-button";
import BackButton from "@/components/ui/BackButton";
import ImageUploader from "@/components/ui/ImageUploader";
import SelectField from "@/components/ui/SelectField";
import LocationInput from "@/components/ui/LocationButton";
import OpeningDaysSelector from "@/components/ui/OpeningDaysSelector";
import TimeSelector from "@/components/ui/TimeSelector";
import { BusinessSetupData } from "@/lib/validations/information-setup/setup";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/InputField";
import { completeFirstLoginAction } from "@/lib/actions/auth/actions";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const businessTypeOptions = [
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Cafe" },
  { value: "bakery", label: "Bakery" },
  { value: "fast-food", label: "Fast Food" },
  { value: "bar", label: "Bar" },
  { value: "food-truck", label: "Food Truck" },
  { value: "catering", label: "Catering" },
  { value: "other", label: "Other" },
];

interface FormData {
  businessName: string;
  email: string;
  phoneNumber: string;
  businessType: string;
  location: string;
  openingDays: string[];
  openingTime: string;
  closingTime: string;
  description: string;
  coverPhoto: File | null;
  logo: File | null;
}

export default function InformationSetupPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create Supabase client for client components
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    email: "",
    phoneNumber: "",
    businessType: "",
    location: "",
    openingDays: [],
    openingTime: "",
    closingTime: "",
    description: "",
    coverPhoto: null,
    logo: null,
  });

  // Check authentication and get user data on mount
  useEffect(() => {
    checkAuthAndLoadUserData();
  }, []);

  const checkAuthAndLoadUserData = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        setError("Failed to load user profile");
        return;
      }

      // Check if user is approved
      if (profile.status !== "approved") {
        router.push("/login");
        return;
      }

      // Check if this is actually a first login
      if (!profile.first_login) {
        // User has already completed setup, redirect to dashboard
        router.push(
          profile.role === "super-admin"
            ? "/super-admin-dashboard/dashboard"
            : "/restaurant/dashboard"
        );
        return;
      }

      setUser(user);

      // Pre-populate form with existing data
      setFormData((prev) => ({
        ...prev,
        businessName: profile.business_name || "",
        email: user.email || "",
        phoneNumber: profile.phone_number || "",
      }));
    } catch (err) {
      console.error("Auth check error:", err);
      setError("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCoverPhotoChange = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      coverPhoto: file,
    }));
  };

  const handleLogoChange = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      logo: file,
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

  const handleLocationSelect = (location: string) => {
    setFormData((prev) => ({
      ...prev,
      location,
    }));
  };

  const handleMapClick = () => {
    // Open map modal or redirect to map selection
    console.log("Opening map for location selection");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // TODO: Save the business setup data to your database
      // This would typically involve:
      // 1. Uploading images to storage
      // 2. Saving business information to database
      // 3. Updating user profile

      // For now, just mark first login as complete
      if (user) {
        const result = await completeFirstLoginAction(user.id);
        if (result.success) {
          // Redirect to appropriate dashboard
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          if (profile?.role === "super-admin") {
            router.push("/super-admin-dashboard/dashboard");
          } else {
            router.push("/restaurant/dashboard");
          }
        } else {
          setError(result.error || "Failed to complete setup");
        }
      }
    } catch (err) {
      console.error("Setup submission error:", err);
      setError("Failed to save business information");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => router.push("/login")} className="mt-4">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <BackButton title="Complete Setup" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Restaurant Setup
          </h1>
          <p className="text-gray-600 mb-8">
            Please provide additional information to complete your registration
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information (Read-only) */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">
                Basic Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="opacity-75">
                    <InputField
                      type="text"
                      label="Business Name"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Your business name"
                      className="bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Read-only</p>
                  </div>
                  <div className="opacity-75">
                    <InputField
                      type="email"
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Read-only</p>
                  </div>
                  <div className="opacity-75">
                    <InputField
                      type="text"
                      label="Phone Number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Read-only</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * These fields are from your registration and cannot be
                  changed here
                </p>
              </div>
            </div>

            {/* Restaurant setup information */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">
                Restaurant Information
              </h3>

              <div className="space-y-4 md:space-y-6">
                <SelectField
                  label="Business Type *"
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

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Restaurant Images
                  </label>
                  <ImageUploader
                    coverPhoto={formData.coverPhoto}
                    logo={formData.logo}
                    onCoverPhotoChange={handleCoverPhotoChange}
                    onLogoChange={handleLogoChange}
                  />
                </div>

                <OpeningDaysSelector
                  selectedDays={formData.openingDays}
                  onChange={handleDaySelection}
                  onPresetSelect={handlePresetDays}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TimeSelector
                    label="Opening Time *"
                    name="openingTime"
                    value={formData.openingTime}
                    onChange={handleChange}
                  />

                  <TimeSelector
                    label="Closing Time *"
                    name="closingTime"
                    value={formData.closingTime}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Tell customers about your restaurant..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Complete Setup"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
