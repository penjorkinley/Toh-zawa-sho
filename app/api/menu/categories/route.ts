// app/api/menu/categories/route.ts
import {
  createMenuCategory,
  getMenuCategories,
} from "@/lib/actions/menu/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getMenuCategories();

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
    console.error("Categories GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const result = await createMenuCategory(data);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      category: result.category,
    });
  } catch (error) {
    console.error("Categories POST error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
