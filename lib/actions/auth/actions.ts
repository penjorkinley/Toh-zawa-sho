// lib/actions/auth/actions.ts
"use server";

import { redirect } from "next/navigation";
import { forgotPasswordSchema } from "../../validations/auth/forgot-password";
import { loginSchema } from "../../validations/auth/login";
import { resetPasswordSchema } from "../../validations/auth/reset-password";
import { signupSchema } from "../../validations/auth/signup";
import { verifyOtpSchema } from "../../validations/auth/verify-otp";

// Login Action
export async function loginAction(prevState: any, formData: FormData) {
  const emailOrPhone = formData.get("emailOrPhone") as string;
  const password = formData.get("password") as string;

  const valid = loginSchema.safeParse({ emailOrPhone, password });
  if (!valid.success) {
    const { fieldErrors } = valid.error.flatten();
    return { success: false, errors: fieldErrors };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(valid.data),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    // Redirect based on the response
    redirect(result.redirectUrl);
  } catch (error) {
    console.error("Login action error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
    };
  }
}

// Signup Action
export async function signupAction(formData: FormData) {
  const businessName = formData.get("businessName") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const licenseFile = formData.get("licenseFile") as File;

  const valid = signupSchema.safeParse({
    businessName,
    email,
    phoneNumber,
    password,
    confirmPassword,
    licenseFile,
  });

  if (!valid.success) {
    const { fieldErrors } = valid.error.flatten();
    return { success: false, errors: fieldErrors };
  }

  try {
    const signupFormData = new FormData();
    signupFormData.append("businessName", businessName);
    signupFormData.append("email", email);
    signupFormData.append("phoneNumber", phoneNumber);
    signupFormData.append("password", password);
    signupFormData.append("confirmPassword", confirmPassword);
    signupFormData.append("licenseFile", licenseFile);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/signup`,
      {
        method: "POST",
        body: signupFormData,
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error,
        errors: result.errors,
      };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error("Signup action error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
    };
  }
}

// Complete First Login Action
export async function completeFirstLoginAction(userId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/complete-first-login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Complete first login error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to complete setup. Please try again.",
    };
  }
}

// For forgot-password
export async function forgotPasswordAction(
  prevState: { success?: boolean; errors?: Record<string, string[]> },
  formData: FormData
) {
  const email = formData.get("email") as string;

  const validationResult = forgotPasswordSchema.safeParse({ email });

  if (!validationResult.success) {
    const { fieldErrors } = validationResult.error.flatten();
    return { success: false, errors: fieldErrors };
  }

  // TODO: Implement forgot password with Supabase
  // For now, just redirect to OTP page
  const redirectUrl = `/verify-otp?contact=${encodeURIComponent(email)}`;
  return { success: true, redirect: redirectUrl };
}

// For verify-otp
export async function verifyOtpAction(
  prevState: { success?: boolean; errors?: Record<string, string[]> },
  formData: FormData
) {
  const otp = formData.get("otp");
  const contact = formData.get("contact") as string;

  const validationResult = verifyOtpSchema.safeParse({ otp });

  if (!validationResult.success) {
    const { fieldErrors } = validationResult.error.flatten();
    return { success: false, errors: fieldErrors };
  }

  // TODO: Implement OTP verification with Supabase
  // For now, redirect to reset password
  return {
    success: true,
    redirect: `/reset-password?contact=${encodeURIComponent(contact)}`,
  };
}

// For reset-password
export async function resetPasswordAction(
  prevState: { success?: boolean; errors?: Record<string, string[]> },
  formData: FormData
) {
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  const validationResult = resetPasswordSchema.safeParse({
    newPassword,
    confirmPassword,
  });

  if (!validationResult.success) {
    const { fieldErrors } = validationResult.error.flatten();
    return { success: false, errors: fieldErrors };
  }

  // TODO: Implement password reset with Supabase
  // For now, redirect to login
  return {
    success: true,
    redirect: "/login",
  };
}
