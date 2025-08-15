// app/(auth)/signup/page.tsx
"use client";

import { useState, useTransition } from "react";
import { AnimatePresence } from "framer-motion";
import FirstStepSignup from "./FirstStepSignup";
import SecondStepSignup from "./SecondStepSignup";
import {
  slideVariants,
  slideTransition,
  useStepNavigation,
} from "@/lib/framer-motion/utils";
import type { SignupFormData } from "@/lib/validations/auth/signup";
import { signupAction } from "@/lib/actions/auth/actions";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<SignupFormData>({
    businessName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    licenseFile: null,
  });

  const { handleNext, handleBack } = useStepNavigation(setStep, setDirection);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, files } = e.target;

    if (type === "file" && files && files.length > 0) {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
    } else {
      const { value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        setError(null);

        // Create FormData for the API call
        const submitFormData = new FormData();
        submitFormData.append("businessName", formData.businessName);
        submitFormData.append("email", formData.email);
        submitFormData.append("phoneNumber", formData.phoneNumber);
        submitFormData.append("password", formData.password);
        submitFormData.append("confirmPassword", formData.confirmPassword);

        if (formData.licenseFile) {
          submitFormData.append("licenseFile", formData.licenseFile);
        }

        const result = await signupAction(submitFormData);

        if (!result.success) {
          if (result.errors) {
            // Handle validation errors
            const errorMessages = Object.values(result.errors).flat();
            setError(errorMessages.join(", "));
          } else {
            setError(result.error || "Registration failed");
          }
          return;
        }

        // Success! Show success message
        setSuccessMessage(result.message || "Registration successful!");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err) {
        console.error("Submission error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  // Show success message if registration was successful
  if (successMessage) {
    return (
      <div className="font-poppins min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              Registration Successful!
            </h2>
            <p className="text-green-700 mb-4">{successMessage}</p>
            <p className="text-sm text-green-600">
              Redirecting you to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-poppins relative">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        {step === 1 ? (
          <FirstStepSignup
            formData={formData}
            handleChange={handleChange}
            handleNext={handleNext}
            direction={direction}
            slideVariants={slideVariants}
            slideTransition={slideTransition}
          />
        ) : (
          <SecondStepSignup
            formData={formData}
            handleChange={handleChange}
            handleBack={handleBack}
            handleSubmit={handleSubmit}
            direction={direction}
            slideVariants={slideVariants}
            slideTransition={slideTransition}
          />
        )}
      </AnimatePresence>

      {error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md w-full mx-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Submitting your registration...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
