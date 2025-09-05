// lib/types/table-management.ts

export interface RestaurantTable {
  id: string;
  business_id: string;
  table_number: string;
  is_active: boolean;
  qr_code_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTableDTO {
  table_number: string;
  is_active?: boolean;
}

export interface UpdateTableDTO {
  table_number?: string;
  is_active?: boolean;
  qr_code_url?: string;
}

export interface TableResponse {
  success: boolean;
  table?: RestaurantTable;
  tables?: RestaurantTable[];
  error?: string;
}

export interface QRCodeGenerationResult {
  success: boolean;
  qrCodeDataUrl?: string;
  menuUrl?: string;
  error?: string;
}

export interface PublicMenuData {
  restaurant: {
    id: string;
    business_name: string;
    business_type: string;
    location: string;
    description?: string;
    logo_url?: string;
    cover_photo_url?: string;
  };
  table: {
    id: string;
    table_number: string;
  };
  menu: {
    categories: Array<{
      id: string;
      name: string;
      description?: string;
      items: Array<{
        id: string;
        name: string;
        description?: string;
        image_url?: string;
        is_available: boolean;
        is_vegetarian: boolean;
        sizes: Array<{
          id: string;
          size_name: string;
          price: number;
        }>;
      }>;
    }>;
  };
}
