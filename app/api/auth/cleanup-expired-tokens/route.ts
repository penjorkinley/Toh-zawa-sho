// app/api/auth/cleanup-expired-tokens/route.ts
import PasswordResetService from "@/lib/services/password-reset";
import { NextRequest, NextResponse } from "next/server";

// This endpoint can be called to clean up expired tokens
// In production, you might want to add authentication or run this as a scheduled job
export async function POST(request: NextRequest) {
  try {
    // For now, we'll allow this endpoint to run without authentication
    // In production, you could add IP whitelisting or move this to a cron job
    await PasswordResetService.cleanupExpiredTokens();

    return NextResponse.json({
      success: true,
      message: "Expired tokens cleaned up successfully",
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "OK",
    message: "Password reset service is running",
    timestamp: new Date().toISOString(),
  });
}
