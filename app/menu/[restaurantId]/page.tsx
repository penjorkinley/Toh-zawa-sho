// app/menu/[restaurantId]/page.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MenuItemCard from "@/components/customer-menu/MenuItemCard";
import MenuItemModal from "@/components/customer-menu/MenuItemModal";
import Image from "next/image";
import { MenuItem } from "@/lib/types/menu";

// Mock data - replace with API calls
const restaurantData = {
  id: "1",
  name: "Bistro Fine Dining",
  logo: "/tzs-logo.svg",
  greeting: "Kuzu! Toh kae chi ya?",
};

const categories = [
  { id: "all", name: "ALL", active: true },
  { id: "bhutanese", name: "Bhutan Cuisine" },
  { id: "indian", name: "Indian Cuisine" },
  { id: "chinese", name: "Chinese" },
  { id: "continental", name: "Continental" },
  { id: "beverages", name: "Beverages" },
];

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Cheese Pizza",
    description:
      "Fresh local potatoes, green chilli, tomatoes, cottage cheese and amul cheese",
    price: { small: 230, medium: 350, large: 450 },
    sizes: ["Small", "Medium", "Large", "Regular", "Extra Large"],
    image: "/default-food-img.jpg",
    isVeg: true,
    category: "continental",
  },
  {
    id: "2",
    name: "Kewa Datsi",
    description:
      "Fresh local potatoes, chilli and traditional Bhutanese cheese",
    price: { regular: 130 },
    sizes: ["Regular"],
    image: "/default-food-img.jpg",
    isVeg: true,
    category: "bhutanese",
  },
  {
    id: "3",
    name: "Pasta",
    description: "Homemade pasta, basil and herbs",
    price: { regular: 150 },
    sizes: ["Regular"],
    image: "/default-food-img.jpg",
    isVeg: true,
    category: "continental",
  },
  {
    id: "4",
    name: "Beef Biryani",
    description: "Spiced rice with tender meat and aromatic herbs",
    price: { regular: 200 },
    sizes: ["Regular"],
    image: "/default-food-img.jpg",
    isVeg: false,
    category: "indian",
  },
  {
    id: "5",
    name: "Garden Salad",
    description: "Fresh mixed greens with seasonal vegetables",
    price: { regular: 120 },
    sizes: ["Regular"],
    image: "/default-food-img.jpg",
    isVeg: true,
    category: "continental",
  },
  {
    id: "6",
    name: "Thukpa",
    description: "Traditional Bhutanese noodle soup with vegetables",
    price: { regular: 140 },
    sizes: ["Regular"],
    image: "/default-food-img.jpg",
    isVeg: true,
    category: "bhutanese",
  },
];

export default function CustomerMenuPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<
    (typeof menuItems)[0] | null
  >(null);
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

  const handleItemClick = (item: (typeof menuItems)[0]) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-12 h-12">
              <Image
                src={restaurantData.logo}
                alt={restaurantData.name}
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-lg font-semibold text-gray-800">
              {restaurantData.greeting}
            </h1>
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
              Try searching with different keywords
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
    </div>
  );
}
