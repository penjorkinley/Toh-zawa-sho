// Create a new file: lib/actions/user/actions.ts
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SidebarData {
  success: boolean;
  data?: {
    businessName: string;
    businessType: string;
    logoUrl?: string;
    email: string;
    initials: string; // For fallback avatar
  };
  error?: string;
}

export async function getSidebarData(): Promise<SidebarData> {
  try {
    const supabase = await createSupabaseServerClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    // Get user profile (business_name)
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("business_name")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return {
        success: false,
        error: "Failed to fetch user profile",
      };
    }

    // Get business information (business_type, logo_url)
    const { data: businessInfo, error: businessError } = await supabase
      .from("business_information")
      .select("business_type, logo_url")
      .eq("user_id", user.id)
      .single();

    if (businessError) {
      console.error("Business info fetch error:", businessError);
      return {
        success: false,
        error: "Failed to fetch business information",
      };
    }

    // Generate initials from business name
    const generateInitials = (name: string): string => {
      const words = name.trim().split(" ");
      if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
      }
      return words
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
    };

    return {
      success: true,
      data: {
        businessName: profile.business_name,
        businessType: businessInfo.business_type,
        logoUrl: businessInfo.logo_url,
        email: user.email || "",
        initials: generateInitials(profile.business_name),
      },
    };
  } catch (error) {
    console.error("Error fetching sidebar data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
