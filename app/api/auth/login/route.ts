// app/api/auth/login/route.ts
import { loginSchema } from "@/lib/validations/auth/login";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
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

    // Create a Supabase client with cookie handling
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

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

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { success: false, error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    // Check if user is approved
    if (profile.status !== "approved") {
      await supabase.auth.signOut();
      return NextResponse.json(
        { success: false, error: "Your account is still pending approval" },
        { status: 403 }
      );
    }

    // Determine redirect based on role and first login
    let redirectUrl = "/";
    if (profile.first_login) {
      redirectUrl = "/information-setup";
    } else if (profile.role === "super-admin") {
      redirectUrl = "/super-admin-dashboard/dashboard";
    } else if (profile.role === "restaurant-owner") {
      redirectUrl = "/owner-dashboard/menu-setup";
    }

    // Return success with user data
    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: profile.role,
        businessName: profile.business_name,
      },
      profile,
      isFirstLogin: profile.first_login,
      redirectUrl,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
