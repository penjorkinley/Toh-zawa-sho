import * as z from "zod";

// Combined validation schema for single step
export const businessSetupSchema = z.object({
  businessType: z.string().min(1, "Please select a business type"),
  logo: z.instanceof(File).optional().nullable(),
  coverPhoto: z.instanceof(File).optional().nullable(),
  location: z.string().min(3, "Location must be at least 3 characters long"),
  openingDays: z
    .array(z.string())
    .min(1, "Please select at least one opening day"),
  openingTime: z.string({
    required_error: "Please select an opening time",
  }),
  closingTime: z.string({
    required_error: "Please select a closing time",
  }),
  description: z.string().optional(),
});

export type BusinessSetupData = z.infer<typeof businessSetupSchema>;
