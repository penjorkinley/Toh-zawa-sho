// lib/actions/table/actions.ts - COMPLETE FILE WITH TEMPLATE SUPPORT
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  CreateTableDTO,
  PublicMenuData,
  QRCodeGenerationResult,
  TableResponse,
  UpdateTableDTO,
} from "@/lib/types/table-management";
import { revalidatePath } from "next/cache";
import QRCode from "qrcode";

// New interface for template-enabled QR generation
export interface QRCodeTemplateResult {
  success: boolean;
  qrCodeDataUrl?: string;
  templateDataUrl?: string;
  menuUrl?: string;
  restaurantName?: string;
  error?: string;
}

// Helper function to get business_id for the current user
async function getCurrentUserBusinessId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: businessInfo } = await supabase
    .from("business_information")
    .select("id")
    .eq("user_id", user.id)
    .single();

  return businessInfo?.id || null;
}

// Get all tables for the current restaurant
export async function getTables(): Promise<TableResponse> {
  try {
    const businessId = await getCurrentUserBusinessId();
    if (!businessId) {
      return { success: false, error: "Business not found" };
    }

    const supabase = await createSupabaseServerClient();

    const { data: tables, error } = await supabase
      .from("restaurant_tables")
      .select("*")
      .eq("business_id", businessId)
      .order("table_number", { ascending: true });

    if (error) throw error;

    return { success: true, tables: tables || [] };
  } catch (error) {
    console.error("Error fetching tables:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch tables",
    };
  }
}

