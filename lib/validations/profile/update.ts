// lib/validations/profile/update.ts
import { z } from "zod";

export const updateProfileSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is required")
    .optional(),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional(),
  businessType: z
    .enum(["restaurant", "cafe", "bakery", "food_truck", "bar", "other"], {
      errorMap: () => ({ message: "Please select a valid business type" }),
    })
    .optional(),
  location: z
    .string()
    .min(1, "Location is required")
    .max(255, "Location must be less than 255 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  openingDays: z
    .array(z.string())
    .min(1, "Please select at least one opening day")
    .max(7, "Cannot select more than 7 days")
    .optional(),
  openingTime: z
    .string()
    .regex(
      /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
      "Invalid opening time format"
    )
    .optional(),
  closingTime: z
    .string()
    .regex(
      /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
      "Invalid closing time format"
    )
    .optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
