import {
  createSupabaseServerClient,
  supabaseAdmin,
} from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Get dashboard statistics
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

    // Get total restaurant owners count (approved and completed setup)
    const { count: totalRestaurants, error: totalError } = await supabaseAdmin
      .from("user_profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "restaurant-owner")
      .eq("status", "approved")
      .eq("first_login", false);

    if (totalError) {
      throw new Error("Failed to fetch total restaurants count");
    }

    // Get pending registrations count
    const { count: pendingRegistrations, error: pendingError } =
      await supabaseAdmin
        .from("signup_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

    if (pendingError) {
      throw new Error("Failed to fetch pending registrations count");
    }

    // Get restaurants with complete menu setup
    const { count: menusCompleted, error: menuError } = await supabaseAdmin
      .from("menu_setup_status")
      .select("*", { count: "exact", head: true })
      .eq("is_setup_complete", true);

    if (menuError) {
      throw new Error("Failed to fetch menu completion count");
    }

    // Get new registrations this week (approved and completed setup)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { count: newThisWeek, error: newError } = await supabaseAdmin
      .from("user_profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "restaurant-owner")
      .eq("status", "approved")
      .eq("first_login", false)
      .gte("created_at", oneWeekAgo.toISOString());

    if (newError) {
      throw new Error("Failed to fetch new registrations count");
    }

    const statsData = {
      totalRestaurants: totalRestaurants || 0,
      pendingRegistrations: pendingRegistrations || 0,
      menusCompleted: menusCompleted || 0,
      newRegistrationsThisWeek: newThisWeek || 0,
    };

    return NextResponse.json({
      success: true,
      data: statsData,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard stats",
      },
      { status: 500 }
    );
  }
}
