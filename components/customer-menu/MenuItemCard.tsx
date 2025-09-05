// components/customer-menu/MenuItemCard.tsx - FIXED with proper image handling
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { MenuItem } from "@/lib/types/menu";
import { useState } from "react";

interface MenuItemCardProps {
  item: MenuItem;
  onClick: () => void;
}

export default function MenuItemCard({ item, onClick }: MenuItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Get the lowest price for display
  const prices = Object.values(item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceDisplay =
    minPrice === maxPrice
      ? `Nu. ${minPrice}`
      : `Nu. ${minPrice} - Nu. ${maxPrice}`;

  // ✅ FIXED: Better fallback image handling
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] bg-white shadow-sm"
      onClick={onClick}
    >
      <div className="relative">
        {/* Food Image with improved fallback */}
        <div className="relative h-32 bg-gray-200">
          {!imageError ? (
            <Image
              src={item.image || "/default-food-img.jpg"}
              alt={item.name}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              sizes="(max-width: 768px) 50vw, 25vw"
              onError={handleImageError}
              onLoad={handleImageLoad}
              priority={false}
            />
          ) : (
            // ✅ FIXED: SVG fallback that always works
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Loading spinner */}
          {imageLoading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Veg/Non-veg Indicator */}
          <div className="absolute top-2 left-2 z-10">
            <div
              className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
                item.isVeg
                  ? "border-green-600 bg-white"
                  : "border-red-600 bg-white"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  item.isVeg ? "bg-green-600" : "bg-red-600"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div className="p-3">
          <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
            {item.name}
          </h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary text-sm">
              {priceDisplay}
            </span>
            {item.sizes && item.sizes.length > 1 && (
              <Badge variant="secondary" className="text-xs">
                Multiple sizes
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
