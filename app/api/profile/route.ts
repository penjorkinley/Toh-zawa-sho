// app/api/profile/route.ts
import { uploadBusinessImage } from "@/lib/actions/business/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  changePasswordSchema,
  updateProfileSchema,
} from "@/lib/validations/profile/update";
import { NextRequest, NextResponse } from "next/server";

// Helper function to get business_id for the current user
async function getCurrentUserBusinessId(
  supabase: any,
  userId: string
): Promise<string | null> {
  const { data: businessInfo } = await supabase
    .from("business_information")
    .select("id")
    .eq("user_id", userId)
    .single();

  return businessInfo?.id || null;
}

// GET - Fetch current profile data
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get user profile data
    const { data: userProfile, error: userError } = await supabase
      .from("user_profiles")
      .select("phone_number")
      .eq("id", user.id)
      .single();

    if (userError) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    // Get business information
    const { data: businessInfo, error: businessError } = await supabase
      .from("business_information")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (businessError) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch business information" },
        { status: 500 }
      );
    }

    // Get business hours
    const { data: businessHours, error: hoursError } = await supabase
      .from("business_hours")
      .select("*")
      .eq("business_id", businessInfo.id)
      .order("day_of_week");

    if (hoursError) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch business hours" },
        { status: 500 }
      );
    }

    const profileData = {
      email: user.email || "",
      phone_number: userProfile.phone_number || "",
      business_type: businessInfo.business_type || "",
      location: businessInfo.location || "",
      description: businessInfo.description || "",
      logo_url: businessInfo.logo_url,
      cover_photo_url: businessInfo.cover_photo_url,
      business_hours: businessHours || [],
    };

    return NextResponse.json({ success: true, data: profileData });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}

// PUT - Update profile data
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // Extract form data
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const businessType = formData.get("businessType") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const openingDays = formData.getAll("openingDays") as string[];
    const openingTime = formData.get("openingTime") as string;
    const closingTime = formData.get("closingTime") as string;
    const logo = formData.get("logo") as File;
    const coverPhoto = formData.get("coverPhoto") as File;

    // Create validation data
    const validationData = {
      email: email || undefined,
      phoneNumber: phoneNumber || undefined,
      businessType: businessType || undefined,
      location: location || undefined,
      description: description || undefined,
      openingDays: openingDays.length > 0 ? openingDays : undefined,
      openingTime: openingTime || undefined,
      closingTime: closingTime || undefined,
    };

    // Validate the data
    const validationResult = updateProfileSchema.safeParse(validationData);

    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      return NextResponse.json(
        { success: false, errors: fieldErrors },
        { status: 400 }
      );
    }

    const businessId = await getCurrentUserBusinessId(supabase, user.id);
    if (!businessId) {
      return NextResponse.json(
        { success: false, error: "Business not found" },
        { status: 404 }
      );
    }

    // Upload images if provided
    let logoUrl: string | undefined;
    let coverPhotoUrl: string | undefined;

    if (logo && logo.size > 0) {
      const logoUploadResult = await uploadBusinessImage(
        user.id,
        logo,
        "logos"
      );
      if (logoUploadResult.success) {
        logoUrl = logoUploadResult.url;
      } else {
        return NextResponse.json(
          { success: false, error: "Failed to upload logo" },
          { status: 500 }
        );
      }
    }

    if (coverPhoto && coverPhoto.size > 0) {
      const coverUploadResult = await uploadBusinessImage(
        user.id,
        coverPhoto,
        "covers"
      );
      if (coverUploadResult.success) {
        coverPhotoUrl = coverUploadResult.url;
      } else {
        return NextResponse.json(
          { success: false, error: "Failed to upload cover photo" },
          { status: 500 }
        );
      }
    }

    // Update user email in auth.users if changed
    if (email && email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: email,
      });
      if (emailError) {
        return NextResponse.json(
          { success: false, error: "Failed to update email" },
          { status: 500 }
        );
      }
    }

    // Update phone number in user_profiles if changed
    if (phoneNumber) {
      const { error: phoneError } = await supabase
        .from("user_profiles")
        .update({ phone_number: phoneNumber })
        .eq("id", user.id);

      if (phoneError) {
        return NextResponse.json(
          { success: false, error: "Failed to update phone number" },
          { status: 500 }
        );
      }
    }

    // Update business information
    const businessUpdateData: any = {};
    if (businessType) businessUpdateData.business_type = businessType;
    if (location) businessUpdateData.location = location;
    if (description !== undefined) businessUpdateData.description = description;
    if (logoUrl) businessUpdateData.logo_url = logoUrl;
    if (coverPhotoUrl) businessUpdateData.cover_photo_url = coverPhotoUrl;

    if (Object.keys(businessUpdateData).length > 0) {
      const { error: businessError } = await supabase
        .from("business_information")
        .update(businessUpdateData)
        .eq("id", businessId);

      if (businessError) {
        return NextResponse.json(
          { success: false, error: "Failed to update business information" },
          { status: 500 }
        );
      }
    }

    // Update business hours if provided
    if (openingDays && openingDays.length > 0 && openingTime && closingTime) {
      // First, delete existing business hours
      const { error: deleteError } = await supabase
        .from("business_hours")
        .delete()
        .eq("business_id", businessId);

      if (deleteError) {
        return NextResponse.json(
          { success: false, error: "Failed to update business hours" },
          { status: 500 }
        );
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
      const hoursData = openingDays.map((day) => ({
        business_id: businessId,
        day_of_week: dayMapping[day] || day.toLowerCase(),
        opening_time: openingTime,
        closing_time: closingTime,
        is_closed: false,
      }));

      const { error: insertError } = await supabase
        .from("business_hours")
        .insert(hoursData);

      if (insertError) {
        return NextResponse.json(
          { success: false, error: "Failed to update business hours" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// POST - Change password
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // Validate the data
    const validationResult = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      return NextResponse.json(
        { success: false, errors: fieldErrors },
        { status: 400 }
      );
    }

    // Verify current password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (verifyError) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return NextResponse.json(
        { success: false, error: "Failed to update password" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to change password" },
      { status: 500 }
    );
  }
}
