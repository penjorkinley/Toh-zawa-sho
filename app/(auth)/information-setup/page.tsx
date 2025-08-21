"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/shadcn-button";
import BackButton from "@/components/ui/BackButton";
import ImageUploader from "@/components/ui/ImageUploader";
import SelectField from "@/components/ui/SelectField";
import LocationInput from "@/components/ui/LocationButton";
import OpeningDaysSelector from "@/components/ui/OpeningDaysSelector";
import TimeSelector from "@/components/ui/TimeSelector";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/InputField";
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

export default function InformationSetupPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fixed the type to allow undefined values
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});

  // Create Supabase client for client components
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phoneNumber: "",
    businessType: "",
    location: "",
    openingDays: [] as string[],
    openingTime: "09:00 AM",
    closingTime: "08:00 PM",
    description: "",
    coverPhoto: null as File | null,
    logo: null as File | null,
  });

  // Check if user is authenticated and on first login
  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Not authenticated");
          router.push("/login");
          return;
        }

        setUser(user);

        // Check if this is first login
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        // If not first login, redirect to appropriate dashboard
        if (!profile.first_login) {
          if (profile.role === "super-admin") {
            router.push("/super-admin-dashboard/dashboard");
          } else {
            router.push("/owner-dashboard/menu-setup");
          }
          return;
        }

        // Pre-fill known data
        setFormData((prev) => ({
          ...prev,
          businessName: profile.business_name || "",
          phoneNumber: profile.phone_number || "",
          email: user.email || "",
        }));
      } catch (err) {
        console.error("Auth error:", err);
        setError("Authentication error. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [supabase, router]);

  // Basic form validation
  const validateForm = () => {
    const errors: Record<string, string | undefined> = {};

    if (!formData.businessType) {
      errors.businessType = "Please select a business type";
    }

    if (!formData.location) {
      errors.location = "Please enter your business location";
    }

    if (formData.openingDays.length === 0) {
      errors.openingDays = "Please select at least one opening day";
    }

    if (!formData.openingTime) {
      errors.openingTime = "Please select an opening time";
    }

    if (!formData.closingTime) {
      errors.closingTime = "Please select a closing time";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

    // Clear field error when user makes changes
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: undefined,
      });
    }
  };

  const handleDaySelection = (day: string) => {
    setFormData((prev) => {
      const newDays = prev.openingDays.includes(day)
        ? prev.openingDays.filter((d) => d !== day)
        : [...prev.openingDays, day];

      return {
        ...prev,
        openingDays: newDays,
      };
    });

    // Clear error when days are selected
    if (fieldErrors.openingDays) {
      setFieldErrors({
        ...fieldErrors,
        openingDays: undefined,
      });
    }
  };

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

    // Clear error when days are selected
    if (fieldErrors.openingDays) {
      setFieldErrors({
        ...fieldErrors,
        openingDays: undefined,
      });
    }
  };

  const handleLogoChange = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      logo: file,
    }));

    // Clear error
    if (fieldErrors.logo) {
      setFieldErrors({
        ...fieldErrors,
        logo: undefined,
      });
    }
  };

  const handleCoverPhotoChange = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      coverPhoto: file,
    }));

    // Clear error
    if (fieldErrors.coverPhoto) {
      setFieldErrors({
        ...fieldErrors,
        coverPhoto: undefined,
      });
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: value,
    }));

    // Clear field error
    if (fieldErrors.location) {
      setFieldErrors({
        ...fieldErrors,
        location: undefined,
      });
    }
  };

  const handleMapClick = () => {
    console.log("Open map functionality");
  };

  // Handle form submission
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (submitting) return;

    // Clear previous errors
    setError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Create form data for submission
      const submitFormData = new FormData();
      submitFormData.append("userId", user.id);
      submitFormData.append("businessType", formData.businessType);
      submitFormData.append("location", formData.location);
      formData.openingDays.forEach((day) => {
        submitFormData.append("openingDays", day);
      });
      submitFormData.append("openingTime", formData.openingTime);
      submitFormData.append("closingTime", formData.closingTime);
      submitFormData.append("description", formData.description || "");

      // Add files if they exist
      if (formData.logo) {
        submitFormData.append("logo", formData.logo);
      }

      if (formData.coverPhoto) {
        submitFormData.append("coverPhoto", formData.coverPhoto);
      }

      // Submit to API
      const response = await fetch("/api/info-setup", {
        method: "POST",
        body: submitFormData,
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || "Failed to save business information");
        setSubmitting(false);
        return;
      }

      // Redirect to the menu setup page
      router.push("/owner-dashboard/menu-setup");
    } catch (err) {
      console.error("Setup submission error:", err);
      setError("Failed to save business information");
      setSubmitting(false);
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Business Information Setup
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Please provide details about your business to complete the setup
            process.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Type Selection */}
            <div>
              <SelectField
                label="Business Type"
                name="businessType"
                options={businessTypeOptions}
                value={formData.businessType}
                onChange={handleChange}
                error={fieldErrors.businessType}
              />
            </div>

            {/* Logo and Cover Photo Upload */}
            <div className="space-y-6">
              <ImageUploader
                logo={formData.logo}
                coverPhoto={formData.coverPhoto}
                onLogoChange={handleLogoChange}
                onCoverPhotoChange={handleCoverPhotoChange}
              />
            </div>

            {/* Location */}
            <div>
              <LocationInput
                value={formData.location}
                onChange={handleLocationChange}
                onMapClick={handleMapClick}
                error={fieldErrors.location}
              />
            </div>

            {/* Business Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Business Hours
              </h3>

              <div>
                <OpeningDaysSelector
                  selectedDays={formData.openingDays}
                  onChange={handleDaySelection}
                  onPresetSelect={handlePresetDays}
                  error={fieldErrors.openingDays}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TimeSelector
                  label="Opening Time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  error={fieldErrors.openingTime}
                />
                <TimeSelector
                  label="Closing Time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  error={fieldErrors.closingTime}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <InputField
                label="Business Description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell customers about your business..."
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
