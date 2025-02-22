"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../../../components/auth/AuthLayout";
import FormContainer from "../../../components/auth/FormContainer";
import InputField from "../../../components/ui/InputField";
import Button from "../../../components/ui/Button";
import BackButton from "../../../components/ui/BackButton";
import Link from "next/link";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    licenseFile: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, files } = e.target;

    if (type === "file" && files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      const { value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleNext = () => {
    setDirection(1);
    setStep(2);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(1);
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const slideTransition = {
    duration: 0.6,
    ease: "easeInOut",
  };

  const renderStep1 = () => (
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
          />
          <InputField
            type="email"
            placeholder="Enter Email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            type="text"
            placeholder="Enter Phone Number"
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <InputField
            type="password"
            placeholder="Enter Password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <InputField
            type="password"
            placeholder="Enter Password Again"
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button onClick={handleNext} className="mt-4">
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

  const renderStep2 = () => (
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
          />
          <Button onClick={handleSubmit} className="mt-4">
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

  return (
    <div className="font-poppins relative">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        {step === 1 ? renderStep1() : renderStep2()}
      </AnimatePresence>
    </div>
  );
}
