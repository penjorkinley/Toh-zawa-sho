"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormContainer from "@/components/auth/FormContainer";
import InputField from "@/components/ui/InputField";
import { Button } from "@/components/ui/shadcn-button";
import BackButton from "@/components/ui/BackButton";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Show loading toast
    const loadingToast = toast.loading("Sending verification code...");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (result.success) {
        // Show success toast
        toast.success("Verification code sent to your email!");

        // Redirect to OTP verification page
        router.push(`/verify-otp?contact=${encodeURIComponent(email)}`);
      } else {
        // Show error toast
        toast.error(result.error || "Failed to send verification code");
        setError(result.error || "Failed to send verification code");
      }
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      console.error("Forgot password error:", error);
      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
              src="/forgot-password-img.svg"
              alt="Forgot Password"
              width={400}
              height={400}
              className="object-contain w-72 sm:w-80 md:w-96 lg:w-full"
              priority
            />
          </div>

          <div className="w-full md:w-1/2 max-w-md">
            <FormContainer
              title="Forgot Password?"
              subtitle="Don't worry! It happens. Please enter the email address linked with your account."
            >
              <form onSubmit={handleSubmit}>
                {/* Show general error message */}
                {error && (
                  <div className="text-red-500 text-sm mb-4 text-center bg-red-50 border border-red-200 rounded-md p-3">
                    {error}
                  </div>
                )}

                <InputField
                  type="email"
                  placeholder="Enter Email Address"
                  label="Email Address"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button
                  type="submit"
                  className="mt-4 w-full"
                  disabled={loading || !email.trim()}
                >
                  {loading ? "Sending..." : "Send Code"}
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
