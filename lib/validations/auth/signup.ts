import * as z from "zod";

const baseSignupSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(8, "Phone number must be at least 8 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
  licenseFile: z.instanceof(File).optional().nullable(),
});

export const firstStepSchema = baseSignupSchema
  .pick({
    businessName: true,
    email: true,
    phoneNumber: true,
    password: true,
    confirmPassword: true,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const secondStepSchema = baseSignupSchema.pick({
  licenseFile: true,
});

export const signupSchema = baseSignupSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

export type SignupFormData = z.infer<typeof baseSignupSchema>;
