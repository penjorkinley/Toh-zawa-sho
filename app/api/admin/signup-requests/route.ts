// app/api/admin/signup-requests/route.ts
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email/service";
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

    // Verify user is authenticated (more secure than getSession)
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
    const rejectionReason = body.rejectionReason as string | undefined;

    if (!requestId || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Verify user is authenticated (more secure than getSession)
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

    // Get the signup request details BEFORE updating (we need email and business_name)
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

    // Check if already processed
    if (signupRequest.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Request has already been processed" },
        { status: 400 }
      );
    }

    // Update signup request status
    const { error: updateError } = await supabaseAdmin
      .from("signup_requests")
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateError) {
      throw updateError;
    }

    // Update user profile status if approved
    if (status === "approved") {
      const { error: profileUpdateError } = await supabaseAdmin
        .from("user_profiles")
        .update({ status: "approved" })
        .eq("id", signupRequest.user_id);

      if (profileUpdateError) {
        throw profileUpdateError;
      }
    }

    // Send email notification
    let emailResult;
    try {
      if (status === "approved") {
        emailResult = await sendApprovalEmail(
          signupRequest.email,
          signupRequest.business_name
        );
      } else if (status === "rejected") {
        emailResult = await sendRejectionEmail(
          signupRequest.email,
          signupRequest.business_name,
          rejectionReason
        );
      }

      // Log email result but don't fail the whole operation if email fails
      if (emailResult && !emailResult.success) {
        console.error("Failed to send notification email:", emailResult.error);
        // You could optionally store this failure in a separate email_logs table
      } else if (emailResult && emailResult.success) {
        console.log(
          "✅ Notification email sent successfully to:",
          signupRequest.email
        );
      }
    } catch (emailError) {
      // Log email error but don't fail the operation
      console.error("Email sending error:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: `Request ${status} successfully`,
      emailSent: emailResult?.success || false,
    });
  } catch (error) {
    console.error("Process signup request error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
