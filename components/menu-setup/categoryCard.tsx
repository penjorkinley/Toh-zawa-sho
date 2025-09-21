// Complete CategoryCard implementation with Menu Item editing
// Replace the entire CategoryCard component in components/menu-setup/categoryCard.tsx

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
  Loader2,
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
  updateMenuItem,
} from "@/lib/actions/menu/actions";

// Database menu item interface (with sizes) - matches parent component type
interface DatabaseMenuItem {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_available: boolean;
  is_vegetarian: boolean | null; // Fix: Allow null to match database type
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
  // New callback for category creation
  onCategoryCreate?: (
    tempId: string,
    newCategory: { id: string; name: string }
  ) => void;
  // New callbacks for menu item operations
  onMenuItemAdd?: (categoryId: string, newItem: DatabaseMenuItem) => void;
  onMenuItemUpdate?: (
    categoryId: string,
    updatedItem: DatabaseMenuItem
  ) => void;
  onMenuItemDelete?: (categoryId: string, itemId: string) => void;
}

// Enhanced Menu Item Form Component (handles both add and edit)
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
  editItem?: DatabaseMenuItem; // Optional - if provided, this is edit mode
  isLoading?: boolean; // Loading state for save operation
}

function MenuItemForm({
  isOpen,
  onToggle,
  onDelete,
  onSave,
  editItem,
  isLoading = false,
}: MenuItemFormProps) {
  const isEditMode = !!editItem;

  // Initialize form with existing data if editing
  const [name, setName] = useState(editItem?.name || "");
  const [description, setDescription] = useState(editItem?.description || "");
  const [isVegetarian, setIsVegetarian] = useState(
    editItem?.is_vegetarian ?? false // Handle null with nullish coalescing
  );
  const [hasMultipleSizes, setHasMultipleSizes] = useState(
    editItem?.has_multiple_sizes || false
  );
  const [singlePrice, setSinglePrice] = useState(
    editItem && !editItem.has_multiple_sizes
      ? editItem.sizes?.[0]?.price.toString() || ""
      : ""
  );
  const [sizes, setSizes] = useState<
    Array<{ size_name: string; price: string }>
  >(
    editItem?.has_multiple_sizes && editItem.sizes
      ? editItem.sizes.map((s) => ({
          size_name: s.size_name,
          price: s.price.toString(),
        }))
      : [{ size_name: "", price: "" }]
  );
  const [isSaving, setIsSaving] = useState(false);

  // Image handling
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(
    editItem?.image_url || "/default-food-img.jpg"
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Reset form when editItem changes
  React.useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setDescription(editItem.description || "");
      setIsVegetarian(editItem.is_vegetarian ?? false); // Handle null with nullish coalescing
      setHasMultipleSizes(editItem.has_multiple_sizes);
      setSinglePrice(
        !editItem.has_multiple_sizes
          ? editItem.sizes?.[0]?.price.toString() || ""
          : ""
      );
      setSizes(
        editItem.has_multiple_sizes && editItem.sizes
          ? editItem.sizes.map((s) => ({
              size_name: s.size_name,
              price: s.price.toString(),
            }))
          : [{ size_name: "", price: "" }]
      );
      setImagePreviewUrl(editItem.image_url || "/default-food-img.jpg");
    }
  }, [editItem]);

  React.useEffect(() => {
    if (selectedImageFile) {
      const objectUrl = URL.createObjectURL(selectedImageFile);
      setImagePreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
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
      setSelectedImageFile(file);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      alert("Please enter item name");
      return false;
    }

    if (hasMultipleSizes) {
      const validSizes = sizes.filter(
        (size) => size.size_name.trim() && size.price.trim()
      );
      if (validSizes.length === 0) {
        alert("Please add at least one valid size");
        return false;
      }
    } else {
      if (!singlePrice.trim() || isNaN(parseFloat(singlePrice))) {
        alert("Please enter a valid price");
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      let finalImageUrl = imagePreviewUrl;

      // Upload new image if selected
      if (selectedImageFile) {
        setIsUploadingImage(true);
        const uploadResult = await uploadMenuItemImage(selectedImageFile);
        if (uploadResult.success && uploadResult.url) {
          finalImageUrl = uploadResult.url;
        } else {
          console.error("Image upload failed:", uploadResult.error);
          alert(
            "Image upload failed, but item will be saved with current image"
          );
        }
        setIsUploadingImage(false);
      }

      // Prepare sizes data
      const sizesData = hasMultipleSizes
        ? sizes
            .filter((size) => size.size_name.trim() && size.price.trim())
            .map((size) => ({
              size_name: size.size_name.trim(),
              price: parseFloat(size.price),
            }))
        : [
            {
              size_name: "Regular",
              price: parseFloat(singlePrice),
            },
          ];

      const itemData = {
        name: name.trim(),
        description: description.trim(),
        is_vegetarian: isVegetarian,
        has_multiple_sizes: hasMultipleSizes,
        sizes: sizesData,
        image_url: finalImageUrl,
      };

      onSave(itemData);
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Error saving item");
    } finally {
      setIsSaving(false);
      setIsUploadingImage(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="border bg-background">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">
            {isEditMode ? "Edit Menu Item" : "Add New Menu Item"}
          </h4>
          <Button variant="ghost" size="icon" onClick={() => onToggle(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Item Name */}
        <div>
          <label className="text-sm font-medium">Item Name</label>
          <Input
            placeholder="Enter item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading || isSaving || isUploadingImage}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            placeholder="Enter item description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading || isSaving || isUploadingImage}
            rows={2}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="text-sm font-medium">Item Image</label>
          <div className="flex items-center gap-4 mt-2">
            <div className="relative w-20 h-20 rounded-md border overflow-hidden">
              <Image
                src={imagePreviewUrl}
                alt="Item preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 cursor-pointer"
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4" />
                    {selectedImageFile ? "Change Image" : "Upload Image"}
                  </span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Upload an image for this item
              </p>
            </div>
          </div>
        </div>

        {/* Vegetarian Option */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="vegetarian"
            checked={isVegetarian}
            onCheckedChange={(checked) => setIsVegetarian(checked as boolean)}
            disabled={isLoading || isSaving || isUploadingImage}
          />
          <label htmlFor="vegetarian" className="text-sm font-medium">
            Vegetarian Item
          </label>
        </div>

        {/* Pricing Type */}
        <div>
          <label className="text-sm font-medium">Pricing</label>
          <div className="flex gap-4 mt-2">
            <Button
              variant={!hasMultipleSizes ? "default" : "outline"}
              size="sm"
              onClick={() => setHasMultipleSizes(false)}
              disabled={isLoading || isSaving || isUploadingImage}
            >
              Single Price
            </Button>
            <Button
              variant={hasMultipleSizes ? "default" : "outline"}
              size="sm"
              onClick={() => setHasMultipleSizes(true)}
              disabled={isLoading || isSaving || isUploadingImage}
            >
              Multiple Sizes
            </Button>
          </div>
        </div>

        {/* Pricing Input */}
        {hasMultipleSizes ? (
          <div className="space-y-3">
            <label className="text-sm font-medium">Size & Price Options</label>
            {sizes.map((size, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Size name (e.g., Small, Medium)"
                  value={size.size_name}
                  onChange={(e) =>
                    updateSize(index, "size_name", e.target.value)
                  }
                  className="flex-1"
                  disabled={isLoading || isSaving || isUploadingImage}
                />
                <Input
                  placeholder="Price"
                  type="number"
                  value={size.price}
                  onChange={(e) => updateSize(index, "price", e.target.value)}
                  className="w-24"
                  disabled={isLoading || isSaving || isUploadingImage}
                />
                {sizes.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeSize(index)}
                    disabled={isLoading || isSaving || isUploadingImage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addSize}
              disabled={isLoading || isSaving || isUploadingImage}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Size
            </Button>
          </div>
        ) : (
          <div>
            <label className="text-sm font-medium">Price (Nu.)</label>
            <Input
              placeholder="Enter price"
              type="number"
              value={singlePrice}
              onChange={(e) => setSinglePrice(e.target.value)}
              disabled={isLoading || isSaving || isUploadingImage}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onDelete}
            disabled={isLoading || isSaving || isUploadingImage}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || isSaving || isUploadingImage}
          >
            {isUploadingImage
              ? "Uploading..."
              : isLoading || isSaving
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
              ? "Update Item"
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
  onCategoryCreate,
  onMenuItemAdd,
  onMenuItemUpdate,
  onMenuItemDelete,
}: CategoryCardProps) {
  const [isEditingLocal, setIsEditingLocal] = useState(isEditing);
  const [editedTitle, setEditedTitle] = useState(title);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<DatabaseMenuItem | null>(null);

  // Loading states for menu item operations
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [isUpdatingItem, setIsUpdatingItem] = useState(false);
  const [isDeletingItem, setIsDeletingItem] = useState<string | null>(null); // Store the ID of item being deleted

  // Loading state for category creation
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

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
      setIsCreatingItem(true);
      console.log("💾 Creating new menu item:", itemData);

      const result = await createMenuItem({
        category_id: id,
        name: itemData.name,
        description: itemData.description,
        image_url: itemData.image_url,
        is_vegetarian: itemData.is_vegetarian,
        is_custom: true,
        has_multiple_sizes: itemData.has_multiple_sizes,
        sizes: itemData.sizes,
      });

      if (result.success && result.item) {
        console.log("✅ Menu item created successfully");
        setShowNewItemForm(false);

        // Use callback to update parent state instead of page refresh
        if (onMenuItemAdd) {
          onMenuItemAdd(id, result.item);
        }
      } else {
        console.error("❌ Failed to save menu item:", result.error);
        alert("Failed to save menu item: " + result.error);
      }
    } catch (error) {
      console.error("❌ Error saving menu item:", error);
      alert("Error saving menu item");
    } finally {
      setIsCreatingItem(false);
    }
  };

  const handleSaveEditItem = async (itemData: {
    name: string;
    description: string;
    is_vegetarian: boolean;
    has_multiple_sizes: boolean;
    sizes: Array<{ size_name: string; price: number }>;
    image_url: string;
  }) => {
    if (!editingItem) return;

    try {
      setIsUpdatingItem(true);
      console.log("💾 Updating menu item:", editingItem.id, itemData);

      const result = await updateMenuItem(editingItem.id, {
        name: itemData.name,
        description: itemData.description,
        image_url: itemData.image_url,
        is_available: editingItem.is_available, // Keep current availability
        is_vegetarian: itemData.is_vegetarian,
        has_multiple_sizes: itemData.has_multiple_sizes,
        sizes: itemData.sizes,
      });

      if (result.success && result.item) {
        console.log("✅ Menu item updated successfully");
        setEditingItem(null);

        // Use callback to update parent state instead of page refresh
        if (onMenuItemUpdate) {
          onMenuItemUpdate(id, result.item);
        }
      } else {
        console.error("❌ Failed to update menu item:", result.error);
        alert("Failed to update menu item: " + result.error);
      }
    } catch (error) {
      console.error("❌ Error updating menu item:", error);
      alert("Error updating menu item");
    } finally {
      setIsUpdatingItem(false);
    }
  };

  const handleDeleteExistingItem = async (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        setIsDeletingItem(itemId);
        const result = await deleteMenuItem(itemId);
        if (result.success) {
          console.log("✅ Menu item deleted successfully");

          // Use callback to update parent state instead of page refresh
          if (onMenuItemDelete) {
            onMenuItemDelete(id, itemId);
          }
        } else {
          alert("Failed to delete menu item");
        }
      } catch (error) {
        console.error("Error deleting menu item:", error);
        alert("Error deleting menu item");
      } finally {
        setIsDeletingItem(null);
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

      const isTemporaryCategory = id.startsWith("temp-");

      if (isTemporaryCategory) {
        console.log("🆕 Creating new category in database");
        try {
          setIsCreatingCategory(true);
          const result = await createMenuCategory({
            name: editedTitle.trim(),
          });
          if (result.success && result.category) {
            console.log("✅ Category created successfully:", result.category);
            setIsEditingLocal(false);

            // Use callback to update parent state instead of page refresh
            if (onCategoryCreate) {
              onCategoryCreate(id, result.category);
            }
          } else {
            console.error("❌ Failed to create category:", result.error);
            alert("Failed to create category");
          }
        } catch (error) {
          console.error("❌ Error creating category:", error);
          alert("Error creating category");
        } finally {
          setIsCreatingCategory(false);
        }
      } else if (onSave) {
        console.log("📝 Updating existing category via onSave callback");
        onSave(id, editedTitle.trim());
        setIsEditingLocal(false);
      } else {
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
    return (
      existingItems.length + (showNewItemForm ? 1 : 0) + (editingItem ? 1 : 0)
    );
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
            disabled={isCreatingCategory}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="border-primary text-primary"
              size="sm"
              onClick={handleCancelEdit}
              disabled={isCreatingCategory}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-white"
              size="sm"
              onClick={handleSaveEdit}
              disabled={!editedTitle.trim() || isCreatingCategory}
            >
              {isCreatingCategory ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Save"
              )}
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
        <CardContent className="px-4 pb-4 space-y-3">
          {/* Existing Items */}
          {existingItems.map((item) => (
            <Card key={item.id} className="border">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {/* Item Image */}
                  <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image_url || "/default-food-img.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium truncate">
                        {item.name}
                      </h4>
                      {item.is_vegetarian === true && ( // Explicitly check for true
                        <Badge variant="outline" className="text-xs">
                          Veg
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </p>
                    )}
                    <div className="text-sm font-medium text-primary">
                      {formatItemPrice(item)}
                    </div>
                    {item.has_multiple_sizes && item.sizes && (
                      <div className="text-xs text-muted-foreground">
                        {item.sizes
                          .map((s) => `${s.size_name}: Nu.${s.price}`)
                          .join(", ")}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingItem(item)}
                      disabled={isDeletingItem === item.id}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExistingItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={isDeletingItem === item.id}
                    >
                      {isDeletingItem === item.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Edit Item Form */}
          {editingItem && (
            <MenuItemForm
              isOpen={!!editingItem}
              onToggle={(isOpen) => !isOpen && setEditingItem(null)}
              onDelete={() => setEditingItem(null)}
              onSave={handleSaveEditItem}
              editItem={editingItem}
              isLoading={isUpdatingItem}
            />
          )}

          {/* New Item Form */}
          {showNewItemForm && (
            <MenuItemForm
              isOpen={showNewItemForm}
              onToggle={setShowNewItemForm}
              onDelete={() => setShowNewItemForm(false)}
              onSave={handleSaveNewItem}
              isLoading={isCreatingItem}
            />
          )}

          {/* Add Item Button */}
          <Button
            variant="outline"
            className="w-full border-dashed border-primary text-primary hover:bg-primary/5"
            onClick={() => setShowNewItemForm(true)}
            disabled={
              showNewItemForm ||
              !!editingItem ||
              isCreatingItem ||
              isUpdatingItem ||
              !!isDeletingItem
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item to {title}
          </Button>

          {/* Empty State */}
          {existingItems.length === 0 && !showNewItemForm && !editingItem && (
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
