// app/api/auth/forgot-password/route.ts
import { sendPasswordResetOtpEmail } from "@/lib/email/service";
import PasswordResetService from "@/lib/services/password-reset";
import { forgotPasswordSchema } from "@/lib/validations/auth/forgot-password";
import { NextRequest, NextResponse } from "next/server";

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 requests per 15 minutes per IP

function checkRateLimit(ip: string): {
  allowed: boolean;
  resetTime?: number;
  attemptsLeft?: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, attemptsLeft: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      resetTime: record.resetTime,
      attemptsLeft: 0,
    };
  }

  // Increment count
  record.count++;
  rateLimitMap.set(ip, record);

  return {
    allowed: true,
    attemptsLeft: MAX_REQUESTS_PER_WINDOW - record.count,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      const waitTimeMinutes = Math.ceil(
        (rateCheck.resetTime! - Date.now()) / (60 * 1000)
      );
      return NextResponse.json(
        {
          success: false,
          error: `Too many password reset requests. Please try again in ${waitTimeMinutes} minutes.`,
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    // Validate input
    const validationResult = forgotPasswordSchema.safeParse({ email });
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Create password reset token and OTP
    const resetResult = await PasswordResetService.createPasswordResetToken(
      email
    );

    if (!resetResult.success) {
      // Don't reveal whether email exists or not for security
      // Always return success but log the actual error
      console.log(`Password reset failed for ${email}: ${resetResult.error}`);

      return NextResponse.json({
        success: true,
        message:
          "If an account with this email exists, you will receive a password reset code shortly.",
        attemptsLeft: rateCheck.attemptsLeft,
      });
    }

    // Send OTP email
    const emailResult = await sendPasswordResetOtpEmail(
      email,
      resetResult.otpCode!,
      5 // 5 minutes expiry
    );

    if (!emailResult.success) {
      console.error(`Failed to send OTP email to ${email}:`, emailResult.error);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to send verification code. Please try again.",
        },
        { status: 500 }
      );
    }

    console.log(`✅ Password reset OTP sent successfully to ${email}`);

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email address.",
      attemptsLeft: rateCheck.attemptsLeft,
      expiresInMinutes: 5,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
