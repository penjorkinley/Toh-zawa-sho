// app/api/auth/verify-reset-otp/route.ts
import PasswordResetService from "@/lib/services/password-reset";
import { verifyOtpSchema } from "@/lib/validations/auth/verify-otp";
import { NextRequest, NextResponse } from "next/server";

// Rate limiting for OTP verification
const otpRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const OTP_RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const MAX_OTP_ATTEMPTS_PER_WINDOW = 3; // Max 3 attempts per 5 minutes per email

function checkOtpRateLimit(email: string): {
  allowed: boolean;
  resetTime?: number;
  attemptsLeft?: number;
} {
  const now = Date.now();
  const record = otpRateLimitMap.get(email);

  if (!record || now > record.resetTime) {
    otpRateLimitMap.set(email, {
      count: 1,
      resetTime: now + OTP_RATE_LIMIT_WINDOW,
    });
    return { allowed: true, attemptsLeft: MAX_OTP_ATTEMPTS_PER_WINDOW - 1 };
  }

  if (record.count >= MAX_OTP_ATTEMPTS_PER_WINDOW) {
    return {
      allowed: false,
      resetTime: record.resetTime,
      attemptsLeft: 0,
    };
  }

  record.count++;
  otpRateLimitMap.set(email, record);

  return {
    allowed: true,
    attemptsLeft: MAX_OTP_ATTEMPTS_PER_WINDOW - record.count,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Basic input validation
    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and OTP code are required.",
        },
        { status: 400 }
      );
    }

    // Rate limiting for OTP attempts
    const rateCheck = checkOtpRateLimit(email);
    if (!rateCheck.allowed) {
      const waitTimeMinutes = Math.ceil(
        (rateCheck.resetTime! - Date.now()) / (60 * 1000)
      );
      return NextResponse.json(
        {
          success: false,
          error: `Too many verification attempts. Please try again in ${waitTimeMinutes} minutes.`,
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    // Validate OTP format
    const validationResult = verifyOtpSchema.safeParse({ otp });
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Validate OTP with the service
    const verificationResult = await PasswordResetService.validateOtp(
      email,
      otp
    );

    if (!verificationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: verificationResult.error,
          attemptsRemaining: verificationResult.attemptsRemaining,
          rateLimitAttemptsLeft: rateCheck.attemptsLeft,
        },
        { status: 400 }
      );
    }

    console.log(`✅ OTP verified successfully for ${email}`);

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully.",
      resetToken: verificationResult.token,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
