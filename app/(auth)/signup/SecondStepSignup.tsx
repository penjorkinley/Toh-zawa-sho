import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import * as z from "zod";
import { secondStepSchema } from "@/lib/validations/signup";
import type { SignupFormData } from "@/lib/validations/signup";
import FormContainer from "@/components/auth/FormContainer";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";

interface SecondStepSignupProps {
  formData: SignupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBack: () => void;
  handleSubmit: () => void;
  direction: number;
  slideVariants: any;
  slideTransition: any;
}

export default function SecondStepSignup({
  formData,
  handleChange,
  handleBack,
  handleSubmit,
  direction,
  slideVariants,
  slideTransition,
}: SecondStepSignupProps) {
  const [error, setError] = useState<string | null>(null);

  const validateAndSubmit = async () => {
    try {
      console.log("Validating file upload...");
      // Validate the file upload
      await secondStepSchema.parseAsync({
        licenseFile: formData.licenseFile,
      });

      console.log("File validation passed, submitting form data:", formData);
      await handleSubmit();
      console.log("Form submitted successfully!");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessage = err.errors[0]?.message || "Invalid file";
        console.error("Validation error:", errorMessage);
        setError(errorMessage);
      } else {
        console.error("Submission error:", err);
        setError("Failed to submit form. Please try again.");
      }
    }
  };

  return (
    <motion.div
      key="step2"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={slideTransition}
      className="min-h-screen w-full bg-white"
    >
      <div className="w-full max-w-md mx-auto px-6 py-8">
        <div className="mb-4">
          <BackButton onClick={handleBack} title="License Registration Copy" />
        </div>

        <FormContainer title="" subtitle="">
          <InputField
            type="file"
            label="Upload License Registration File"
            name="licenseFile"
            onChange={handleChange}
            error={error}
            className={error ? "border-red-500" : ""}
          />
          <Button onClick={validateAndSubmit} className="mt-4">
            Submit
          </Button>
          <p className="text-center text-sm mt-4 text-text">
            Already have an account?{" "}
            <Link href="/login" className="text-primary">
              Log In
            </Link>
          </p>
        </FormContainer>
      </div>
    </motion.div>
  );
}
