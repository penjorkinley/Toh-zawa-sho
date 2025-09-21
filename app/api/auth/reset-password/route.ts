// app/api/auth/reset-password/route.ts
import PasswordResetService from "@/lib/services/password-reset";
import { resetPasswordSchema } from "@/lib/validations/auth/reset-password";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resetToken, newPassword, confirmPassword } = body;

    // Basic input validation
    if (!resetToken || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Reset token and passwords are required.",
        },
        { status: 400 }
      );
    }

    // Validate password format and confirmation
    const validationResult = resetPasswordSchema.safeParse({
      newPassword,
      confirmPassword,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Reset password using the service
    const resetResult = await PasswordResetService.resetPassword(
      resetToken,
      newPassword
    );

    if (!resetResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: resetResult.error,
        },
        { status: 400 }
      );
    }

    console.log(
      `✅ Password reset successfully for token: ${resetToken.substring(
        0,
        8
      )}...`
    );

    return NextResponse.json({
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
