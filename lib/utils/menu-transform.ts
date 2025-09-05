// lib/utils/menu-transform.ts

import { MenuCategory, MenuItem, Restaurant } from "@/lib/types/menu";
import { PublicMenuData } from "@/lib/types/table-management";

export function transformDatabaseToCustomerMenu(menuData: PublicMenuData): {
  restaurant: Restaurant;
  categories: MenuCategory[];
  menuItems: MenuItem[];
} {
  // Transform restaurant data
  const restaurant: Restaurant = {
    id: menuData.restaurant.id,
    name: menuData.restaurant.business_name,
    logo: menuData.restaurant.logo_url || "/tzs-logo.svg",
    greeting: "Kuzu! Toh kae chi ya?",
  };

  // Create categories array (including "ALL" category)
  const categories: MenuCategory[] = [
    { id: "all", name: "ALL", active: true },
    ...menuData.menu.categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
    })),
  ];

  // Transform menu items to match your existing interface
  const menuItems: MenuItem[] = [];

  menuData.menu.categories.forEach((category) => {
    category.items.forEach((item) => {
      // Transform sizes and prices
      const sizes = item.sizes.map((size) => size.size_name);
      const price: { [key: string]: number } = {};

      // Create price object with size keys (lowercase for consistency)
      item.sizes.forEach((size) => {
        const sizeKey = size.size_name.toLowerCase();
        price[sizeKey] = size.price;
      });

      // If only one size, also create a "regular" key for backward compatibility
      if (item.sizes.length === 1) {
        price.regular = item.sizes[0].price;
      }

      const transformedItem: MenuItem = {
        id: item.id,
        name: item.name,
        description: item.description || "",
        price,
        sizes,
        image: item.image_url || "/default-food-img.jpg",
        isVeg: item.is_vegetarian,
        category: category.id,
      };

      menuItems.push(transformedItem);
    });
  });

  return {
    restaurant,
    categories,
    menuItems,
  };
}
