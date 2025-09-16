import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import * as z from "zod";
import { firstStepSchema } from "@/lib/validations/auth/signup";
import AuthLayout from "@/components/auth/AuthLayout";
import FormContainer from "@/components/auth/FormContainer";
import InputField from "@/components/ui/InputField";
import { Button } from "@/components/ui/shadcn-button";
import type { SignupFormData } from "@/lib/validations/auth/signup";

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
      const { businessName, email, phoneNumber, password, confirmPassword } =
        formData;
      const step1Data = {
        businessName,
        email,
        phoneNumber,
        password,
        confirmPassword,
      };
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
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNextWithValidation = () => {
    if (validateForm()) {
      handleNext();
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
          <div className="w-full">
            <InputField
              type="text"
              placeholder="Enter Business Name"
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              error={errors.businessName}
              className={`mb-4 lg:mb-5 ${
                errors.businessName ? "border-red-500" : ""
              }`}
            />
            <InputField
              type="email"
              placeholder="Enter Email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              className={`mb-4 lg:mb-5 ${errors.email ? "border-red-500" : ""}`}
            />
            <InputField
              type="text"
              placeholder="Enter Phone Number"
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              className={`mb-4 lg:mb-5 ${
                errors.phoneNumber ? "border-red-500" : ""
              }`}
            />
            <InputField
              type="password"
              placeholder="Enter Password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              className={`mb-4 lg:mb-5 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            <InputField
              type="password"
              placeholder="Enter Password Again"
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              className={`mb-4 lg:mb-5 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            <Button
              onClick={handleNextWithValidation}
              className="w-full py-3 lg:py-4 mt-2 text-base font-medium transition-all duration-300 hover:shadow-lg"
            >
              Next
            </Button>
            <p className="text-center text-sm lg:text-sm mt-6 lg:mt-8 mb-4 lg:mb-6 text-text">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline transition-colors duration-200"
              >
                Log In
              </Link>
            </p>
          </div>
        </FormContainer>
      </AuthLayout>
    </motion.div>
  );
}