// Create a new table
export async function createTable(
  tableData: CreateTableDTO
): Promise<TableResponse> {
  try {
    const businessId = await getCurrentUserBusinessId();
    if (!businessId) {
      return { success: false, error: "Business not found" };
    }

    const supabase = await createSupabaseServerClient();

    const { data: existingTable } = await supabase
      .from("restaurant_tables")
      .select("id")
      .eq("business_id", businessId)
      .eq("table_number", tableData.table_number)
      .single();

    if (existingTable) {
      return { success: false, error: "Table number already exists" };
    }

    const { data: table, error } = await supabase
      .from("restaurant_tables")
      .insert({
        business_id: businessId,
        table_number: tableData.table_number,
        is_active: tableData.is_active ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/owner-dashboard/tables");
    return { success: true, table };
  } catch (error) {
    console.error("Error creating table:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create table",
    };
  }
}

// Update a table
export async function updateTable(
  tableId: string,
  updates: UpdateTableDTO
): Promise<TableResponse> {
  try {
    const businessId = await getCurrentUserBusinessId();
    if (!businessId) {
      return { success: false, error: "Business not found" };
    }

    const supabase = await createSupabaseServerClient();

    if (updates.table_number) {
      const { data: existingTable } = await supabase
        .from("restaurant_tables")
        .select("id")
        .eq("business_id", businessId)
        .eq("table_number", updates.table_number)
        .neq("id", tableId)
        .single();

      if (existingTable) {
        return { success: false, error: "Table number already exists" };
      }
    }

    const { data: table, error } = await supabase
      .from("restaurant_tables")
      .update(updates)
      .eq("id", tableId)
      .eq("business_id", businessId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/owner-dashboard/tables");
    return { success: true, table };
  } catch (error) {
    console.error("Error updating table:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update table",
    };
  }
}

// Delete a table
export async function deleteTable(tableId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const businessId = await getCurrentUserBusinessId();
    if (!businessId) {
      return { success: false, error: "Business not found" };
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("restaurant_tables")
      .delete()
      .eq("id", tableId)
      .eq("business_id", businessId);

    if (error) throw error;

    revalidatePath("/owner-dashboard/tables");
    return { success: true };
  } catch (error) {
    console.error("Error deleting table:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete table",
    };
  }
}

// Generate QR code for a table - ORIGINAL VERSION (kept for backward compatibility)
export async function generateTableQRCode(
  tableId: string
): Promise<QRCodeGenerationResult> {
  try {
    const businessId = await getCurrentUserBusinessId();
    if (!businessId) {
      return { success: false, error: "Business not found" };
    }

    const supabase = await createSupabaseServerClient();

    const { data: table, error: tableError } = await supabase
      .from("restaurant_tables")
      .select(
        `
        *,
        business_information:business_id (
          id,
          business_name
        )
      `
      )
      .eq("id", tableId)
      .eq("business_id", businessId)
      .single();

    if (tableError || !table) {
      return { success: false, error: "Table not found" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const menuUrl = `${baseUrl}/menu/${businessId}/${tableId}`;

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });

    // Store QR code URL in database
    const { error: updateError } = await supabase
      .from("restaurant_tables")
      .update({ qr_code_url: menuUrl })
      .eq("id", tableId)
      .eq("business_id", businessId);

    if (updateError) {
      console.error("Error updating QR code URL:", updateError);
      // Don't fail the entire operation, just log the error
    }

    return {
      success: true,
      qrCodeDataUrl,
      menuUrl,
    };
  } catch (error) {
    console.error("Error generating QR code:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate QR code",
    };
  }
}

// NEW: Generate QR code with restaurant template data
export async function generateTableQRCodeWithTemplate(
  tableId: string
): Promise<QRCodeTemplateResult> {
  try {
    const businessId = await getCurrentUserBusinessId();
    if (!businessId) {
      return { success: false, error: "Business not found" };
    }

    const supabase = await createSupabaseServerClient();

    // Get table information
    const { data: table, error: tableError } = await supabase
      .from("restaurant_tables")
      .select("*")
      .eq("id", tableId)
      .eq("business_id", businessId)
      .single();

    if (tableError || !table) {
      return { success: false, error: "Table not found" };
    }

    // Get restaurant information and business name by following the reference chain
    const { data: businessData, error: businessError } = await supabase
      .from("business_information")
      .select("user_id")
      .eq("id", businessId)
      .single();

    if (businessError || !businessData) {
      console.error("Business error:", businessError);
      return { success: false, error: "Restaurant information not found" };
    }

    // Get business name from user_profiles using user_id
    const { data: userData, error: userError } = await supabase
      .from("user_profiles")
      .select("business_name")
      .eq("id", businessData.user_id)
      .single();

    if (userError || !userData) {
      console.error("User profile error:", userError);
      return { success: false, error: "Restaurant information not found" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const menuUrl = `${baseUrl}/menu/${businessId}/${tableId}`;

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });

    // Store QR code URL in database
    const { error: updateError } = await supabase
      .from("restaurant_tables")
      .update({ qr_code_url: menuUrl })
      .eq("id", tableId)
      .eq("business_id", businessId);

    if (updateError) {
      console.error("Error updating QR code URL:", updateError);
      // Don't fail the entire operation, just log the error
    }

    return {
      success: true,
      qrCodeDataUrl,
      menuUrl,
      restaurantName: userData.business_name || "Restaurant",
    };
  } catch (error) {
    console.error("Error generating QR code with template:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate QR code",
    };
  }
}

// PUBLIC: Get menu data for customers scanning QR codes - FIXED ORDERING
export async function getPublicMenuData(
  businessId: string,
  tableId: string
): Promise<{ success: boolean; data?: PublicMenuData; error?: string }> {
  try {
    const supabase = await createSupabaseServerClient();

    // Get restaurant info
    const { data: businessData, error: businessError } = await supabase
      .from("business_information")
      .select(
        `
        id,
        user_id,
        business_type,
        location,
        description,
        logo_url,
        cover_photo_url
      `
      )
      .eq("id", businessId)
      .single();

    if (businessError || !businessData) {
      console.error("Business data fetch error:", businessError);
      return { success: false, error: "Restaurant not found" };
    }

    // Get business name from user_profiles using the user_id
    const { data: userProfileData, error: profileError } = await supabase
      .from("user_profiles")
      .select("business_name")
      .eq("id", businessData.user_id)
      .single();

    if (profileError || !userProfileData) {
      console.error("User profile fetch error:", profileError);
    }

    const businessName = userProfileData?.business_name || "Restaurant";

    // Get table info
    const { data: tableData, error: tableError } = await supabase
      .from("restaurant_tables")
      .select("id, table_number")
      .eq("id", tableId)
      .eq("business_id", businessId)
      .eq("is_active", true)
      .single();

    if (tableError || !tableData) {
      return { success: false, error: "Table not found or inactive" };
    }

    // Get categories with proper ordering (no nested ordering)
    const { data: categories, error: menuError } = await supabase
      .from("menu_categories")
      .select(
        `
        id,
        name,
        description,
        display_order
      `
      )
      .eq("business_id", businessId)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (menuError) throw menuError;

    // Get menu items separately with proper ordering
    const { data: menuItems, error: itemsError } = await supabase
      .from("menu_items")
      .select(
        `
        id,
        category_id,
        name,
        description,
        image_url,
        is_available,
        is_vegetarian,
        display_order
      `
      )
      .eq("is_available", true)
      .in(
        "category_id",
        (categories || []).map((cat) => cat.id)
      )
      .order("display_order", { ascending: true });

    if (itemsError) throw itemsError;

    // Get item sizes separately with proper ordering
    const { data: itemSizes, error: sizesError } = await supabase
      .from("menu_item_sizes")
      .select(
        `
        id,
        item_id,
        size_name,
        price,
        display_order
      `
      )
      .in(
        "item_id",
        (menuItems || []).map((item) => item.id)
      )
      .order("display_order", { ascending: true });

    if (sizesError) throw sizesError;

    // Organize data into the expected structure
    const organizedCategories = (categories || []).map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      items: (menuItems || [])
        .filter((item) => item.category_id === category.id)
        .map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          image_url: item.image_url,
          is_available: item.is_available,
          is_vegetarian: item.is_vegetarian,
          sizes: (itemSizes || [])
            .filter((size) => size.item_id === item.id)
            .map((size) => ({
              id: size.id,
              size_name: size.size_name,
              price: size.price,
            })),
        })),
    }));

    const publicMenuData: PublicMenuData = {
      restaurant: {
        id: businessData.id,
        business_name: businessName,
        business_type: businessData.business_type,
        location: businessData.location,
        description: businessData.description,
        logo_url: businessData.logo_url,
        cover_photo_url: businessData.cover_photo_url,
      },
      table: {
        id: tableData.id,
        table_number: tableData.table_number,
      },
      menu: {
        categories: organizedCategories,
      },
    };

    return { success: true, data: publicMenuData };
  } catch (error) {
    console.error("Error fetching public menu data:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch menu data",
    };
  }
}
