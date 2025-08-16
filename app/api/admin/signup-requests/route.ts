// app/api/admin/signup-requests/route.ts
import { updateSignupRequestStatus } from "@/lib/auth/helpers";
import { supabase, supabaseAdmin } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

// Get pending signup requests
export async function GET() {
  try {
    // Verify user is authenticated and is super admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Use supabaseAdmin to check admin status (bypasses RLS)
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

    // Use supabaseAdmin to get all pending requests (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from("signup_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Get signup requests error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Approve or reject signup request
export async function POST(request: NextRequest) {
  try {
    const { requestId, status } = await request.json();

    if (!requestId || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Verify user is authenticated and is super admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Use supabaseAdmin to check admin status (bypasses RLS)
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

    // Use supabaseAdmin for all update operations (bypasses RLS)
    const result = await updateSignupRequestStatus(requestId, status, user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // TODO: Send email notification to the restaurant owner
    // You can implement email sending here using services like Resend, SendGrid, etc.

    return NextResponse.json({
      success: true,
      message: `Registration ${status} successfully`,
    });
  } catch (error) {
    console.error("Update signup status error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
