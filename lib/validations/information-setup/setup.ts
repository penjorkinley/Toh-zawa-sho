import * as z from "zod";

// First step validation schema
export const firstStepSetupSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(8, "Phone number must be at least 8 digits"),
  businessType: z.string().min(1, "Please select a business type"),
  logo: z.instanceof(File).optional().nullable(),
  coverPhoto: z.instanceof(File).optional().nullable(),
});

// Second step validation schema
export const secondStepSetupSchema = z.object({
  location: z.string().min(3, "Location must be at least 3 characters long"),
  openingDays: z
    .array(z.string())
    .min(1, "Please select at least one opening day"),
  openingTime: z.string(),
  closingTime: z.string(),
  description: z.string().optional(),
});

// Combined validation schema
export const businessSetupSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(8, "Phone number must be at least 8 digits"),
  businessType: z.string().min(1, "Please select a business type"),
  logo: z.instanceof(File).optional().nullable(),
  coverPhoto: z.instanceof(File).optional().nullable(),
  location: z.string().min(3, "Location must be at least 3 characters long"),
  openingDays: z
    .array(z.string())
    .min(1, "Please select at least one opening day"),
  openingTime: z.string(),
  closingTime: z.string(),
  description: z.string().optional(),
});

export type BusinessSetupData = z.infer<typeof businessSetupSchema>;
