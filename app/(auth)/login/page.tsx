"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import FormContainer from "@/components/auth/FormContainer";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth/actions";

export default function LoginPage() {
  const [state, callLoginAction] = useActionState(loginAction, {});
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
            <Link
              href="/forgot-password"
              className="text-right text-sm text-primary block mb-5 lg:mb-6 hover:underline transition-colors duration-200 hover:text-primary/80"
            >
              Forgot Password?
            </Link>
            <Button className="w-full py-3 lg:py-4 text-base font-medium transition-all duration-300 hover:shadow-lg">
              Login
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
