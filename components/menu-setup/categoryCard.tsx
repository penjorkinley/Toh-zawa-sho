// components/menu-setup/categoryCard.tsx (FIXED VERSION - No blob URLs)
"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  Edit,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Save,
  X,
  Upload,
  ImageIcon,
} from "lucide-react";
import { Button } from "../ui/shadcn-button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  updateMenuCategory,
  createMenuItem,
  deleteMenuItem,
  createMenuCategory,
  uploadMenuItemImage,
} from "@/lib/actions/menu/actions";

// Database menu item interface (with sizes)
interface DatabaseMenuItem {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_available: boolean;
  is_vegetarian: boolean;
  has_multiple_sizes: boolean;
  sizes?: Array<{
    id: string;
    size_name: string;
    price: number;
  }>;
}

interface CategoryCardProps {
  id: string;
  title: string;
  isOpen: boolean;
  isEditing?: boolean;
  existingItems?: DatabaseMenuItem[];
  onOpenChange: (isOpen: boolean) => void;
  onDelete?: (id: string) => void;
  onSave?: (id: string, newTitle: string) => void;
}

// Advanced Menu Item Form Component
interface MenuItemFormProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onDelete: () => void;
  onSave: (itemData: {
    name: string;
    description: string;
    is_vegetarian: boolean;
    has_multiple_sizes: boolean;
    sizes: Array<{ size_name: string; price: number }>;
    image_url: string;
  }) => void;
}

