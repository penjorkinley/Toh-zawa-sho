import {
  createSupabaseServerClient,
  supabaseAdmin,
} from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Get all restaurants for super admin
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is a super-admin
    const { data: profile } = await supabaseAdmin
      .from("user_profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();

    if (
      !profile ||
      profile.role !== "super-admin" ||
      profile.status !== "approved"
    ) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Fetch all restaurant owners with their business information
    const { data: restaurants, error: restaurantsError } = await supabaseAdmin
      .from("user_profiles")
      .select(
        `
        id,
        business_name,
        phone_number,
        status,
        created_at,
        business_information!inner (
          business_type,
          location,
          logo_url,
          cover_photo_url,
          description
        )
      `
      )
      .eq("role", "restaurant-owner")
      .order("created_at", { ascending: false });

    if (restaurantsError) {
      throw new Error("Failed to fetch restaurants data");
    }

    // Get user emails from auth.users table
    const userIds = restaurants?.map((r) => r.id) || [];
    const { data: authUsers, error: authError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      throw new Error("Failed to fetch user auth data");
    }

    // Create a map of user emails
    const emailMap = new Map();
    authUsers.users.forEach((authUser) => {
      emailMap.set(authUser.id, authUser.email);
    });

    // Transform the data to match the frontend interface
    const transformedRestaurants =
      restaurants?.map((restaurant) => {
        const businessInfo = restaurant.business_information[0]; // Should be only one

        return {
          id: restaurant.id,
          businessName: restaurant.business_name,
          ownerName: restaurant.business_name, // Using business name as owner name for now
          email: emailMap.get(restaurant.id) || "",
          phone: restaurant.phone_number,
          businessType: businessInfo?.business_type || "Unknown",
          location: businessInfo?.location || "Unknown",
          registeredDate: new Date(restaurant.created_at)
            .toISOString()
            .split("T")[0],
          status: mapUserStatusToRestaurantStatus(restaurant.status),
          logo: businessInfo?.logo_url || null,
          description: businessInfo?.description || null,
          coverPhoto: businessInfo?.cover_photo_url || null,
        };
      }) || [];

    // Calculate stats
    const stats = {
      total: transformedRestaurants.length,
      active: transformedRestaurants.filter((r) => r.status === "active")
        .length,
      inactive: transformedRestaurants.filter((r) => r.status === "inactive")
        .length,
      suspended: transformedRestaurants.filter((r) => r.status === "suspended")
        .length,
    };

    return NextResponse.json({
      success: true,
      data: {
        restaurants: transformedRestaurants,
        stats,
      },
    });
  } catch (error) {
    console.error("Restaurants fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch restaurants data",
      },
      { status: 500 }
    );
  }
}

// Update restaurant status
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is a super-admin
    const { data: profile } = await supabaseAdmin
      .from("user_profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();

    if (
      !profile ||
      profile.role !== "super-admin" ||
      profile.status !== "approved"
    ) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const { restaurantId, newStatus } = await request.json();

    if (!restaurantId || !newStatus) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Map restaurant status back to user profile status
    const userStatus = mapRestaurantStatusToUserStatus(newStatus);

    // Update the restaurant status in user_profiles
    const { error: updateError } = await supabaseAdmin
      .from("user_profiles")
      .update({ status: userStatus })
      .eq("id", restaurantId)
      .eq("role", "restaurant-owner");

    if (updateError) {
      throw new Error("Failed to update restaurant status");
    }

    return NextResponse.json({
      success: true,
      message: "Restaurant status updated successfully",
    });
  } catch (error) {
    console.error("Restaurant status update error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update restaurant status",
      },
      { status: 500 }
    );
  }
}

// Helper function to map user profile status to restaurant status
function mapUserStatusToRestaurantStatus(
  userStatus: string
): "active" | "inactive" | "suspended" {
  switch (userStatus) {
    case "approved":
      return "active";
    case "pending":
      return "inactive";
    case "rejected":
      return "suspended";
    default:
      return "inactive";
  }
}

// Helper function to map restaurant status back to user profile status
function mapRestaurantStatusToUserStatus(
  restaurantStatus: string
): "approved" | "pending" | "rejected" {
  switch (restaurantStatus) {
    case "active":
      return "approved";
    case "inactive":
      return "pending";
    case "suspended":
      return "rejected";
    default:
      return "pending";
  }
}
