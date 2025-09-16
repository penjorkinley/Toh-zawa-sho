"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormContainer from "@/components/auth/FormContainer";
import InputField from "@/components/ui/InputField";
import { Button } from "@/components/ui/shadcn-button";
import BackButton from "@/components/ui/BackButton";
import Image from "next/image";
import { useActionState } from "react";
import { resetPasswordAction } from "@/lib/actions/auth/actions";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get("contact") || "";

  const [state, callResetPasswordAction] = useActionState(resetPasswordAction, {
    success: false,
    errors: {},
  });

  useEffect(() => {
    if (state.redirect) {
      router.push(state.redirect);
    }
  }, [state.redirect, router]);

  return (
    <div className="font-poppins relative min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl px-6 py-8">
        <div className="absolute top-8 left-4 md:top-10 md:left-8">
          <BackButton onClick={() => router.back()} title="" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20">
          <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
            <Image
              src="/reset-password-img.svg"
              alt="Reset Password"
              width={400}
              height={400}
              className="object-contain w-72 sm:w-80 md:w-96 lg:w-full"
              priority
            />
          </div>

          <div className="w-full md:w-1/2 max-w-md">
            <FormContainer
              title="Reset Password"
              subtitle="Please enter your new password below."
            >
              <form action={callResetPasswordAction}>
                <input type="hidden" name="contact" value={contact} />

                <InputField
                  type="password"
                  placeholder="Enter New Password"
                  label="New Password"
                  name="password"
                  error={state.errors?.password}
                />

                <InputField
                  type="password"
                  placeholder="Confirm New Password"
                  label="Confirm Password"
                  name="confirmPassword"
                  error={state.errors?.confirmPassword}
                />
                <Button className="mt-4 w-full">Reset Password</Button>
              </form>
            </FormContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
