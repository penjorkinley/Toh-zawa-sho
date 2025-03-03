"use server";

import { loginSchema } from "../../validations/auth/login";

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
