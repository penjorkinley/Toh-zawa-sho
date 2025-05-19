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

export default function SignupPage() {
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
      {error && <p>{error}</p>}
      {isPending && (
        <div className="bg-white p-4 rounded-lg">Submitting...</div>
      )}
    </div>
  );
}
