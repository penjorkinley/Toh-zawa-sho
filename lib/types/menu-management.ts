// lib/types/menu-management.ts

export interface MenuCategory {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  template_id?: string;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_available: boolean;
  is_vegetarian: boolean | null; // null = no preference, true = vegetarian, false = non-vegetarian
  display_order: number;
  template_item_id?: string;
  is_custom: boolean;
  has_multiple_sizes: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItemSize {
  id: string;
  item_id: string;
  size_name: string;
  price: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Combined type for display purposes
export interface MenuItemWithSizes extends MenuItem {
  sizes: MenuItemSize[];
}

export interface MenuSetupStatus {
  id: string;
  business_id: string;
  is_setup_complete: boolean;
  setup_completed_at?: string;
  total_categories: number;
  total_items: number;
  created_at: string;
  updated_at: string;
}

// Data Transfer Objects (DTOs) for API requests
export interface CreateMenuCategoryDTO {
  name: string;
  description?: string;
  display_order?: number;
  template_id?: string;
}

export interface UpdateMenuCategoryDTO {
  name?: string;
  description?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface CreateMenuItemDTO {
  category_id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_vegetarian?: boolean | null; // null = no preference, true = vegetarian, false = non-vegetarian
  display_order?: number;
  template_item_id?: string;
  is_custom?: boolean;
  has_multiple_sizes: boolean;
  sizes: Array<{
    size_name: string;
    price: number;
    display_order?: number;
  }>;
}

export interface UpdateMenuItemDTO {
  name?: string;
  description?: string;
  image_url?: string;
  is_available?: boolean;
  is_vegetarian?: boolean | null; // null = no preference, true = vegetarian, false = non-vegetarian
  display_order?: number;
  has_multiple_sizes?: boolean;
  sizes?: Array<{
    id?: string; // For updating existing sizes
    size_name: string;
    price: number;
    display_order?: number;
  }>;
}

// Combined types for frontend usage
export interface MenuCategoryWithItems extends MenuCategory {
  items: MenuItem[];
}

export interface MenuSetupData {
  categories: Array<{
    template_id: string;
    name: string;
    description?: string;
    items: Array<{
      name: string;
      description: string;
      price: string;
      image_url?: string;
      is_vegetarian?: boolean | null; // null = no preference, true = vegetarian, false = non-vegetarian
      template_item_id?: string;
      is_custom?: boolean;
    }>;
  }>;
}

// API Response types
export interface MenuCategoryResponse {
  success: boolean;
  category?: MenuCategory;
  categories?: MenuCategory[];
  error?: string;
}

export interface MenuItemResponse {
  success: boolean;
  item?: MenuItem;
  items?: MenuItem[];
  error?: string;
}

export interface MenuSetupResponse {
  success: boolean;
  message?: string;
  setupStatus?: MenuSetupStatus;
  error?: string;
}

// Frontend state types (compatible with your existing code)
export interface SelectedCategory {
  template: {
    id: string;
    name: string;
    icon: any;
    description: string;
    items: Array<{
      name: string;
      description: string;
      defaultPrice: string;
      image?: string;
    }>;
  };
  selectedItems: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
    isCustom?: boolean;
    image?: string;
  }>;
}

export interface ManualCategory {
  id: string;
  title: string;
  isOpen: boolean;
  isEditing?: boolean;
}
