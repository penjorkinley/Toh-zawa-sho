// app/api/menu/complete/route.ts
import { getCompleteMenu } from "@/lib/actions/menu/actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getCompleteMenu();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      categories: result.categories,
    });
  } catch (error) {
    console.error("Complete menu GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
