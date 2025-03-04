"use client";

import AuthLayout from "../../../components/auth/AuthLayout";
import FormContainer from "../../../components/auth/FormContainer";
import InputField from "../../../components/ui/InputField";
import Button from "../../../components/ui/Button";
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
          <form action={callLoginAction}>
            <InputField
              type="text"
              placeholder="Enter Email or Phone no."
              label="Email / Phone No."
              name="emailOrPhone"
              error={state.errors?.emailOrPhone}
            />
            <InputField
              type="password"
              placeholder="Enter Password"
              label="Password"
              name="password"
              error={state.errors?.password}
            />
            <Link
              href="/forgot-password"
              className="text-right text-sm text-primary block mb-4 "
            >
              Forgot Password?
            </Link>
            <Button>Login</Button>
            <p className="text-center text-sm mt-4 text-text ">
              Want to use Toh Zawa Sho?{" "}
              <Link href="/signup" className="text-primary">
                Sign Up
              </Link>
            </p>
          </form>
        </FormContainer>
      </AuthLayout>
    </div>
  );
}
