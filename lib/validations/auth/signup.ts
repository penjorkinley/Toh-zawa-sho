// lib/validations/auth/signup.ts
import { z } from "zod";

// Strong password validation function
const strongPasswordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must not exceed 128 characters")
  .refine(
    (password) => /[a-z]/.test(password),
    "Password must contain at least one lowercase letter"
  )
  .refine(
    (password) => /[A-Z]/.test(password),
    "Password must contain at least one uppercase letter"
  )
  .refine(
    (password) => /\d/.test(password),
    "Password must contain at least one number"
  )
  .refine(
    (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
  );

// First step validation (personal details)
export const firstStepSchema = z
  .object({
    businessName: z.string().min(1, "Business name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    password: strongPasswordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Second step validation (file upload)
export const secondStepSchema = z.object({
  licenseFile: z
    .any()
    .refine(
      (file) => file !== null && file !== undefined,
      "Business license file is required"
    )
    .refine((file) => {
      if (!file) return false;
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      return allowedTypes.includes(file.type);
    }, "Please upload a PDF, JPG, or PNG file")
    .refine((file) => {
      if (!file) return false;
      const maxSize = 5 * 1024 * 1024; // 5MB
      return file.size <= maxSize;
    }, "File size must be less than 5MB"),
});

// Complete signup validation (both steps combined)
export const signupSchema = z
  .object({
    businessName: z.string().min(1, "Business name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    password: strongPasswordValidation,
    confirmPassword: z.string(),
    licenseFile: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormData = {
  businessName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  licenseFile: File | null;
};
