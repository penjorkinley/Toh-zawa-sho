"use client";

import { useState, useTransition } from "react";
import { AnimatePresence } from "framer-motion";
import FirstStepSignup from "./signup/FirstStepSignup";
import SecondStepSignup from "./signup/SecondStepSignup";
import {
  slideVariants,
  slideTransition,
  useStepNavigation,
} from "@/lib/framer-motion/utils";
import type { SignupFormData } from "@/lib/validations/auth/signup";

export default function SignupForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
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
    startTransition(() => {
      try {
        // todo: signup helper function here so it sends data to server.
        console.log("Form submitted successfully!");
        setError(null);
      } catch (err) {
        console.error("Submission error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    });
  };

  return (
        <div className="flex flex-col items-center justify-center gap-12 lg:gap-20 pt-16 lg:pt-0">
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
            
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            {isPending && (
              <div className="bg-white p-4 rounded-lg mt-4 text-center">
                Submitting...
              </div>
            )}
        </div>
  );
}
