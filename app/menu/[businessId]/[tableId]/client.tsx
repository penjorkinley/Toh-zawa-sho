// app/menu/[businessId]/[tableId]/client.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MenuItemCard from "@/components/customer-menu/MenuItemCard";
import MenuItemModal from "@/components/customer-menu/MenuItemModal";
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
      {/* Header - Redesigned */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-5">
          {/* Top section with circular table number and welcome message */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-lg">
              <div className="text-center">
                <div className="text-xs font-medium text-white opacity-90">
                  TABLE
                </div>
                <div className="text-lg font-bold text-white">
                  {menuData.table.table_number}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                Kuzu! Welcome to
              </h1>
              <p className="text-lg font-semibold text-primary">
                {restaurant.name}
              </p>
            </div>
          </div>

          {/* Search Bar */}
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
              className="pl-10 bg-gray-50 border border-gray-300 rounded-full h-11 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Category Filters - Horizontally Scrollable */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 px-4 pb-4 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-full transition-colors border border-primary text-sm font-medium ${
                  activeCategory === category.id
                    ? "bg-primary text-white"
                    : "bg-transparent text-primary hover:bg-primary/5"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
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

      {/* Footer - Simplified */}
      <div className="bg-white border-t border-gray-200 mt-8">
        <div className="px-4 py-6">
          <div className="text-center space-y-2">
            <p className="text-primary font-medium">
              Thank you for dining with us!
            </p>
            <p className="text-gray-600 font-medium">Do visit us again</p>
          </div>
        </div>
      </div>
    </div>
  );
}
