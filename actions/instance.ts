import { cookies } from "next/headers";

export async function instance(multipart?: boolean) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  return {
    Authorization: `Bearer ${token?.value}`,
    ...(multipart ? {} : { "Content-Type": "application/json" }),
  };
}
