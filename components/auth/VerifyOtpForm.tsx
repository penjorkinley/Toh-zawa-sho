"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormContainer from "@/components/auth/FormContainer";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useActionState } from "react";
import { verifyOtpAction } from "@/lib/actions/auth/actions";

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get("contact") || "";
  const [otpCode, setOtpCode] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, callVerifyOtpAction] = useActionState(verifyOtpAction, {
    success: false,
    errors: {},
  });

  useEffect(() => {
    if (state.redirect) {
      router.push(state.redirect);
    }
  }, [state.redirect, router]);

  // Timer for OTP resend
  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  const handleResendOtp = () => {
    if (canResend) {
      // Here you would call an API to resend the OTP
      console.log("Resending OTP to", contact);
      setTimer(60);
      setCanResend(false);
      // Reset OTP fields
      setOtpCode(["", "", "", ""]);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) {
      return;
    }

    const newOtpCode = [...otpCode];
    newOtpCode[index] = value;
    setOtpCode(newOtpCode);

    // Automatically move to the next input field if the current one is filled
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // If all fields are filled, auto-submit after a brief delay
    if (value && index === 3 && newOtpCode.every((digit) => digit)) {
      setTimeout(() => {
        formRef.current?.requestSubmit();
      }, 500);
    }
  };

  // Handle backspace navigation between fields
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Combine OTP digits for form submission
  const combinedOtp = otpCode.join("");

  return (
    <FormContainer
      title="OTP Verification"
      subtitle={`Enter the verification code we just sent you on ${
        contact || "your email address"
      }.`}
    >
      <form ref={formRef} action={callVerifyOtpAction} className="space-y-6">
        <input type="hidden" name="contact" value={contact} />
        <input type="hidden" name="otp" value={combinedOtp} />

        {state.errors?.otp && (
          <div className="text-red-500 text-sm mb-2 text-center">
            {state.errors.otp}
          </div>
        )}

        <div className="flex justify-center space-x-4 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`w-12 h-14 rounded-md text-center border text-lg font-medium
                ${
                  state.errors?.otp
                    ? "border-red-500"
                    : "border-gray-300"
                }
                focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
              value={otpCode[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={(e) => e.target.select()}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <div className="text-center text-sm mb-4">
          {canResend ? (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-primary hover:underline"
            >
              Resend Code
            </button>
          ) : (
            <span className="text-gray-500">
              Resend code in {timer} seconds
            </span>
          )}
        </div>

        <Button className="w-full">Verify</Button>

        <p className="text-center text-sm text-text">
          Remember your password?{" "}
          <Link href="/login" className="text-primary">
            Log In
          </Link>
        </p>
      </form>
    </FormContainer>
  );
}
