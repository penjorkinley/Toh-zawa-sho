import * as z from "zod";

export const verifyOtpSchema = z.object({
  otp: z.string().regex(/^\d{4}$/, "OTP must be exactly 4 digits"),
});
