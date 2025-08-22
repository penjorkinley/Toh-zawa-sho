"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BusinessSetupData } from "@/lib/validations/information-setup/setup";
import { redirect } from "next/navigation";

interface SaveBusinessInfoResult {
  success: boolean;
  error?: string;
  businessInfoId?: string;
}

export async function saveBusinessInfoAction(
  userId: string,
  data: BusinessSetupData,
  logoUrl?: string,
  coverPhotoUrl?: string
): Promise<SaveBusinessInfoResult> {
  try {
    // UPDATED: Use new server client
    const supabase = await createSupabaseServerClient();

    // First update user_profiles to mark first_login as false
    const { error: profileUpdateError } = await supabase
      .from("user_profiles")
      .update({ first_login: false })
      .eq("id", userId);

    if (profileUpdateError) throw profileUpdateError;

    // Insert business information
    const { data: businessInfo, error: businessInfoError } = await supabase
      .from("business_information")
      .insert({
        user_id: userId,
        business_type: data.businessType,
        location: data.location,
        logo_url: logoUrl,
        cover_photo_url: coverPhotoUrl,
        description: data.description || null,
      })
      .select("id")
      .single();

    if (businessInfoError) throw businessInfoError;

    // Insert business hours for each selected day
    const businessHoursData = data.openingDays.map((day) => ({
      business_id: businessInfo.id,
      day_of_week: day.toLowerCase(),
      opening_time: data.openingTime,
      closing_time: data.closingTime,
      is_closed: false,
    }));

    const { error: businessHoursError } = await supabase
      .from("business_hours")
      .insert(businessHoursData);

    if (businessHoursError) throw businessHoursError;

    return {
      success: true,
      businessInfoId: businessInfo.id,
    };
  } catch (error) {
    console.error("Error saving business information:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to save business information",
    };
  }
}

// Function to upload image to GitHub repository
export async function uploadBusinessImage(
  userId: string,
  file: File,
  folder: "logos" | "covers"
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Convert file to base64 for processing
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    // Create a unique filename
    const fileExt = file.name.split(".").pop();
    const uniqueFileName = `${userId}-${Date.now()}.${fileExt}`;

    // Make API call to upload the image
    const response = await fetch("/api/upload-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: uniqueFileName,
        folder,
        base64Content: base64,
        contentType: file.type,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload image");
    }

    const result = await response.json();
    return {
      success: true,
      url: result.url,
    };
  } catch (error) {
    console.error(`Error uploading ${folder} image:`, error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : `Failed to upload ${folder} image`,
    };
  }
}

// Helper action to complete setup and redirect
export async function completeBusinessSetupAction(
  formData: FormData
): Promise<void> {
  "use server";

  // UPDATED: Use new server client
  const supabase = await createSupabaseServerClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Get form data
  const businessType = formData.get("businessType") as string;
  const location = formData.get("location") as string;
  const openingDays = formData.getAll("openingDays") as string[];
  const openingTime = formData.get("openingTime") as string;
  const closingTime = formData.get("closingTime") as string;
  const description = formData.get("description") as string;
  const logo = formData.get("logo") as File;
  const coverPhoto = formData.get("coverPhoto") as File;

  // Upload images if provided
  let logoUrl: string | undefined;
  let coverPhotoUrl: string | undefined;

  if (logo && logo.size > 0) {
    const logoUploadResult = await uploadBusinessImage(user.id, logo, "logos");
    if (logoUploadResult.success) {
      logoUrl = logoUploadResult.url;
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
    }
  }

  // Save business information
  const businessData: BusinessSetupData = {
    businessType,
    location,
    openingDays,
    openingTime,
    closingTime,
    description,
    logo: null, // We've already processed the files
    coverPhoto: null, // We've already processed the files
  };

  const result = await saveBusinessInfoAction(
    user.id,
    businessData,
    logoUrl,
    coverPhotoUrl
  );

  if (!result.success) {
    throw new Error(result.error || "Failed to save business information");
  }

  // Redirect to menu setup page
  redirect("/owner-dashboard/menu-setup");
}
