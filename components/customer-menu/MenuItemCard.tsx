// components/customer-menu/MenuItemCard.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { MenuItem } from "@/lib/types/menu";

interface MenuItemCardProps {
  item: MenuItem;
  onClick: () => void;
}

export default function MenuItemCard({ item, onClick }: MenuItemCardProps) {
  // Get the lowest price for display
  const prices = Object.values(item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceDisplay =
    minPrice === maxPrice
      ? `Nu. ${minPrice}`
      : `Nu. ${minPrice} - Nu. ${maxPrice}`;

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] bg-white shadow-sm"
      onClick={onClick}
    >
      <div className="relative">
        {/* Food Image */}
        <div className="relative h-32 bg-gray-200">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = "/placeholder-food.jpg";
            }}
          />

          {/* Veg/Non-veg Indicator */}
          <div className="absolute top-2 left-2">
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

        {/* Content */}
        <div className="p-3">
          {/* Item Name */}
          <h3 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-1">
            {item.name}
          </h3>

          {/* Sizes (if multiple) */}
          {item.sizes.length > 1 && (
            <div className="flex gap-1 mb-2">
              {item.sizes.slice(0, 3).map((size) => (
                <Badge
                  key={size}
                  variant="outline"
                  className="text-xs px-2 py-0 h-5 text-gray-600 border-gray-300"
                >
                  {size.charAt(0)}
                </Badge>
              ))}
              {item.sizes.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0 h-5 text-gray-600 border-gray-300"
                >
                  +{item.sizes.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-gray-800">
              {priceDisplay}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
