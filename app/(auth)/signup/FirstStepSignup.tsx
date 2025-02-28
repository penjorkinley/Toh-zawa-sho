import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import * as z from "zod";
import { firstStepSchema } from "@/lib/validations/signup";
import AuthLayout from "@/components/auth/AuthLayout";
import FormContainer from "@/components/auth/FormContainer";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import type { SignupFormData } from "@/lib/validations/signup";

interface FirstStepSignupProps {
  formData: SignupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => void;
  direction: number;
  slideVariants: any;
  slideTransition: any;
}

export default function FirstStepSignup({
  formData,
  handleChange,
  handleNext,
  direction,
  slideVariants,
  slideTransition,
}: FirstStepSignupProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    try {
      // Only validate the fields in step 1
      const { businessName, email, phoneNumber, password, confirmPassword } = formData;
      const step1Data = { businessName, email, phoneNumber, password, confirmPassword };
      console.log("Validating data:", step1Data);
      firstStepSchema.parse(step1Data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            const fieldName = err.path[0].toString();
            newErrors[fieldName] = err.message;
            console.log(`Validation error for ${fieldName}:`, err.message);
          }
        });
        setErrors(newErrors);
        console.log("All validation errors:", newErrors);
      }
      return false;
    }
  };

  const handleNextWithValidation = () => {
    console.log("Starting form validation...");
    console.log("Current form data:", formData);
    if (validateForm()) {
      console.log("Form validation passed, moving to next step");
      handleNext();
    } else {
      console.log("Form validation failed with errors:", errors);
    }
  };

  return (
    <motion.div
      key="step1"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={slideTransition}
      className="w-full"
    >
      <AuthLayout>
        <FormContainer
          title="Joenpa Lekso!"
          subtitle="Join us to start using our services."
        >
          <InputField
            type="text"
            placeholder="Enter Business Name"
            label="Business Name"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            error={errors.businessName}
            className={errors.businessName ? "border-red-500" : ""}
          />
          <InputField
            type="email"
            placeholder="Enter Email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            className={errors.email ? "border-red-500" : ""}
          />
          <InputField
            type="text"
            placeholder="Enter Phone Number"
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
            className={errors.phoneNumber ? "border-red-500" : ""}
          />
          <InputField
            type="password"
            placeholder="Enter Password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            className={errors.password ? "border-red-500" : ""}
          />
          <InputField
            type="password"
            placeholder="Enter Password Again"
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            className={errors.confirmPassword ? "border-red-500" : ""}
          />
          <Button onClick={handleNextWithValidation} className="mt-4">
            Next
          </Button>
          <p className="text-center text-sm mt-4 text-text">
            Already have an account?{" "}
            <Link href="/login" className="text-primary">
              Log In
            </Link>
          </p>
        </FormContainer>
      </AuthLayout>
    </motion.div>
  );
}