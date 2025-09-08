// lib/actions/profile/actions.ts
"use server";

import { uploadBusinessImage } from "@/lib/actions/business/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface ProfileData {
  email: string;
  phone_number: string;
  business_type: string;
  location: string;
  description: string;
  logo_url: string | null;
  cover_photo_url: string | null;
  business_hours: Array<{
    day_of_week: string;
    opening_time: string;
    closing_time: string;
    is_closed: boolean;
  }>;
}

export interface UpdateProfileData {
  email?: string;
  phoneNumber?: string;
  businessType?: string;
  location?: string;
  description?: string;
  openingDays?: string[];
  openingTime?: string;
  closingTime?: string;
  logo?: File | null;
  coverPhoto?: File | null;
}

// Helper function to get business_id for the current user
async function getCurrentUserBusinessId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: businessInfo } = await supabase
    .from("business_information")
    .select("id")
    .eq("user_id", user.id)
    .single();

  return businessInfo?.id || null;
}

// Get current user's profile data
export async function getProfileData(): Promise<{
  success: boolean;
  data?: ProfileData;
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get user profile data (email from auth.users, phone from user_profiles)
    const { data: userProfile, error: userError } = await supabase
      .from("user_profiles")
      .select("phone_number")
      .eq("id", user.id)
      .single();

    if (userError) {
      return { success: false, error: "Failed to fetch user profile" };
    }

    // Get business information
    const { data: businessInfo, error: businessError } = await supabase
      .from("business_information")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (businessError) {
      return { success: false, error: "Failed to fetch business information" };
    }

    // Get business hours
    const { data: businessHours, error: hoursError } = await supabase
      .from("business_hours")
      .select("*")
      .eq("business_id", businessInfo.id)
      .order("day_of_week");

    if (hoursError) {
      return { success: false, error: "Failed to fetch business hours" };
    }

    const profileData: ProfileData = {
      email: user.email || "",
      phone_number: userProfile.phone_number || "",
      business_type: businessInfo.business_type || "",
      location: businessInfo.location || "",
      description: businessInfo.description || "",
      logo_url: businessInfo.logo_url,
      cover_photo_url: businessInfo.cover_photo_url,
      business_hours: businessHours || [],
    };

    return { success: true, data: profileData };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch profile data",
    };
  }
}

// Update profile data
export async function updateProfileData(data: UpdateProfileData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const businessId = await getCurrentUserBusinessId();
    if (!businessId) {
      return { success: false, error: "Business not found" };
    }

    // Upload images if provided
    let logoUrl: string | undefined;
    let coverPhotoUrl: string | undefined;

    if (data.logo && data.logo.size > 0) {
      const logoUploadResult = await uploadBusinessImage(
        user.id,
        data.logo,
        "logos"
      );
      if (logoUploadResult.success) {
        logoUrl = logoUploadResult.url;
      }
    }

    if (data.coverPhoto && data.coverPhoto.size > 0) {
      const coverUploadResult = await uploadBusinessImage(
        user.id,
        data.coverPhoto,
        "covers"
      );
      if (coverUploadResult.success) {
        coverPhotoUrl = coverUploadResult.url;
      }
    }

    // Update user email in auth.users if changed
    if (data.email && data.email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: data.email,
      });
      if (emailError) {
        return { success: false, error: "Failed to update email" };
      }
    }

    // Update phone number in user_profiles if changed
    if (data.phoneNumber) {
      const { error: phoneError } = await supabase
        .from("user_profiles")
        .update({ phone_number: data.phoneNumber })
        .eq("id", user.id);

      if (phoneError) {
        return { success: false, error: "Failed to update phone number" };
      }
    }

    // Update business information
    const businessUpdateData: any = {};
    if (data.businessType) businessUpdateData.business_type = data.businessType;
    if (data.location) businessUpdateData.location = data.location;
    if (data.description !== undefined)
      businessUpdateData.description = data.description;
    if (logoUrl) businessUpdateData.logo_url = logoUrl;
    if (coverPhotoUrl) businessUpdateData.cover_photo_url = coverPhotoUrl;

    if (Object.keys(businessUpdateData).length > 0) {
      const { error: businessError } = await supabase
        .from("business_information")
        .update(businessUpdateData)
        .eq("id", businessId);

      if (businessError) {
        return {
          success: false,
          error: "Failed to update business information",
        };
      }
    }

    // Update business hours if provided
    if (data.openingDays && data.openingTime && data.closingTime) {
      // First, delete existing business hours
      const { error: deleteError } = await supabase
        .from("business_hours")
        .delete()
        .eq("business_id", businessId);

      if (deleteError) {
        return { success: false, error: "Failed to update business hours" };
      }

      // Convert day abbreviations to full names
      const dayMapping: { [key: string]: string } = {
        Mon: "monday",
        Tue: "tuesday",
        Wed: "wednesday",
        Thu: "thursday",
        Fri: "friday",
        Sat: "saturday",
        Sun: "sunday",
      };

      // Insert new business hours
      const hoursData = data.openingDays.map((day) => ({
        business_id: businessId,
        day_of_week: dayMapping[day] || day.toLowerCase(),
        opening_time: data.openingTime!,
        closing_time: data.closingTime!,
        is_closed: false,
      }));

      const { error: insertError } = await supabase
        .from("business_hours")
        .insert(hoursData);

      if (insertError) {
        return { success: false, error: "Failed to update business hours" };
      }
    }

    revalidatePath("/owner-dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

// Change password
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify current password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (verifyError) {
      return { success: false, error: "Current password is incorrect" };
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return { success: false, error: "Failed to update password" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to change password",
    };
  }
}
