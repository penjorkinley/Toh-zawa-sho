// lib/actions/menu/actions.ts (FIXED VERSION)
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  CreateMenuCategoryDTO,
  CreateMenuItemDTO,
  MenuCategory,
  MenuItem,
  MenuItemSize,
  MenuSetupData,
  MenuSetupStatus,
  UpdateMenuCategoryDTO,
  UpdateMenuItemDTO,
} from "@/lib/types/menu-management";
import { Octokit } from "@octokit/rest";
import { revalidatePath } from "next/cache";

// GitHub configuration
const GITHUB_REPO = process.env.GITHUB_REPO || "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const BRANCH = process.env.GITHUB_BRANCH || "main";

// Parse repo owner and name from GITHUB_REPO (format: owner/repo)
const [REPO_OWNER, REPO_NAME] = GITHUB_REPO.split("/");

// Base path for images in the repository
const BASE_PATH = "public/images";

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

// FIXED: Direct GitHub upload in server action (no API route call)
export async function uploadMenuItemImage(
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createSupabaseServerClient();

    // Get current user from server-side auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Validate GitHub configuration
    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      console.error("Missing GitHub configuration");
      return { success: false, error: "GitHub configuration missing" };
    }

    // Convert file to base64 for processing
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    // Create a unique filename for menu items
    const fileExt = file.name.split(".").pop() || "jpg";
    const uniqueFileName = `menu-item-${user.id}-${Date.now()}.${fileExt}`;

    // Set up GitHub client
    const octokit = new Octokit({
      auth: GITHUB_TOKEN,
    });

    // File path in the repository
    const filePath = `${BASE_PATH}/menu-items/${uniqueFileName}`;

    try {
      // Upload file directly to GitHub (no API route call)
      const response = await octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: filePath,
        message: `Upload menu item image: ${uniqueFileName}`,
        content: base64,
        branch: BRANCH,
      });

      // Get the raw content URL
      const rawContentUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${filePath}`;

      console.log(
        "✅ Successfully uploaded menu item image to GitHub:",
        rawContentUrl
      );

      return {
        success: true,
        url: rawContentUrl,
      };
    } catch (githubError) {
      console.error("GitHub API Error:", githubError);
      return {
        success: false,
        error: "Failed to upload to GitHub repository",
      };
    }
  } catch (error) {
    console.error("Error uploading menu item image:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to upload menu item image",
    };
  }
}

// Check if user has completed menu setup
export async function checkMenuSetupStatus(): Promise<{
  success: boolean;
  isSetupComplete: boolean;
  setupStatus?: MenuSetupStatus;
  error?: string;
}> {
  try {
    const businessId = await getCurrentUserBusinessId();
    if (!businessId) {
      return {
        success: false,
        isSetupComplete: false,
        error: "Business not found",
      };
    }

    const supabase = await createSupabaseServerClient();

    const { data: setupStatus, error } = await supabase
      .from("menu_setup_status")
      .select("*")
      .eq("business_id", businessId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error
      throw error;
    }

    return {
      success: true,
      isSetupComplete: setupStatus?.is_setup_complete || false,
      setupStatus: setupStatus || undefined,
    };
  } catch (error) {
    console.error("Error checking menu setup status:", error);
    return {
      success: false,
      isSetupComplete: false,
      error:
        error instanceof Error ? error.message : "Failed to check setup status",
    };
  }
}

// Create menu category
export async function createMenuCategory(data: CreateMenuCategoryDTO): Promise<{
  success: boolean;
  category?: MenuCategory;
  error?: string;
}> {
  try {
    const businessId = await getCurrentUserBusinessId();
    if (!businessId) {
      return { success: false, error: "Business not found" };
    }

    const supabase = await createSupabaseServerClient();

    const { data: category, error } = await supabase
      .from("menu_categories")
      .insert({
        business_id: businessId,
        name: data.name,
        description: data.description,
        display_order: data.display_order || 0,
        template_id: data.template_id,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/owner-dashboard/menu-setup");
    return { success: true, category };
  } catch (error) {
    console.error("Error creating menu category:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create category",
    };
  }
}

// Get all categories for current user's business
export async function getMenuCategories(): Promise<{
  success: boolean;
  categories?: MenuCategory[];
  error?: string;
}> {
  try {
    const businessId = await getCurrentUserBusinessId();
    if (!businessId) {
      return { success: false, error: "Business not found" };
    }

    const supabase = await createSupabaseServerClient();

    const { data: categories, error } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("business_id", businessId)
      .order("display_order", { ascending: true });

    if (error) throw error;

    return { success: true, categories: categories || [] };
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch categories",
    };
  }
}

// Update menu category
export async function updateMenuCategory(
  categoryId: string,
  data: UpdateMenuCategoryDTO
): Promise<{
  success: boolean;
  category?: MenuCategory;
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: category, error } = await supabase
      .from("menu_categories")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", categoryId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/owner-dashboard/menu-setup");
    return { success: true, category };
  } catch (error) {
    console.error("Error updating menu category:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update category",
    };
  }
}

// Delete menu category
export async function deleteMenuCategory(categoryId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("menu_categories")
      .delete()
      .eq("id", categoryId);

    if (error) throw error;

    revalidatePath("/owner-dashboard/menu-setup");
    return { success: true };
  } catch (error) {
    console.error("Error deleting menu category:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}

// Create menu item with sizes
export async function createMenuItem(data: CreateMenuItemDTO): Promise<{
  success: boolean;
  item?: MenuItem;
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    // First create the menu item
    const { data: item, error: itemError } = await supabase
      .from("menu_items")
      .insert({
        category_id: data.category_id,
        name: data.name,
        description: data.description,
        image_url: data.image_url || "/default-food-img.jpg", // Use provided image or default
        is_vegetarian: data.is_vegetarian !== undefined ? data.is_vegetarian : null, // Handle null for "no preference"
        display_order: data.display_order || 0,
        template_item_id: data.template_item_id,
        is_custom: data.is_custom || false,
        has_multiple_sizes: data.has_multiple_sizes,
      })
      .select()
      .single();

    if (itemError) throw itemError;

    // Then create the sizes
    if (data.sizes && data.sizes.length > 0) {
      const sizesData = data.sizes.map((size, index) => ({
        item_id: item.id,
        size_name: size.size_name,
        price: size.price,
        display_order: size.display_order || index,
      }));

      const { error: sizesError } = await supabase
        .from("menu_item_sizes")
        .insert(sizesData);

      if (sizesError) throw sizesError;
    }

    revalidatePath("/owner-dashboard/menu-setup");
    return { success: true, item };
  } catch (error) {
    console.error("Error creating menu item:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create menu item",
    };
  }
}

// Get menu items for a category
export async function getMenuItems(categoryId: string): Promise<{
  success: boolean;
  items?: MenuItem[];
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: items, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category_id", categoryId)
      .order("display_order", { ascending: true });

    if (error) throw error;

    return { success: true, items: items || [] };
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch menu items",
    };
  }
}

// Update menu item
export async function updateMenuItem(
  itemId: string,
  data: UpdateMenuItemDTO
): Promise<{
  success: boolean;
  item?: MenuItem;
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    // Update the menu item
    const { data: item, error: itemError } = await supabase
      .from("menu_items")
      .update({
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        is_available: data.is_available,
        is_vegetarian: data.is_vegetarian,
        display_order: data.display_order,
        has_multiple_sizes: data.has_multiple_sizes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (itemError) throw itemError;

    // If sizes are provided, update them
    if (data.sizes) {
      // First, delete existing sizes
      const { error: deleteError } = await supabase
        .from("menu_item_sizes")
        .delete()
        .eq("item_id", itemId);

      if (deleteError) throw deleteError;

      // Then insert new sizes
      if (data.sizes.length > 0) {
        const sizesData = data.sizes.map((size, index) => ({
          item_id: itemId,
          size_name: size.size_name,
          price: size.price,
          display_order: size.display_order || index,
        }));

        const { error: sizesError } = await supabase
          .from("menu_item_sizes")
          .insert(sizesData);

        if (sizesError) throw sizesError;
      }
    }

    revalidatePath("/owner-dashboard/menu-setup");
    return { success: true, item };
  } catch (error) {
    console.error("Error updating menu item:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update menu item",
    };
  }
}

// Delete menu item
export async function deleteMenuItem(itemId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", itemId);

    if (error) throw error;

    revalidatePath("/owner-dashboard/menu-setup");
    return { success: true };
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete menu item",
    };
  }
}

// Complete menu setup - bulk save categories and items from template
export async function completeMenuSetup(setupData: MenuSetupData): Promise<{
  success: boolean;
  error?: string;
  message?: string;
}> {
  try {
    const businessId = await getCurrentUserBusinessId();
    if (!businessId) {
      return { success: false, error: "Business not found" };
    }

    const supabase = await createSupabaseServerClient();

    // Start a transaction by creating all categories first
    const categoryPromises = setupData.categories.map(
      async (categoryData, index) => {
        const { data: category, error: categoryError } = await supabase
          .from("menu_categories")
          .insert({
            business_id: businessId,
            name: categoryData.name,
            description: categoryData.description,
            display_order: index,
            template_id: categoryData.template_id,
          })
          .select()
          .single();

        if (categoryError) throw categoryError;

        // Create items for this category
        const itemPromises = categoryData.items.map(
          async (itemData, itemIndex) => {
            const { data: item, error: itemError } = await supabase
              .from("menu_items")
              .insert({
                category_id: category.id,
                name: itemData.name,
                description: itemData.description,
                image_url: itemData.image_url,
                is_vegetarian: itemData.is_vegetarian !== undefined ? itemData.is_vegetarian : null, // Handle null for "no preference"
                display_order: itemIndex,
                template_item_id: itemData.template_item_id,
                is_custom: itemData.is_custom || false,
                has_multiple_sizes: false, // Template items are single price
              })
              .select()
              .single();

            if (itemError) throw itemError;

            // Create a single size entry for template items
            const { error: sizeError } = await supabase
              .from("menu_item_sizes")
              .insert({
                item_id: item.id,
                size_name: "Regular",
                price: parseFloat(itemData.price),
                display_order: 0,
              });

            if (sizeError) throw sizeError;
          }
        );

        await Promise.all(itemPromises);
        return category;
      }
    );

    const categories = await Promise.all(categoryPromises);

    // Update or create menu setup status
    const totalItems = setupData.categories.reduce(
      (sum, cat) => sum + cat.items.length,
      0
    );

    const { error: setupStatusError } = await supabase
      .from("menu_setup_status")
      .upsert({
        business_id: businessId,
        is_setup_complete: true,
        setup_completed_at: new Date().toISOString(),
        total_categories: categories.length,
        total_items: totalItems,
      });

    if (setupStatusError) throw setupStatusError;

    revalidatePath("/owner-dashboard/menu-setup");
    return {
      success: true,
      message: `Menu setup completed successfully with ${categories.length} categories and ${totalItems} items!`,
    };
  } catch (error) {
    console.error("Error completing menu setup:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to complete menu setup",
    };
  }
}

export async function getCompleteMenu(): Promise<{
  success: boolean;
  categories?: Array<
    MenuCategory & { items: (MenuItem & { sizes: MenuItemSize[] })[] }
  >;
  error?: string;
}> {
  try {
    const businessId = await getCurrentUserBusinessId();
    if (!businessId) {
      return { success: false, error: "Business not found" };
    }

    const supabase = await createSupabaseServerClient();

    const { data: categories, error: categoriesError } = await supabase
      .from("menu_categories")
      .select(
        `
        *,
        menu_items (
          *,
          menu_item_sizes (*)
        )
      `
      )
      .eq("business_id", businessId)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (categoriesError) throw categoriesError;

    // Transform the data to include properly sorted items and sizes
    const categoriesWithSortedItems =
      categories?.map((category) => ({
        ...category,
        items: (category.menu_items || [])
          .sort((a: MenuItem, b: MenuItem) => a.display_order - b.display_order)
          .map((item: any) => ({
            ...item,
            sizes: (item.menu_item_sizes || []).sort(
              (a: MenuItemSize, b: MenuItemSize) =>
                a.display_order - b.display_order
            ),
          })),
      })) || [];

    return { success: true, categories: categoriesWithSortedItems };
  } catch (error) {
    console.error("Error fetching complete menu:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch menu",
    };
  }
}
