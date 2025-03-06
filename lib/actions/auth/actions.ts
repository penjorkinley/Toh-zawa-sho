"use server";

import { loginSchema } from "../../validations/auth/login";
import { forgotPasswordSchema } from "../../validations/auth/forgot-password";
import { verifyOtpSchema } from "../../validations/auth/verify-otp";
import { resetPasswordSchema } from "../../validations/auth/reset-password";

export async function loginAction(prevState: any, formData: FormData) {
  const emailOrPhone = formData.get("emailOrPhone");
  const password = formData.get("password");

  const valid = loginSchema.safeParse({ emailOrPhone, password });
  if (!valid.success) {
    const { fieldErrors } = valid.error.flatten();
    return { success: false, errors: fieldErrors };
  }
  console.log(valid.data);
  // perform the api calls here
  //   try {
  //     const res = await loginUser({
  //       emailOrPhone,
  //       password,
  //     });
  //     return {
  //       success: true,
  //       data: res,
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       error: error.message,
  //     };
  //   }

  return {};
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
  const otp = formData.get("otp") as string;
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
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const contact = formData.get("contact") as string;

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
