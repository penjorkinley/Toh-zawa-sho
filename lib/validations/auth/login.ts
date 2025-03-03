import * as z from "zod";

export const loginSchema = z.object({
  emailOrPhone: z.string().nonempty("This field cannot be empty"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
