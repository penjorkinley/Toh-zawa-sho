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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl mx-4 max-w-sm w-full max-h-[85vh] overflow-hidden shadow-xl flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Food Image */}
        <div className="relative h-48 bg-gray-200 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={(e) => {
              e.currentTarget.src = "/default-food-img.jpg";
            }}
          />

          {/* Veg/Non-veg Indicator - Only show if preference is specified (not null) */}
          {item.isVeg !== null && (
            <div className="absolute bottom-3 left-3">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  item.isVeg
                    ? "border-green-600 bg-white"
                    : "border-red-600 bg-white"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded ${
                    item.isVeg ? "bg-green-600" : "bg-red-600"
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Item Name */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {item.name}
            </h2>

            {/* Show price only if single size */}
            {!hasMultipleSizes && (
              <div className="text-lg font-bold text-primary mb-3">
                Nu. {getCurrentPrice()}
              </div>
            )}

            {/* Size Selection for multiple sizes - Scrollable if many options */}
            {hasMultipleSizes && (
              <div className="mb-4">
                <div
                  className={`space-y-2 ${
                    item.sizes.length > 6 ? "max-h-48 overflow-y-auto pr-2" : ""
                  }`}
                >
                  {item.sizes.map((size) => {
                    const sizePrice =
                      item.price[size.toLowerCase()] ||
                      item.price[Object.keys(item.price)[0]];
                    return (
                      <div
                        key={size}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium text-gray-700">
                          {size}
                        </span>
                        <span className="font-semibold text-gray-800">
                          Nu. {sizePrice}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
