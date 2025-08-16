"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
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
import { supabase } from "@/lib/supabase/client";

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

  const handleFileChange = (fieldName: string, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
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

  // Fixed: Handle preset selection with correct type
  const handlePresetDays = (preset: "all" | "weekdays" | "weekends") => {
    let newDays: string[] = [];

    if (preset === "all") {
      newDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    } else if (preset === "weekdays") {
      newDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    } else if (preset === "weekends") {
      newDays = ["Sat", "Sun"];
    }

    setFormData((prev) => ({
      ...prev,
      openingDays: newDays,
    }));
  };

  // Fixed: Handle map click with no parameters
  const handleMapClick = () => {
    // This will open the map modal from the LocationInput component
    console.log("Opening map...");
  };

  const handleSubmit = async () => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    // Basic validation
    if (
      !formData.businessType ||
      !formData.location ||
      formData.openingDays.length === 0
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // For now, we'll just mark the first login as complete
      // In the future, you might want to save additional restaurant information
      // to a separate restaurants table or update the user profile

      const result = await completeFirstLoginAction(user.id);

      if (!result.success) {
        throw new Error(result.error || "Failed to complete setup");
      }

      // Success! Redirect to restaurant dashboard
      console.log("Information setup completed successfully");
      router.push("/restaurant/dashboard");
    } catch (err) {
      console.error("Setup submission error:", err);
      setError(err instanceof Error ? err.message : "Failed to complete setup");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your information...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Setup Error
          </h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <div className="px-4 md:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="py-4 md:py-6 lg:py-8">
          <BackButton
            onClick={() => window.history.back()}
            title="Information Setup"
          />
        </div>

        {/* Welcome message */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome to Toh Zawa Sho! 🎉
          </h1>
          <p className="text-gray-600">
            Your registration has been approved! Please complete your restaurant
            information to get started.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Main content layout */}
        <div className="md:flex md:flex-row md:gap-8 lg:gap-16">
          {/* Left column with image uploader */}
          <div className="md:w-1/2 lg:w-2/5">
            <div className="md:sticky md:top-8">
              <ImageUploader
                coverPhoto={formData.coverPhoto}
                logo={formData.logo}
                onCoverPhotoChange={(file) =>
                  handleFileChange("coverPhoto", file)
                }
                onLogoChange={(file) => handleFileChange("logo", file)}
              />
            </div>
          </div>

          {/* Right column with form fields */}
          <div className="md:w-1/2 lg:w-3/5 md:mt-0">
            <div className="mt-10 space-y-4 md:space-y-6 lg:space-y-8 md:mt-0 md:p-6 lg:p-8 md:bg-white md:rounded-xl md:shadow-sm">
              {/* Pre-filled user information (read-only styles) */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4 text-gray-900">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <InputField
                    type="text"
                    label="Business Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter business name"
                    className="bg-gray-100 opacity-75 cursor-not-allowed"
                  />
                  <InputField
                    type="email"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-gray-100 opacity-75 cursor-not-allowed"
                  />
                  <InputField
                    type="text"
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="bg-gray-100 opacity-75 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * These fields are from your registration and cannot be
                  changed here
                </p>
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

                  <div>
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
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 md:mt-10 lg:mt-12">
                <div className="md:flex md:justify-center">
                  <div className="w-full">
                    <Button
                      onClick={submitting ? undefined : handleSubmit}
                      className={`w-full ${
                        submitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Completing Setup...
                        </>
                      ) : (
                        "Complete Setup"
                      )}
                    </Button>
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
