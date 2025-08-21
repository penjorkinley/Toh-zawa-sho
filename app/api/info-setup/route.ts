// app/api/info-setup/route.ts
import { Octokit } from "@octokit/rest";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_REPO = process.env.GITHUB_REPO || "";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Parse repo owner and name from GITHUB_REPO (format: owner/repo)
const [REPO_OWNER, REPO_NAME] = GITHUB_REPO.split("/");

// Day mapping for constraint compliance
const dayMapping: Record<string, string> = {
  Mon: "monday",
  Tue: "tuesday",
  Wed: "wednesday",
  Thu: "thursday",
  Fri: "friday",
  Sat: "saturday",
  Sun: "sunday",
};

// Create supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const userId = formData.get("userId") as string;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get business information
    const businessType = formData.get("businessType") as string;
    const location = formData.get("location") as string;
    const openingDays = formData.getAll("openingDays") as string[];
    const openingTime = formData.get("openingTime") as string;
    const closingTime = formData.get("closingTime") as string;
    const description = formData.get("description") as string;
    const logo = formData.get("logo") as File;
    const coverPhoto = formData.get("coverPhoto") as File;

    // Validate required fields
    if (
      !businessType ||
      !location ||
      openingDays.length === 0 ||
      !openingTime ||
      !closingTime
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload images to GitHub if provided
    let logoUrl: string | undefined;
    let coverPhotoUrl: string | undefined;

    if (logo && logo.size > 0) {
      try {
        logoUrl = await uploadToGitHub(logo, "logos", userId);
      } catch (error) {
        console.error("Logo upload error:", error);
        return NextResponse.json(
          { success: false, error: "Failed to upload logo" },
          { status: 500 }
        );
      }
    }

    if (coverPhoto && coverPhoto.size > 0) {
      try {
        coverPhotoUrl = await uploadToGitHub(coverPhoto, "covers", userId);
      } catch (error) {
        console.error("Cover photo upload error:", error);
        return NextResponse.json(
          { success: false, error: "Failed to upload cover photo" },
          { status: 500 }
        );
      }
    }

    try {
      // 1. First update user_profiles to mark first_login as false
      const { error: profileUpdateError } = await supabase
        .from("user_profiles")
        .update({ first_login: false })
        .eq("id", userId);

      if (profileUpdateError) {
        console.error("Profile update error:", profileUpdateError);
        throw new Error("Failed to update user profile");
      }

      // 2. Insert business information
      const { data: businessInfo, error: businessInfoError } = await supabase
        .from("business_information")
        .insert({
          user_id: userId,
          business_type: businessType,
          location: location,
          logo_url: logoUrl,
          cover_photo_url: coverPhotoUrl,
          description: description || null,
        })
        .select("id")
        .single();

      if (businessInfoError) {
        console.error("Business info insert error:", businessInfoError);
        throw new Error("Failed to save business information");
      }

      // 3. Insert business hours for each selected day with proper day format
      const businessHoursData = openingDays.map((day) => ({
        business_id: businessInfo.id,
        day_of_week: dayMapping[day] || day.toLowerCase(), // Convert 'Mon' to 'monday' etc.
        opening_time: openingTime,
        closing_time: closingTime,
        is_closed: false,
      }));

      const { error: hoursError } = await supabase
        .from("business_hours")
        .insert(businessHoursData);

      if (hoursError) {
        console.error("Business hours insert error:", hoursError);
        throw new Error("Failed to save business hours");
      }

      return NextResponse.json({
        success: true,
        businessId: businessInfo.id,
        message: "Business information saved successfully",
      });
    } catch (error) {
      // Handle database errors
      console.error("Database operation error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Business setup error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to save business information",
      },
      { status: 500 }
    );
  }
}

// Helper function to upload files to GitHub
async function uploadToGitHub(
  file: File,
  folder: string,
  userId: string
): Promise<string> {
  try {
    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64Content = Buffer.from(buffer).toString("base64");

    // Create unique filename
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `public/images/${folder}/${fileName}`;

    // Set up GitHub client
    const octokit = new Octokit({
      auth: GITHUB_TOKEN,
    });

    // Upload file to GitHub
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `Upload ${folder} image: ${fileName}`,
      content: base64Content,
      branch: GITHUB_BRANCH,
    });

    // Return raw URL to file
    return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${GITHUB_BRANCH}/${filePath}`;
  } catch (error) {
    console.error(`Error uploading to GitHub (${folder}):`, error);
    throw new Error(
      `Failed to upload ${folder === "logos" ? "logo" : "cover photo"}`
    );
  }
}
