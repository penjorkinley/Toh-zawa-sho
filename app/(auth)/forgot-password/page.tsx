"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormContainer from "../../../components/auth/FormContainer";
import InputField from "../../../components/ui/InputField";
import Button from "../../../components/ui/Button";
import BackButton from "../../../components/ui/BackButton";
import Link from "next/link";
import Image from "next/image";
import * as z from "zod";

// Define the validation schema for the forgot password form
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Validate the form using Zod
  const validateForm = () => {
    try {
      forgotPasswordSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            const fieldName = err.path[0].toString();
            newErrors[fieldName] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Handle sending the code with validation
  const handleSendCode = () => {
    console.log("Starting form validation...");
    if (validateForm()) {
      console.log("Form validation passed, sending code to:", formData.email);
      // Redirect to OTP verification page
      router.push(`/verify-otp?contact=${encodeURIComponent(formData.email)}`);
    } else {
      console.log("Form validation failed with errors:", errors);
    }
  };

  return (
    <div className="font-poppins relative min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl px-6 py-8">
        {/* Back button is visible on all screen sizes */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <BackButton onClick={handleBack} title="" />
        </div>

        {/* Main content container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Image container - full width on mobile, left side on desktop */}
          <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
            <Image
              src="/forgot-password-img.svg"
              alt="Forgot Password"
              width={400}
              height={400}
              className="object-contain w-64 sm:w-80 md:w-96 lg:w-full"
              priority
            />
          </div>

          {/* Form container - full width on mobile, right side on desktop */}
          <div className="w-full md:w-1/2 max-w-md">
            <FormContainer
              title="Forgot Password?"
              subtitle="Don't worry! It happens. Please enter the email address linked with your account."
            >
              <InputField
                type="text"
                placeholder="Enter Email Address"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                className={errors.email ? "border-red-500" : ""}
              />

              <Button onClick={handleSendCode} className="mt-4 w-full">
                Send Code
              </Button>

              <p className="text-center text-sm mt-4 text-text">
                Remember your password?{" "}
                <Link href="/login" className="text-primary">
                  Log In
                </Link>
              </p>
            </FormContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
