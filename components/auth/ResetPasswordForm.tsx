"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useActionState } from "react";
import { resetPasswordAction } from "@/lib/actions/auth/actions";

export default function ResetPasswordForm() {
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
      <form action={callResetPasswordAction} className="space-y-6">
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
        
        <Button className="w-full">Reset Password</Button>
      </form>
  );
}
