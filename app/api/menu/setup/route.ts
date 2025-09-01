// app/api/menu/setup/route.ts
import {
  checkMenuSetupStatus,
  completeMenuSetup,
} from "@/lib/actions/menu/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await checkMenuSetupStatus();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      isSetupComplete: result.isSetupComplete,
      setupStatus: result.setupStatus,
    });
  } catch (error) {
    console.error("Menu setup status GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const setupData = await request.json();

    const result = await completeMenuSetup(setupData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Menu setup POST error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
