// app/api/admin/signup-requests/route.ts - Approach 1: Auto-delete on rejection
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email/service";
import {
  createSupabaseServerClient,
  supabaseAdmin,
} from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Get pending signup requests
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
    const supabase = await createSupabaseServerClient();

    // Parse request body
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

    // Verify user is authenticated
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

    // Get signup request details BEFORE updating
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

    if (updateError) throw updateError;

    let userDeleted = false;

    // Handle approval or rejection
    if (status === "approved") {
      // Update user profile to approved
      const { error: profileUpdateError } = await supabaseAdmin
        .from("user_profiles")
        .update({ status: "approved" })
        .eq("id", signupRequest.user_id);

      if (profileUpdateError) throw profileUpdateError;
    } else if (status === "rejected") {
      // APPROACH 1: Always delete user on rejection
      try {
        console.log(
          `🗑️ Deleting rejected user: ${signupRequest.email} (${signupRequest.business_name})`
        );

        const { error: deleteError } =
          await supabaseAdmin.auth.admin.deleteUser(signupRequest.user_id);

        if (deleteError) {
          console.error("❌ Failed to delete user:", deleteError);
          throw new Error("Failed to delete user account");
        }

        userDeleted = true;
        console.log(
          `✅ User ${signupRequest.email} deleted successfully. They can now re-register immediately.`
        );
      } catch (deleteErr) {
        console.error("User deletion failed:", deleteErr);
        // Don't fail the whole operation, but log the issue
        throw new Error("Failed to delete user account after rejection");
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

      // Log email result
      if (emailResult && !emailResult.success) {
        console.error("Failed to send notification email:", emailResult.error);
      } else if (emailResult && emailResult.success) {
        console.log(
          "✅ Notification email sent successfully to:",
          signupRequest.email
        );
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: `Request ${status} successfully`,
      emailSent: emailResult?.success || false,
      userDeleted,
      canReregisterImmediately: userDeleted,
    });
  } catch (error) {
    console.error("Process signup request error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
