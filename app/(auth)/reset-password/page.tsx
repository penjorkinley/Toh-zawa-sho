"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormContainer from "../../../components/auth/FormContainer";
import InputField from "../../../components/ui/InputField";
import Button from "../../../components/ui/Button";
import BackButton from "../../../components/ui/BackButton";
import Image from "next/image";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleResetPassword = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Resetting password:", formData.password);
    // Add your API call to reset the password here
    // On success, redirect to login page
    router.push("/login");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="font-poppins relative">
      <div className="w-full max-w-md mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton onClick={handleBack} title="" />
        </div>

        {/* Image Container */}
        <div className="flex justify-center mb-6">
          <Image
            src="reset-password-img.svg"
            alt="Reset Password"
            width={300}
            height={250}
            className="object-contain"
          />
        </div>

        {/* Form Container */}
        <FormContainer
          title="Reset Password"
          subtitle="Please enter your new password below."
        >
          {/* Password Input Field */}
          <InputField
            type="password"
            placeholder="Enter New Password"
            label="New Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          {/* Confirm Password Input Field */}
          <InputField
            type="password"
            placeholder="Confirm New Password"
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {/* Submit Button */}
          <Button onClick={handleResetPassword} className="mt-4">
            Reset Password
          </Button>
        </FormContainer>
      </div>
    </div>
  );
}
