"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormContainer from "../../../components/auth/FormContainer";
import Button from "../../../components/ui/Button";
import BackButton from "../../../components/ui/BackButton";
import Link from "next/link";
import Image from "next/image";

export default function VerifyOTPPage() {
  const router = useRouter();

  const [otpCode, setOtpCode] = useState<string[]>(["", "", "", ""]);

  const handleInputChange = (index: number, value: string) => {
    const newOtpCode = [...otpCode];
    newOtpCode[index] = value;
    setOtpCode(newOtpCode);

    // Automatically move to the next input field if the current one is filled
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    console.log("Verifying OTP:", otpCode.join(""));
    // If verification is successful, redirect to a success page or reset password page
    router.push("/reset-password");
  };

  const handleBack = () => {
    router.back();
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
            src="otp-verification-img.svg"
            alt="OTP Verification"
            width={300}
            height={250}
            className="object-contain"
          />
        </div>
        <FormContainer
          title="OTP Verification"
          subtitle="Enter the verification code we just sent you on your email address."
        >
          <div className="flex justify-center space-x-2 mb-4">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                className="w-10 h-12 rounded-md text-center border border-primary focus:outline-none"
                value={otpCode[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>
          <Button onClick={handleVerify} className="mt-4">
            Verify
          </Button>
          <p className="text-center text-sm mt-4 text-text">
            Didn't receive the code?{" "}
            <Link href="/forgot-password" className="text-primary">
              Resend Code
            </Link>
          </p>
        </FormContainer>
      </div>
    </div>
  );
}
