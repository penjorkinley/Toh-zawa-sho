// lib/actions/auth/actions.ts - FIXED LOGIN ACTION SIGNATURE
"use server";

import { forgotPasswordSchema } from "../../validations/auth/forgot-password";
import { loginSchema } from "../../validations/auth/login";
import { resetPasswordSchema } from "../../validations/auth/reset-password";
import { signupSchema } from "../../validations/auth/signup";
import { verifyOtpSchema } from "../../validations/auth/verify-otp";

// Define the exact state type that matches what the component expects
type LoginActionState = {
  success: boolean;
  errors?: {
    emailOrPhone?: string[];
    password?: string[];
  };
  error?: string;
  redirectUrl?: string;
  user?: any;
};

// Login Action - FIXED: Proper signature for useActionState/useFormState
export async function loginAction(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const emailOrPhone = formData.get("emailOrPhone") as string;
  const password = formData.get("password") as string;

  const valid = loginSchema.safeParse({ emailOrPhone, password });
  if (!valid.success) {
    const { fieldErrors } = valid.error.flatten();
    return {
      success: false,
      errors: fieldErrors,
    };
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

    // Return success with redirect URL
    return {
      success: true,
      redirectUrl: result.redirectUrl,
      user: result.user,
    };
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

// Rest of your actions remain the same...
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

export async function forgotPasswordAction(
  prevState: {
    success?: boolean;
    errors?: Record<string, string[]>;
    error?: string;
  },
  formData: FormData
) {
  const email = formData.get("email") as string;

  const validationResult = forgotPasswordSchema.safeParse({ email });

  if (!validationResult.success) {
    const { fieldErrors } = validationResult.error.flatten();
    return { success: false, errors: fieldErrors };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to send verification code",
      };
    }

    const redirectUrl = `/verify-otp?contact=${encodeURIComponent(email)}`;
    return {
      success: true,
      redirect: redirectUrl,
      message: result.message,
    };
  } catch (error) {
    console.error("Forgot password action error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function verifyOtpAction(
  prevState: {
    success?: boolean;
    errors?: Record<string, string[]>;
    error?: string;
  },
  formData: FormData
) {
  const otp = formData.get("otp") as string;
  const contact = formData.get("contact") as string;

  const validationResult = verifyOtpSchema.safeParse({ otp });

  if (!validationResult.success) {
    const { fieldErrors } = validationResult.error.flatten();
    return { success: false, errors: fieldErrors };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-reset-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: contact, otp }),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Invalid or expired OTP code",
        attemptsRemaining: result.attemptsRemaining,
      };
    }

    return {
      success: true,
      redirect: `/reset-password?token=${encodeURIComponent(
        result.resetToken
      )}`,
      message: result.message,
    };
  } catch (error) {
    console.error("Verify OTP action error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function resetPasswordAction(
  prevState: {
    success?: boolean;
    errors?: Record<string, string[]>;
    error?: string;
  },
  formData: FormData
) {
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const resetToken = formData.get("resetToken") as string;

  const validationResult = resetPasswordSchema.safeParse({
    newPassword,
    confirmPassword,
  });

  if (!validationResult.success) {
    const { fieldErrors } = validationResult.error.flatten();
    return { success: false, errors: fieldErrors };
  }

  if (!resetToken) {
    return {
      success: false,
      error:
        "Invalid reset session. Please start the password reset process again.",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetToken,
          newPassword,
          confirmPassword,
        }),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to reset password",
        errors: result.errors,
      };
    }

    return {
      success: true,
      redirect: "/login",
      message: result.message,
    };
  } catch (error) {
    console.error("Reset password action error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
