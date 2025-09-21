// lib/services/password-reset.ts
import { supabaseAdmin } from "@/lib/supabase/server";
import crypto from "crypto";

export interface PasswordResetToken {
  id: string;
  user_id: string;
  email: string;
  token: string;
  otp_code: string;
  expires_at: string;
  used: boolean;
  attempts: number;
  max_attempts: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTokenResult {
  success: boolean;
  token?: string;
  otpCode?: string;
  expiresAt?: Date;
  error?: string;
}

export interface ValidateOtpResult {
  success: boolean;
  token?: string;
  error?: string;
  attemptsRemaining?: number;
}

export interface ResetPasswordResult {
  success: boolean;
  error?: string;
}

export class PasswordResetService {
  private static readonly OTP_LENGTH = 6;
  private static readonly TOKEN_EXPIRY_MINUTES = 5; // Production: 5 minutes
  private static readonly MAX_ATTEMPTS = 3;

  /**
   * Generate a secure random OTP code
   */
  private static generateOtpCode(): string {
    // Generate a secure 6-digit OTP
    const digits = crypto.randomBytes(3);
    let otp = "";
    for (let i = 0; i < 3; i++) {
      otp += (digits[i] % 100).toString().padStart(2, "0");
    }
    return otp.slice(0, this.OTP_LENGTH);
  }

  /**
   * Generate a secure token for the reset process
   */
  private static generateSecureToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * Check if user exists and get their information
   */
  static async checkUserExists(
    email: string
  ): Promise<{ exists: boolean; userId?: string; error?: string }> {
    try {
      // Check in auth.users using admin client
      const { data: authUsers, error: authError } =
        await supabaseAdmin.auth.admin.listUsers();

      if (authError) {
        console.error("Auth error:", authError.message);
        return { exists: false, error: "Failed to verify user" };
      }

      const authUser = authUsers.users.find(
        (user) => user.email?.toLowerCase() === email.toLowerCase()
      );

      if (!authUser) {
        return { exists: false };
      }

      // Check if user has a profile
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("user_profiles")
        .select("id, status, role")
        .eq("id", authUser.id)
        .single();

      if (profileError) {
        console.error("Profile error:", profileError.message);
        return { exists: false, error: "User profile not found" };
      }

      // Only allow password reset for approved users
      if (profile.status !== "approved") {
        return {
          exists: false,
          error: "Account not approved for password reset",
        };
      }

      return { exists: true, userId: authUser.id };
    } catch (error) {
      console.error("Error checking user existence:", error);
      return { exists: false, error: "Failed to verify user" };
    }
  }

