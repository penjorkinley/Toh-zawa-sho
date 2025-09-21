"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormContainer from "@/components/auth/FormContainer";
import InputField from "@/components/ui/InputField";
import { Button } from "@/components/ui/shadcn-button";
import BackButton from "@/components/ui/BackButton";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetToken,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Password reset successfully! You can now sign in with your new password."
        );
        router.push("/signin");
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({
            general:
              data.error || "Failed to reset password. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if no token is present
  useEffect(() => {
    if (!resetToken) {
      router.push("/forgot-password");
    }
  }, [resetToken, router]);

  if (!resetToken) {
    return null; // or a loading spinner
  }

  return (
    <div className="font-poppins relative min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl px-6 py-8">
        <div className="absolute top-8 left-4 md:top-10 md:left-8">
          <BackButton onClick={() => router.back()} title="" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20">
          <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
            <Image
              src="/reset-password-img.svg"
              alt="Reset Password"
              width={400}
              height={400}
              className="object-contain w-72 sm:w-80 md:w-96 lg:w-full"
              priority
            />
          </div>

          <div className="w-full md:w-1/2 max-w-md">
            <FormContainer
              title="Reset Password"
              subtitle="Please enter your new password below."
            >
              <form onSubmit={handleSubmit}>
                {/* Show general error message */}
                {errors.general && (
                  <div className="text-red-500 text-sm mb-4 text-center bg-red-50 border border-red-200 rounded-md p-3">
                    {errors.general}
                  </div>
                )}

                <InputField
                  type="password"
                  placeholder="Enter New Password"
                  label="New Password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  error={errors.newPassword}
                />

                <InputField
                  type="password"
                  placeholder="Confirm New Password"
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                />

                <Button
                  type="submit"
                  className="mt-4 w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>
            </FormContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
