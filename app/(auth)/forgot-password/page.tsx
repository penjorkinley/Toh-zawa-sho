"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FormContainer from "../../../components/auth/FormContainer";
import InputField from "../../../components/ui/InputField";
import Button from "../../../components/ui/Button";
import BackButton from "../../../components/ui/BackButton";
import Link from "next/link";
import Image from "next/image";
import { forgotPasswordAction } from "@/lib/actions/auth/actions";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [state, callForgotPasswordAction] = useActionState(
    forgotPasswordAction,
    { success: false, errors: {} }
  );

  useEffect(() => {
    if (state.redirect) {
      router.push(state.redirect);
    }
  }, [state.redirect]);

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
              <form action={callForgotPasswordAction}>
                <InputField
                  type="text"
                  placeholder="Enter Email Address"
                  label="Email Address"
                  name="email"
                  error={state.errors?.email}
                />

                <Button className="mt-4 w-full">Send Code</Button>

                <p className="text-center text-sm mt-4 text-text">
                  Remember your password?{" "}
                  <Link href="/login" className="text-primary">
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
