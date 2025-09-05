// app/menu/[businessId]/[tableId]/client.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MenuItemCard from "@/components/customer-menu/MenuItemCard";
import MenuItemModal from "@/components/customer-menu/MenuItemModal";
import Image from "next/image";
import { MenuItem } from "@/lib/types/menu";
import { PublicMenuData } from "@/lib/types/table-management";
import { transformDatabaseToCustomerMenu } from "@/lib/utils/menu-transform";

interface CustomerMenuClientProps {
  menuData: PublicMenuData;
}

export default function CustomerMenuClient({
  menuData,
}: CustomerMenuClientProps) {
  // Transform database format to your existing component format
  const { restaurant, categories, menuItems } =
    transformDatabaseToCustomerMenu(menuData);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter menu items based on search and category
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Enhanced with table info */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-12 h-12">
              <Image
                src={restaurant.logo}
                alt={restaurant.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-800">
                {restaurant.greeting}
              </h1>
              {/* Show restaurant name and table info */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">{restaurant.name}</span>
                <Badge variant="outline" className="text-xs">
                  Table {menuData.table.table_number}
                </Badge>
              </div>
            </div>
          </div>

          {/* Search Bar with border */}
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${
                isSearchFocused || searchTerm ? "text-primary" : "text-gray-400"
              }`}
            />
            <Input
              type="text"
              placeholder="Search for dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-10 bg-gray-50 border border-gray-300 rounded-full h-10 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Category Filters - Horizontally Scrollable */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 px-4 pb-4 min-w-max">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant="outline"
                className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-full transition-colors border-primary text-primary ${
                  activeCategory === category.id
                    ? "bg-primary text-white"
                    : "bg-transparent hover:bg-primary/5"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="px-4 py-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-1">
              No items found
            </h3>
            <p className="text-sm text-gray-500">
              {searchTerm
                ? "Try searching with different keywords"
                : "No menu items available in this category"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Menu Item Detail Modal */}
      <MenuItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="px-4 text-center">
          <p className="text-gray-600 text-sm">Thank you for dining with us!</p>
          <p className="text-gray-500 text-xs mt-1">
            Table {menuData.table.table_number} •{" "}
            {menuData.restaurant.business_name}
          </p>
        </div>
      </div>
    </div>
  );
}
