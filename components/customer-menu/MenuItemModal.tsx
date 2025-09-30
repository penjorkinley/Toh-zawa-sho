// components/customer-menu/MenuItemModal.tsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { MenuItem } from "@/lib/types/menu";

interface MenuItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuItemModal({
  item,
  isOpen,
  onClose,
}: MenuItemModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Reset state when modal opens with new item
  useEffect(() => {
    if (item && isOpen) {
      setSelectedSize(item.sizes[0] || "");
    }
  }, [item, isOpen]);

  // Scroll lock - prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Lock scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        // Restore scroll
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!item) return null;

  const hasMultipleSizes = item.sizes.length > 1;

  const getCurrentPrice = () => {
    if (selectedSize) {
      const sizeKey = selectedSize.toLowerCase();
      return item.price[sizeKey] || Object.values(item.price)[0];
    }
    return Object.values(item.price)[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl mx-auto max-w-md w-full h-[45vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white hover:text-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Food Image */}
        <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={(e) => {
              e.currentTarget.src = "/default-food-img.png";
            }}
          />

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

          {/* Veg/Non-veg Indicator - Only show if preference is specified (not null) */}
          {item.isVeg !== null && (
            <div className="absolute bottom-4 left-4">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-lg backdrop-blur-sm ${
                  item.isVeg
                    ? "border-green-500 bg-white/95"
                    : "border-red-500 bg-white/95"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.isVeg ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="p-4 space-y-4">
            {/* Header Section - Better aligned */}
            <div className="space-y-3">
              {/* Name and Price - Centered approach */}
              <div className="text-center space-y-2">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  {item.name}
                </h1>
                {!hasMultipleSizes && (
                  <div className="inline-flex items-center justify-center">
                    <span className="text-lg font-bold text-orange-600">
                      Nu. {getCurrentPrice()}
                    </span>
                  </div>
                )}
              </div>

              {/* Description with better spacing */}
              {item.description && (
                <div className="text-center px-2">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )}
            </div>

            {/* Size Selection for multiple sizes - Clean centered design */}
            {hasMultipleSizes && (
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Available Sizes
                  </h3>
                  <p className="text-xs text-gray-500">
                    Select your preferred size
                  </p>
                </div>
                <div className="space-y-2">
                  {item.sizes.map((size, index) => {
                    const sizePrice =
                      item.price[size.toLowerCase()] ||
                      item.price[Object.keys(item.price)[0]];
                    return (
                      <div
                        key={size}
                        className="group bg-white hover:bg-orange-50 rounded-xl p-3 transition-all duration-200 border border-gray-100 hover:border-orange-200 hover:shadow-sm cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-400 group-hover:bg-orange-500 transition-colors"></div>
                            <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">
                              {size}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-orange-600 group-hover:text-orange-700">
                              Nu. {sizePrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Additional spacing at bottom for better scrolling */}
            <div className="h-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
