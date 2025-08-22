// app/api/admin/signup-requests/route.ts
import {
  createSupabaseServerClient,
  supabaseAdmin,
} from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Get pending signup requests
export async function GET(request: NextRequest) {
  try {
    // Create server client with proper Next.js 15 compatibility
    const supabase = await createSupabaseServerClient();

    // Verify user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is a super-admin
    const { data: profile } = await supabaseAdmin
      .from("user_profiles")
      .select("role, status")
      .eq("id", session.user.id)
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

    // Fetch pending signup requests
    const { data, error } = await supabaseAdmin
      .from("signup_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

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
    // Create server client with proper Next.js 15 compatibility
    const supabase = await createSupabaseServerClient();

    // Parse request body with proper typing
    const body = await request.json();
    const requestId = body.requestId as string;
    const status = body.status as "approved" | "rejected";

    if (!requestId || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Verify user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is a super-admin
    const { data: profile } = await supabaseAdmin
      .from("user_profiles")
      .select("role, status")
      .eq("id", session.user.id)
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

    // Get the signup request details
    const { data: signupRequest, error: fetchError } = await supabaseAdmin
      .from("signup_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchError || !signupRequest) {
      return NextResponse.json(
        { success: false, error: "Signup request not found" },
        { status: 404 }
      );
    }

    // Update signup request status
    const { error: updateError } = await supabaseAdmin
      .from("signup_requests")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateError) {
      throw updateError;
    }

    if (status === "approved") {
      // Update user profile status to approved
      const { error: profileUpdateError } = await supabaseAdmin
        .from("user_profiles")
        .update({ status: "approved" })
        .eq("id", signupRequest.user_id);

      if (profileUpdateError) {
        throw profileUpdateError;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Request ${status} successfully`,
    });
  } catch (error) {
    console.error("Process signup request error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
