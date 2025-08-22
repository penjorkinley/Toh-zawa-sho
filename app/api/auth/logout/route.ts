// app/api/auth/logout/route.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create server client
    const supabase = await createSupabaseServerClient();

    // Server-side logout - this is much more reliable
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Server logout error:", error);
      // Even if server logout fails, we still want to clear client session
    }

    // Create response that will clear cookies
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear auth cookies manually as backup
    response.cookies.delete("sb-auth-token");
    response.cookies.delete("sb-refresh-token");

    // Clear all possible Supabase cookie variations
    const cookieNames = [
      "sb-auth-token",
      "sb-refresh-token",
      "supabase-auth-token",
      "supabase.auth.token",
    ];

    cookieNames.forEach((name) => {
      response.cookies.set(name, "", {
        expires: new Date(0),
        path: "/",
        domain: undefined,
      });
    });

    return response;
  } catch (error) {
    console.error("Logout API error:", error);

    // Always return success to ensure client can clear state
    // even if server logout fails
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    return response;
  }
}
