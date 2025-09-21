// app/api/auth/login/route.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/auth/login";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailOrPhone, password } = body;

    // Validate input
    const validationResult = loginSchema.safeParse({ emailOrPhone, password });
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Create server client with proper Next.js 15 compatibility
    const supabase = await createSupabaseServerClient();

    // Try to login with email first
    let email = emailOrPhone;

    // If input doesn't look like email, try to find user by phone
    if (!emailOrPhone.includes("@")) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("phone_number", emailOrPhone)
        .single();

      if (profile) {
        // Get user email from Supabase Admin (you'll need to create a separate admin client)
        // For now, we'll need the user to login with email
        return NextResponse.json(
          { success: false, error: "Please login with your email address" },
          { status: 401 }
        );
      }
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: authError?.message || "Invalid credentials" },
        { status: 401 }
      );
    }

    // Use the authenticated user from signInWithPassword (already verified)
    const userId = authData.user.id;

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { success: false, error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    // Check if user is approved with specific status messages
    if (profile.status !== "approved") {
      await supabase.auth.signOut();

      let errorMessage: string;
      let statusCode = 403;

      switch (profile.status) {
        case "pending":
          errorMessage =
            "Your account is pending approval. Please wait for admin approval.";
          break;
        case "rejected":
          // Check if this is a suspended restaurant or actually rejected signup
          // Suspended restaurants have rejected status but are existing approved users
          if (profile.role === "restaurant-owner") {
            errorMessage =
              "Your restaurant account has been suspended. Please contact support for assistance.";
          } else {
            errorMessage =
              "Your account application has been rejected. Please contact support for more information.";
          }
          break;
        default:
          errorMessage =
            "Your account status is invalid. Please contact support.";
          break;
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          status: profile.status, // Include status for frontend to handle differently
        },
        { status: statusCode }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: profile.role,
        status: profile.status,
        first_login: profile.first_login,
        business_name: profile.business_name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
