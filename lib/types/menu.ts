// lib/types/menu.ts
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: { [key: string]: number };
  sizes: string[];
  image: string;
  isVeg: boolean;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  greeting: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  active?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  isVeg: boolean;
}
