"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormContainer from "../../../components/auth/FormContainer";
import InputField from "../../../components/ui/InputField";
import Button from "../../../components/ui/Button";
import BackButton from "../../../components/ui/BackButton";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBack = () => {
    router.back();
  };

  const handleSendCode = () => {
    console.log("Send code to:", formData.email);
    // Redirect to OTP verification page
    router.push(`/verify-otp?contact=${encodeURIComponent(formData.email)}`);
  };

  return (
    <div className="font-poppins relative">
      <div className="w-full max-w-md mx-auto px-6 py-8">
        <div className="mb-4">
          <BackButton onClick={handleBack} title="" />
        </div>

        {/* Image container */}
        <div className="flex justify-center mb-6">
          <Image
            src="forgot-password-img.svg"
            alt="Forgot Password"
            width={300}
            height={250}
            className="object-contain"
          />
        </div>

        <FormContainer
          title="Forgot Password?"
          subtitle="Don’t worry! It happens. Please enter the email address linked with your account."
        >
          <InputField
            type="text"
            placeholder="Enter Email Address"
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Button onClick={handleSendCode} className="mt-4">
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
  );
}
