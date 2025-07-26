"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/actions/auth/actions";

export default function ForgotPasswordForm() {
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
      <form action={callForgotPasswordAction} className="space-y-6">
        <InputField
          type="text"
          placeholder="Enter Email Address"
          label="Email Address"
          name="email"
          error={state.errors?.email}
        />

        <Button className="w-full">Send Code</Button>
      </form>
  );
}