  /**
   * Create a new password reset token and OTP
   */
  static async createPasswordResetToken(
    email: string
  ): Promise<CreateTokenResult> {
    try {
      // Clean up expired tokens first
      await this.cleanupExpiredTokens();

      // Check if user exists
      const userCheck = await this.checkUserExists(email);
      if (!userCheck.exists) {
        return {
          success: false,
          error: userCheck.error || "No account found with this email address",
        };
      }

      const userId = userCheck.userId!;
      const token = this.generateSecureToken();
      const otpCode = this.generateOtpCode();
      const expiresAt = new Date(
        Date.now() + this.TOKEN_EXPIRY_MINUTES * 60 * 1000
      );

      // Clean up any existing tokens for this user
      await supabaseAdmin
        .from("password_reset_tokens")
        .delete()
        .eq("user_id", userId);

      // Create new token
      const { data, error } = await supabaseAdmin
        .from("password_reset_tokens")
        .insert({
          user_id: userId,
          email: email.toLowerCase(),
          token,
          otp_code: otpCode,
          expires_at: expiresAt.toISOString(),
          max_attempts: this.MAX_ATTEMPTS,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating reset token:", error);
        return { success: false, error: "Failed to create reset token" };
      }

      return {
        success: true,
        token,
        otpCode,
        expiresAt,
      };
    } catch (error) {
      console.error("Error in createPasswordResetToken:", error);
      return { success: false, error: "Internal server error" };
    }
  }

  /**
   * Validate OTP code and return secure token if valid
   */
  static async validateOtp(
    email: string,
    otpCode: string
  ): Promise<ValidateOtpResult> {
    try {
      // Clean up expired tokens first
      await this.cleanupExpiredTokens();

      // Find the most recent valid token for this email
      const { data: tokenData, error: fetchError } = await supabaseAdmin
        .from("password_reset_tokens")
        .select("*")
        .eq("email", email.toLowerCase())
        .eq("used", false)
        .gte("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !tokenData) {
        return {
          success: false,
          error:
            "Invalid or expired reset request. Please request a new password reset.",
        };
      }

      // Check if max attempts exceeded
      if (tokenData.attempts >= tokenData.max_attempts) {
        return {
          success: false,
          error:
            "Maximum attempts exceeded. Please request a new password reset.",
        };
      }

      // Check if OTP matches
      if (tokenData.otp_code !== otpCode) {
        // Increment attempts
        await supabaseAdmin
          .from("password_reset_tokens")
          .update({ attempts: tokenData.attempts + 1 })
          .eq("id", tokenData.id);

        const attemptsRemaining =
          tokenData.max_attempts - (tokenData.attempts + 1);

        return {
          success: false,
          error: `Invalid OTP code. ${attemptsRemaining} attempts remaining.`,
          attemptsRemaining,
        };
      }

      // OTP is valid - mark it as used for OTP verification
      // But keep it active for password reset
      await supabaseAdmin
        .from("password_reset_tokens")
        .update({
          attempts: tokenData.attempts + 1, // Track the successful attempt
        })
        .eq("id", tokenData.id);

      return {
        success: true,
        token: tokenData.token,
      };
    } catch (error) {
      console.error("Error in validateOtp:", error);
      return { success: false, error: "Internal server error" };
    }
  }

  /**
   * Reset password using valid token
   */
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ResetPasswordResult> {
    try {
      // Find and validate the token
      const { data: tokenData, error: fetchError } = await supabaseAdmin
        .from("password_reset_tokens")
        .select("*")
        .eq("token", token)
        .eq("used", false)
        .gte("expires_at", new Date().toISOString())
        .single();

      if (fetchError || !tokenData) {
        return {
          success: false,
          error:
            "Invalid or expired reset token. Please start the password reset process again.",
        };
      }

      // Update the user's password using Supabase Admin
      const { error: updateError } =
        await supabaseAdmin.auth.admin.updateUserById(tokenData.user_id, {
          password: newPassword,
        });

      if (updateError) {
        console.error("Error updating password:", updateError);
        return {
          success: false,
          error: "Failed to update password. Please try again.",
        };
      }

      // Mark token as used
      await supabaseAdmin
        .from("password_reset_tokens")
        .update({ used: true })
        .eq("id", tokenData.id);

      // Clean up all tokens for this user
      await supabaseAdmin
        .from("password_reset_tokens")
        .delete()
        .eq("user_id", tokenData.user_id);

      return { success: true };
    } catch (error) {
      console.error("Error in resetPassword:", error);
      return { success: false, error: "Internal server error" };
    }
  }

  /**
   * Clean up expired tokens (utility function)
   */
  static async cleanupExpiredTokens(): Promise<void> {
    try {
      await supabaseAdmin
        .from("password_reset_tokens")
        .delete()
        .or("expires_at.lt.now(),used.eq.true");
    } catch (error) {
      console.error("Error cleaning up expired tokens:", error);
    }
  }

  /**
   * Get token information for debugging (be careful with this in production)
   */
  static async getTokenInfo(
    token: string
  ): Promise<{ valid: boolean; expiresAt?: Date; used?: boolean }> {
    try {
      const { data: tokenData } = await supabaseAdmin
        .from("password_reset_tokens")
        .select("expires_at, used")
        .eq("token", token)
        .single();

      if (!tokenData) {
        return { valid: false };
      }

      const expiresAt = new Date(tokenData.expires_at);
      const isExpired = expiresAt < new Date();

      return {
        valid: !isExpired && !tokenData.used,
        expiresAt,
        used: tokenData.used,
      };
    } catch (error) {
      return { valid: false };
    }
  }
}

export default PasswordResetService;
