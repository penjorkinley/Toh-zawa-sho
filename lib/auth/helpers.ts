// lib/auth/helpers.ts
import { supabaseAdmin } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export type UserRole = "super-admin" | "restaurant-owner";
export type UserStatus = "pending" | "approved" | "rejected";

export interface SignupData {
  businessName: string;
  email: string;
  phoneNumber: string;
  password: string;
  businessLicenseUrl?: string;
}

export interface UserProfile {
  id: string;
  business_name: string;
  phone_number: string;
  business_license_url?: string;
  role: UserRole;
  status: UserStatus;
  first_login: boolean;
  created_at: string;
  updated_at: string;
}

// Create a basic supabase client for server-side operations that don't require admin privileges
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Sign up a new restaurant owner
export async function signupRestaurantOwner(data: SignupData) {
  try {
    // Create auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true, // Auto-confirm email for now
      });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Failed to create user");

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .insert({
        id: authData.user.id,
        business_name: data.businessName,
        phone_number: data.phoneNumber,
        business_license_url: data.businessLicenseUrl,
        role: "restaurant-owner",
        status: "pending",
      });

    if (profileError) throw profileError;

    // Create signup request for admin review
    const { error: requestError } = await supabaseAdmin
      .from("signup_requests")
      .insert({
        user_id: authData.user.id,
        business_name: data.businessName,
        email: data.email,
        phone_number: data.phoneNumber,
        business_license_url: data.businessLicenseUrl,
        status: "pending",
      });

    if (requestError) throw requestError;

    return { success: true, user: authData.user };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Login user - Note: This is typically handled by the login API route
export async function loginUser(emailOrPhone: string, password: string) {
  try {
    // Try to login with email first
    let { data, error } = await supabase.auth.signInWithPassword({
      email: emailOrPhone,
      password: password,
    });

    // If email login fails and input looks like phone, try to find user by phone
    if (error && !emailOrPhone.includes("@")) {
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("phone_number", emailOrPhone)
        .single();

      if (profiles) {
        // Get user email from auth.users
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
          profiles.id
        );
        if (userData.user) {
          const { data: loginData, error: loginError } =
            await supabase.auth.signInWithPassword({
              email: userData.user.email!,
              password: password,
            });
          data = loginData;
          error = loginError;
        }
      }
    }

    if (error) throw error;
    if (!data.user) throw new Error("Login failed");

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) throw profileError;

    // Check if user is approved
    if (profile.status !== "approved") {
      await supabase.auth.signOut();
      throw new Error("Your account is still pending approval");
    }

    return {
      success: true,
      user: data.user,
      profile,
      isFirstLogin: profile.first_login,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Mark first login as complete - Used by server-side API routes
export async function completeFirstLogin(userId: string) {
  try {
    const { error } = await supabaseAdmin
      .from("user_profiles")
      .update({ first_login: false })
      .eq("id", userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Complete first login error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Get pending signup requests (for super admin)
export async function getPendingSignupRequests() {
  try {
    const { data, error } = await supabaseAdmin
      .from("signup_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Get pending requests error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Approve/reject signup request
export async function updateSignupRequestStatus(
  requestId: string,
  status: "approved" | "rejected",
  adminId: string
) {
  try {
    // Update signup request using service role
    const { data: request, error: requestError } = await supabaseAdmin
      .from("signup_requests")
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminId,
      })
      .eq("id", requestId)
      .select("user_id")
      .single();

    if (requestError) throw requestError;

    // Update user profile status using service role
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .update({ status })
      .eq("id", request.user_id);

    if (profileError) throw profileError;

    return { success: true };
  } catch (error) {
    console.error("Update signup status error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Get current user profile - Note: This should typically be used client-side
// For server-side usage, consider using the server client
export async function getCurrentUserProfile() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return { success: true, data: profile };
  } catch (error) {
    console.error("Get user profile error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
