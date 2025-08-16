// app/(auth)/login/page.tsx - FINAL FIXED VERSION
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import FormContainer from "@/components/auth/FormContainer";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth/actions";

// Define the state type to match the action
type LoginState = {
  success: boolean;
  errors?: {
    emailOrPhone?: string[];
    password?: string[];
  };
  error?: string;
  redirectUrl?: string;
  user?: any;
};

export default function LoginPage() {
  const router = useRouter();

  // Initial state with all possible properties
  const initialState: LoginState = {
    success: false,
    errors: {},
  };

  const [state, callLoginAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  // Handle redirect after successful login
  useEffect(() => {
    if (state.success && state.redirectUrl) {
      router.push(state.redirectUrl);
    }
  }, [state.success, state.redirectUrl, router]);

  return (
    <div className="font-poppins">
      <AuthLayout>
        <FormContainer
          title="Kuzu Zangpo La!"
          subtitle="Log in to continue using Toh Zawa Sho."
        >
          <form action={callLoginAction} className="w-full">
            <InputField
              type="text"
              placeholder="Enter Email or Phone no."
              label="Email / Phone No."
              name="emailOrPhone"
              error={state.errors?.emailOrPhone}
              className="mb-5"
            />
            <InputField
              type="password"
              placeholder="Enter Password"
              label="Password"
              name="password"
              error={state.errors?.password}
              className="mb-2"
            />

            {/* Display general error if any */}
            {state.error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{state.error}</p>
              </div>
            )}

            <Link
              href="/forgot-password"
              className="text-right text-sm text-primary block mb-5 lg:mb-6 hover:underline transition-colors duration-200 hover:text-primary/80"
            >
              Forgot Password?
            </Link>

            {/* Button with loading state */}
            <Button
              className={`w-full py-3 lg:py-4 text-base font-medium transition-all duration-300 hover:shadow-lg ${
                isPending ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </Button>

            <p className="text-center text-sm lg:text-base mt-6 lg:mt-8 text-text">
              Want to use Toh Zawa Sho?{" "}
              <Link
                href="/signup"
                className="text-primary font-medium hover:underline transition-colors duration-200"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </FormContainer>
      </AuthLayout>
    </div>
  );
}