function MenuItemForm({
  isOpen,
  onToggle,
  onDelete,
  onSave,
}: MenuItemFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [hasMultipleSizes, setHasMultipleSizes] = useState(false);
  const [singlePrice, setSinglePrice] = useState("");
  const [sizes, setSizes] = useState<
    Array<{ size_name: string; price: string }>
  >([{ size_name: "", price: "" }]);
  const [isSaving, setIsSaving] = useState(false);

  // FIXED: Image handling state - store File object, not blob URL
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(
    "/default-food-img.jpg"
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // FIXED: Properly manage image preview with cleanup
  React.useEffect(() => {
    if (selectedImageFile) {
      const objectUrl = URL.createObjectURL(selectedImageFile);
      setImagePreviewUrl(objectUrl);

      // Cleanup function to revoke the object URL
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setImagePreviewUrl("/default-food-img.jpg");
    }
  }, [selectedImageFile]);

  const addSize = () => {
    setSizes([...sizes, { size_name: "", price: "" }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const updateSize = (
    index: number,
    field: "size_name" | "price",
    value: string
  ) => {
    setSizes(
      sizes.map((size, i) => (i === index ? { ...size, [field]: value } : size))
    );
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // FIXED: Store the File object, not a blob URL
      setSelectedImageFile(file);
      console.log("📷 Image file selected:", file.name, file.size);
    }
  };

  const removeImage = () => {
    setSelectedImageFile(null);
    // Preview URL will be reset by useEffect
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter an item name");
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = "/default-food-img.jpg";

      // FIXED: Upload actual File object if selected
      if (selectedImageFile) {
        console.log("📤 Uploading image file:", selectedImageFile.name);
        setIsUploadingImage(true);

        const uploadResult = await uploadMenuItemImage(selectedImageFile);
        setIsUploadingImage(false);

        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
          console.log("✅ Image uploaded successfully:", imageUrl);
        } else {
          console.error("❌ Image upload failed:", uploadResult.error);
          alert(`Image upload failed: ${uploadResult.error}`);
          // Continue with default image instead of failing completely
        }
      }

      let sizesData;

      if (hasMultipleSizes) {
        // Validate all sizes have name and price
        const validSizes = sizes.filter(
          (s) => s.size_name.trim() && s.price.trim()
        );
        if (validSizes.length === 0) {
          alert("Please add at least one size with name and price");
          return;
        }
        sizesData = validSizes.map((s) => ({
          size_name: s.size_name.trim(),
          price: parseFloat(s.price),
        }));
      } else {
        if (!singlePrice.trim()) {
          alert("Please enter a price");
          return;
        }
        sizesData = [{ size_name: "Regular", price: parseFloat(singlePrice) }];
      }

      await onSave({
        name: name.trim(),
        description: description.trim(),
        is_vegetarian: isVegetarian,
        has_multiple_sizes: hasMultipleSizes,
        sizes: sizesData,
        image_url: imageUrl, // This will be a real URL, not a blob URL
      });

      // Reset form
      setName("");
      setDescription("");
      setIsVegetarian(false);
      setHasMultipleSizes(false);
      setSinglePrice("");
      setSizes([{ size_name: "", price: "" }]);
      setSelectedImageFile(null);
      // imagePreviewUrl will be reset by useEffect

      console.log("✅ Menu item saved successfully");
    } catch (error) {
      console.error("❌ Error saving item:", error);
      alert("Failed to save item");
    } finally {
      setIsSaving(false);
      setIsUploadingImage(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setIsVegetarian(false);
    setHasMultipleSizes(false);
    setSinglePrice("");
    setSizes([{ size_name: "", price: "" }]);
    setSelectedImageFile(null);
    // imagePreviewUrl will be reset by useEffect
    onDelete();
  };

  if (!isOpen) {
    return (
      <Card className="border border-dashed border-gray-300">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">New Item</span>
            <Button variant="ghost" size="sm" onClick={() => onToggle(true)}>
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-primary">
      <CardContent className="p-4 space-y-4">
        {/* Image Upload Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Item Image</label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50">
              <Image
                src={imagePreviewUrl}
                alt="Item preview"
                fill
                className="object-cover"
                unoptimized // Prevent Next.js optimization issues with blob URLs
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                  className="gap-2"
                  disabled={isUploadingImage}
                >
                  <Upload className="h-3 w-3" />
                  {selectedImageFile ? "Change Image" : "Upload Image"}
                </Button>
                {selectedImageFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeImage}
                    className="text-red-600 hover:text-red-700"
                    disabled={isUploadingImage}
                  >
                    <X className="h-3 w-3" />
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedImageFile
                  ? `Selected: ${selectedImageFile.name}`
                  : "Upload an image or use default"}
              </p>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Basic Item Info */}
        <div className="space-y-3">
          <Input
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Item description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          {/* Vegetarian Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vegetarian"
              checked={isVegetarian}
              onCheckedChange={(checked) => setIsVegetarian(!!checked)}
            />
            <label htmlFor="vegetarian" className="text-sm">
              Vegetarian
            </label>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="multipleSizes"
              checked={hasMultipleSizes}
              onCheckedChange={(checked) => setHasMultipleSizes(!!checked)}
            />
            <label htmlFor="multipleSizes" className="text-sm font-medium">
              Multiple sizes with different prices
            </label>
          </div>

          {!hasMultipleSizes ? (
            // Single Price
            <div className="flex items-center gap-2">
              <span className="text-sm">Nu.</span>
              <Input
                type="number"
                placeholder="Price"
                value={singlePrice}
                onChange={(e) => setSinglePrice(e.target.value)}
                className="flex-1"
              />
            </div>
          ) : (
            // Multiple Sizes
            <div className="space-y-2">
              <div className="text-sm font-medium">Sizes & Prices:</div>
              {sizes.map((size, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Size (e.g., Small, Medium)"
                    value={size.size_name}
                    onChange={(e) =>
                      updateSize(index, "size_name", e.target.value)
                    }
                    className="flex-1"
                  />
                  <span className="text-sm">Nu.</span>
                  <Input
                    type="number"
                    placeholder="Price"
                    value={size.price}
                    onChange={(e) => updateSize(index, "price", e.target.value)}
                    className="w-24"
                  />
                  {sizes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSize(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addSize}
                className="w-full"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Size
              </Button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isSaving || isUploadingImage}
          >
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!name.trim() || isSaving || isUploadingImage}
          >
            <Save className="h-3 w-3 mr-1" />
            {isUploadingImage
              ? "Uploading..."
              : isSaving
              ? "Saving..."
              : "Save Item"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CategoryCard({
  id,
  title,
  isOpen,
  isEditing = false,
  existingItems = [],
  onOpenChange,
  onDelete,
  onSave,
}: CategoryCardProps) {
  const [isEditingLocal, setIsEditingLocal] = useState(isEditing);
  const [editedTitle, setEditedTitle] = useState(title);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const isNewCategory = !title;

  React.useEffect(() => {
    if (isEditing || isNewCategory) {
      setIsEditingLocal(true);
    }
  }, [isEditing, isNewCategory]);

  const handleSaveNewItem = async (itemData: {
    name: string;
    description: string;
    is_vegetarian: boolean;
    has_multiple_sizes: boolean;
    sizes: Array<{ size_name: string; price: number }>;
    image_url: string;
  }) => {
    try {
      console.log("💾 Creating new menu item:", itemData);

      const result = await createMenuItem({
        category_id: id,
        name: itemData.name,
        description: itemData.description,
        image_url: itemData.image_url, // This should now be a real URL
        is_vegetarian: itemData.is_vegetarian,
        is_custom: true,
        has_multiple_sizes: itemData.has_multiple_sizes,
        sizes: itemData.sizes,
      });

      if (result.success) {
        console.log("✅ Menu item created successfully");
        setShowNewItemForm(false);
        window.location.reload(); // Refresh to show new item
      } else {
        console.error("❌ Failed to save menu item:", result.error);
        alert("Failed to save menu item: " + result.error);
      }
    } catch (error) {
      console.error("❌ Error saving menu item:", error);
      alert("Error saving menu item");
    }
  };

  const handleDeleteExistingItem = async (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const result = await deleteMenuItem(itemId);
        if (result.success) {
          window.location.reload();
        } else {
          alert("Failed to delete menu item");
        }
      } catch (error) {
        console.error("Error deleting menu item:", error);
        alert("Error deleting menu item");
      }
    }
  };

  const handleSaveEdit = async () => {
    if (editedTitle.trim()) {
      console.log("💾 Saving category:", {
        id,
        title,
        editedTitle: editedTitle.trim(),
      });

      // Check if this is a temporary category (new category) or existing category
      const isTemporaryCategory = id.startsWith("temp-");

      if (isTemporaryCategory) {
        // This is a new category - create in database
        console.log("🆕 Creating new category in database");
        try {
          const result = await createMenuCategory({
            name: editedTitle.trim(),
          });
          if (result.success) {
            console.log("✅ Category created successfully:", result.category);
            setIsEditingLocal(false);
            // Call onSave to remove temp category from parent state
            if (onSave) {
              onSave(id, editedTitle.trim());
            }
            // Refresh to show the new category from database
            window.location.reload();
          } else {
            console.error("❌ Failed to create category:", result.error);
            alert("Failed to create category");
          }
        } catch (error) {
          console.error("❌ Error creating category:", error);
          alert("Error creating category");
        }
      } else if (onSave) {
        // This is an existing category - just update title via parent callback
        console.log("📝 Updating existing category via onSave callback");
        onSave(id, editedTitle.trim());
        setIsEditingLocal(false);
      } else {
        // Existing category but no onSave callback - update in database directly
        console.log("📝 Updating existing category in database");
        try {
          const result = await updateMenuCategory(id, {
            name: editedTitle.trim(),
          });
          if (result.success) {
            console.log("✅ Category updated successfully");
            setIsEditingLocal(false);
            window.location.reload();
          } else {
            console.error("❌ Failed to update category:", result.error);
            alert("Failed to update category");
          }
        } catch (error) {
          console.error("❌ Error updating category:", error);
          alert("Error updating category");
        }
      }
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(title);
    setIsEditingLocal(false);
    if (!title) {
      onDelete?.(id);
    }
  };

  const getTotalItemCount = () => {
    return existingItems.length + (showNewItemForm ? 1 : 0);
  };

  const formatItemPrice = (item: DatabaseMenuItem) => {
    if (!item.sizes || item.sizes.length === 0) return "Nu. 0";

    if (item.has_multiple_sizes) {
      const prices = item.sizes.map((s) => s.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return minPrice === maxPrice
        ? `Nu. ${minPrice}`
        : `Nu. ${minPrice} - ${maxPrice}`;
    } else {
      return `Nu. ${item.sizes[0]?.price || 0}`;
    }
  };

  if (isEditingLocal) {
    return (
      <Card className="border bg-background">
        <CardContent className="p-4 space-y-4">
          <Input
            placeholder="Enter category name"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSaveEdit();
              }
              if (e.key === "Escape") {
                handleCancelEdit();
              }
            }}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="border-primary text-primary"
              size="sm"
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-white"
              size="sm"
              onClick={handleSaveEdit}
              disabled={!editedTitle.trim()}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border bg-background shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary">
              <span className="text-lg font-medium">=</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-medium">
                  {title || "Untitled Category"}
                </span>
                {getTotalItemCount() > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {getTotalItemCount()} items
                  </Badge>
                )}
              </div>
              {!isOpen && existingItems.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {existingItems
                    .slice(0, 2)
                    .map((item) => item.name)
                    .join(", ")}
                  {existingItems.length > 2 &&
                    ` +${existingItems.length - 2} more`}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setIsEditingLocal(true)}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Category
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(id)}
                  className="cursor-pointer text-red-600 hover:text-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Category
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(!isOpen)}
            >
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-4 pt-0 space-y-4">
          {/* Existing Items */}
          {existingItems.map((item) => (
            <Card key={item.id} className="border border-gray-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {/* Item Image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image_url || "/default-food-img.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/default-food-img.jpg";
                      }}
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">
                        {item.name}
                      </h4>
                      {item.is_vegetarian && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700 flex-shrink-0"
                        >
                          Veg
                        </Badge>
                      )}
                      {!item.is_available && (
                        <Badge
                          variant="destructive"
                          className="text-xs flex-shrink-0"
                        >
                          Unavailable
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {item.description || "No description"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {formatItemPrice(item)}
                      </span>
                      {item.has_multiple_sizes && (
                        <Badge variant="outline" className="text-xs">
                          Multiple Sizes
                        </Badge>
                      )}
                    </div>
                    {/* Show sizes if multiple */}
                    {item.has_multiple_sizes && item.sizes && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.sizes
                          .map((s) => `${s.size_name}: Nu. ${s.price}`)
                          .join(", ")}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        console.log("Edit item:", item.id);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExistingItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* New Item Form */}
          {showNewItemForm && (
            <MenuItemForm
              isOpen={showNewItemForm}
              onToggle={setShowNewItemForm}
              onDelete={() => setShowNewItemForm(false)}
              onSave={handleSaveNewItem}
            />
          )}

          {/* Add Item Button */}
          <Button
            variant="outline"
            className="w-full border-dashed border-primary text-primary hover:bg-primary/5"
            onClick={() => setShowNewItemForm(true)}
            disabled={showNewItemForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item to {title}
          </Button>

          {/* Empty State */}
          {existingItems.length === 0 && !showNewItemForm && (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">No items in this category yet</p>
              <p className="text-xs mt-1">
                Click the button above to add your first item
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
