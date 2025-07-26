"use server";

import { loginSchema } from "../../validations/auth/login";
import { forgotPasswordSchema } from "../../validations/auth/forgot-password";
import { verifyOtpSchema } from "../../validations/auth/verify-otp";
import { resetPasswordSchema } from "../../validations/auth/reset-password";
import { signIn } from "@/server/auth";
import { redirect, RedirectType } from "next/navigation";
import { AuthError } from "next-auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loginAction(prevState: any, formData: FormData) {
  const emailOrPhone = formData.get("emailOrPhone");
  const password = formData.get("password");

  const valid = loginSchema.safeParse({ emailOrPhone, password });
  if (!valid.success) {
    const { fieldErrors } = valid.error.flatten();
    return { success: false, errors: fieldErrors };
  }

  try {
    await signIn("credentials", {
      email: valid.data.emailOrPhone,
      password: valid.data.password,
      redirect: false,
    });
    
    // If sign in is successful, redirect to dashboard
    redirect("/", RedirectType.push);
  } catch (error) {
    console.error("Login error:", error);
    
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            errors: {
              emailOrPhone: ["Invalid email/phone or password."],
            },
          };
        default:
          return {
            success: false,
            errors: {
              emailOrPhone: ["Something went wrong. Please try again."],
            },
          };
      }
    }
    
    // Re-throw redirect errors
    throw error;
  }
}

//for forgot-password
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

  const redirectUrl = `/verify-otp?contact=${encodeURIComponent(email)}`;
  return { success: true, redirect: redirectUrl };
}

//for verify-otp
export async function verifyOtpAction(
  prevState: { success?: boolean; errors?: Record<string, string[]> },
  formData: FormData
) {
  const otp = formData.get("otp");
  const contact = formData.get("contact") as string;

  // Validate only the OTP as per your schema
  const validationResult = verifyOtpSchema.safeParse({ otp });

  if (!validationResult.success) {
    const { fieldErrors } = validationResult.error.flatten();
    return { success: false, errors: fieldErrors };
  }

  // Here you would make an API call to verify the OTP
  // For example:
  // try {
  //   const response = await verifyOtpWithApi(otp, contact);
  //   if (response.success) {
  //     return {
  //       success: true,
  //       redirect: `/reset-password?contact=${encodeURIComponent(contact)}`
  //     };
  //   } else {
  //     return {
  //       success: false,
  //       errors: { otp: ['Invalid verification code'] }
  //     };
  //   }
  // } catch (error) {
  //   return {
  //     success: false,
  //     errors: { otp: ['Failed to verify code. Please try again.'] }
  //   };
  // }

  // For now, we'll just simulate success and redirect
  const redirectUrl = `/reset-password?contact=${encodeURIComponent(contact)}`;
  return { success: true, redirect: redirectUrl };
}

//for reset-password

export async function resetPasswordAction(
  prevState: { success?: boolean; errors?: Record<string, string[]> },
  formData: FormData
) {
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const contact = formData.get("contact");

  const validationResult = resetPasswordSchema.safeParse({
    password,
    confirmPassword,
    contact,
  });

  if (!validationResult.success) {
    const { fieldErrors } = validationResult.error.flatten();
    return { success: false, errors: fieldErrors };
  }

  // Here you would make an API call to update the password
  // try {
  //   const response = await updatePasswordWithApi(contact, password);
  //   if (response.success) {
  //     return { success: true, redirect: "/login" };
  //   } else {
  //     return {
  //       success: false,
  //       errors: { password: ["Failed to update password. Please try again."] },
  //     };
  //   }
  // } catch (error) {
  //   return {
  //     success: false,
  //     errors: { password: ["An error occurred. Please try again."] },
  //   };
  // }

  // For now, we'll just simulate success and redirect
  return { success: true, redirect: "/login" };
}
