// app/api/auth/login/route.ts
import { loginUser } from "@/lib/auth/helpers";
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

    // Attempt login
    const loginResult = await loginUser(emailOrPhone, password);

    if (!loginResult.success) {
      return NextResponse.json(
        { success: false, error: loginResult.error },
        { status: 401 }
      );
    }

    // Determine redirect based on role and first login
    let redirectUrl = "/";

    if (loginResult.isFirstLogin) {
      redirectUrl = "/information-setup";
    } else if (loginResult.profile?.role === "super-admin") {
      redirectUrl = "/super-admin/dashboard";
    } else if (loginResult.profile?.role === "restaurant-owner") {
      redirectUrl = "/restaurant/dashboard";
    }

    // Additional safety check (though loginUser should handle this)
    if (!loginResult.user) {
      return NextResponse.json(
        { success: false, error: "Authentication failed" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: loginResult.user.id,
        email: loginResult.user.email,
        role: loginResult.profile?.role,
        businessName: loginResult.profile?.business_name,
      },
      isFirstLogin: loginResult.isFirstLogin,
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
