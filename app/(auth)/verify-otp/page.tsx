"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormContainer from "@/components/auth/FormContainer";
import { Button } from "@/components/ui/shadcn-button";
import BackButton from "@/components/ui/BackButton";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get("contact") || "";
  const [otpCode, setOtpCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer for OTP expiry (5 minutes)
  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
      toast.error("OTP has expired. Please request a new code.");
    }
  }, [timer, canResend]);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    if (canResend) {
      setLoading(true);
      const loadingToast = toast.loading("Resending verification code...");

      try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: contact }),
        });

        const result = await response.json();
        toast.dismiss(loadingToast);

        if (result.success) {
          toast.success("New verification code sent!");
          setTimer(300); // Reset to 5 minutes
          setCanResend(false);
          setOtpCode(["", "", "", "", "", ""]);
          setError(null);
        } else {
          toast.error(result.error || "Failed to resend code");
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Error resending OTP:", error);
        toast.error("Failed to resend code. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers and limit to 1 character
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtpCode = [...otpCode];
    newOtpCode[index] = value;
    setOtpCode(newOtpCode);

    // Clear error when user starts typing
    if (error) setError(null);

    // Auto-advance to next field if current field has a value
    if (value && index < 5) {
      // Use setTimeout to ensure the current input is updated first
      setTimeout(() => {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }, 10);
    }

    // If all fields are filled, auto-submit after a brief delay
    if (value && index === 5 && newOtpCode.every((digit) => digit)) {
      setTimeout(() => {
        handleSubmit(newOtpCode.join(""));
      }, 100);
    }
  };

  // Handle backspace navigation between fields
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (otpCode[index] === "" && index > 0) {
        // If current field is empty and backspace is pressed, move to previous field
        const prevInput = document.getElementById(`otp-${index - 1}`);
        prevInput?.focus();
      } else {
        // Clear current field
        const newOtpCode = [...otpCode];
        newOtpCode[index] = "";
        setOtpCode(newOtpCode);
        if (error) setError(null);
      }
    }
    // Handle arrow key navigation
    else if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle paste functionality
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData.length === 6) {
      const newOtpCode = pastedData.split("");
      setOtpCode(newOtpCode);
      if (error) setError(null);

      // Focus the last input
      setTimeout(() => {
        const lastInput = document.getElementById(`otp-5`);
        lastInput?.focus();
      }, 10);
    }
  };

  const handleSubmit = async (otp?: string) => {
    const otpToSubmit = otp || otpCode.join("");

    if (otpToSubmit.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError(null);
    const loadingToast = toast.loading("Verifying code...");

    try {
      const response = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: contact, otp: otpToSubmit }),
      });

      const result = await response.json();
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success("Code verified successfully!");
        router.push(
          `/reset-password?token=${encodeURIComponent(result.resetToken)}`
        );
      } else {
        toast.error(result.error || "Invalid code");
        setError(result.error || "Invalid code");

        // Clear OTP fields on error
        setOtpCode(["", "", "", "", "", ""]);
        // Focus first input
        const firstInput = document.getElementById("otp-0");
        firstInput?.focus();
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Verify OTP error:", error);
      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="font-poppins relative min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl px-6 py-8">
        <div className="absolute top-8 left-4 md:top-10 md:left-8">
          <BackButton onClick={() => router.back()} title="" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20">
          <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
            <Image
              src="/otp-verification-img.svg"
              alt="OTP Verification"
              width={400}
              height={400}
              className="object-contain w-72 sm:w-80 md:w-96 lg:w-full"
              priority
            />
          </div>

          <div className="w-full md:w-1/2 max-w-md">
            <FormContainer
              title="OTP Verification"
              subtitle={`Enter the verification code we just sent you on ${
                contact || "your email address"
              }.`}
            >
              <form onSubmit={handleFormSubmit}>
                {/* Show general error message */}
                {error && (
                  <div className="text-red-500 text-sm mb-4 text-center bg-red-50 border border-red-200 rounded-md p-3">
                    {error}
                  </div>
                )}

                <div className="flex justify-center space-x-3 mb-6">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      className={`w-10 h-12 rounded-md text-center border text-lg font-medium
                        ${error ? "border-red-500" : "border-gray-300"}
                        focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
                      value={otpCode[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      onFocus={(e) => e.target.select()}
                      autoFocus={index === 0}
                      disabled={loading}
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>

                <div className="text-center text-sm mb-4">
                  {timer > 0 ? (
                    <div className="space-y-1">
                      <p className="text-gray-600">
                        Code expires in:{" "}
                        <span className="font-medium text-primary">
                          {formatTime(timer)}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={!canResend || loading}
                        className="text-gray-400 text-xs cursor-not-allowed"
                      >
                        Resend code in {formatTime(timer)}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-primary hover:underline font-medium"
                    >
                      {loading ? "Resending..." : "Resend Code"}
                    </button>
                  )}
                </div>

                <Button
                  type="submit"
                  className="mt-4 w-full"
                  disabled={loading || otpCode.join("").length !== 6}
                >
                  {loading ? "Verifying..." : "Verify"}
                </Button>

                <p className="text-center text-sm mt-4 text-text">
                  Remember your password?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Log In
                  </Link>
                </p>
              </form>
            </FormContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
