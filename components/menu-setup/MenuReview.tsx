"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/shadcn-button";
import { Textarea } from "@/components/ui/textarea";
import { type CategoryTemplate } from "@/lib/data/menu-templates";
import {
  ArrowLeft,
  Check,
  Edit3,
  Save,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";

// Consistent interface definition matching your other components
interface SelectedCategory {
  template: CategoryTemplate;
  selectedItems: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
    isCustom?: boolean;
    image?: string;
  }>;
}

interface MenuReviewProps {
  selectedCategories: SelectedCategory[];
  onBack: () => void;
  onFinish: () => void;
  onUpdateCategory: (
    categoryId: string,
    updatedCategory: SelectedCategory
  ) => void; // Add this
}

export default function MenuReview({
  selectedCategories,
  onBack,
  onFinish,
  onUpdateCategory,
}: MenuReviewProps) {
  const [editingItem, setEditingItem] = React.useState<{
    categoryId: string;
    itemId: string;
    name: string;
    description: string;
    price: string;
    image: string;
  } | null>(null);
  const [editingItemImage, setEditingItemImage] = React.useState<File | null>(
    null
  );

  const totalItems = selectedCategories.reduce(
    (sum, cat) => sum + cat.selectedItems.length,
    0
  );
  const totalCategories = selectedCategories.filter(
    (cat) => cat.selectedItems.length > 0
  ).length;

  // Helper function to get item image with proper typing
  const getItemImage = (
    item: SelectedCategory["selectedItems"][0],
    category: SelectedCategory
  ): string => {
    // For custom items, use their image or default
    if (item.isCustom) {
      return item.image || "/default-food-img.jpg";
    }

    // For template items, find the image from the template
    const templateItem = category.template.items.find(
      (templateItem) => templateItem.name === item.name
    );
    return templateItem?.image || "/default-food-img.jpg";
  };

  const handleEditItem = (
    category: SelectedCategory,
    item: SelectedCategory["selectedItems"][0]
  ) => {
    const currentImage = getItemImage(item, category);

    setEditingItem({
      categoryId: category.template.id,
      itemId: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: currentImage,
    });
    setEditingItemImage(null);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      // Find the category and update the item
      const categoryToUpdate = selectedCategories.find(
        (cat) => cat.template.id === editingItem.categoryId
      );

      if (categoryToUpdate) {
        const updatedItems = categoryToUpdate.selectedItems.map((item) =>
          item.id === editingItem.itemId
            ? {
                ...item,
                name: editingItem.name,
                description: editingItem.description,
                price: editingItem.price,
                image: editingItemImage
                  ? URL.createObjectURL(editingItemImage)
                  : editingItem.image,
              }
            : item
        );

        const updatedCategory = {
          ...categoryToUpdate,
          selectedItems: updatedItems,
        };

        onUpdateCategory(editingItem.categoryId, updatedCategory);
      }
    }
    setEditingItem(null);
    setEditingItemImage(null);
  };

  const handleFinishSetup = () => {
    // Here you would typically save all the menu data to your backend
    console.log("Saving menu data:", selectedCategories);
    onFinish();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Review Your Menu</h2>
        <p className="text-muted-foreground">
          Review and customize your menu items before finalizing
        </p>

        {/* Summary Stats */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{totalCategories}</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{totalItems}</p>
            <p className="text-sm text-muted-foreground">Menu Items</p>
          </div>
        </div>
      </div>

      {/* Menu Preview */}
      <div className="space-y-6">
        {selectedCategories
          .filter((category) => category.selectedItems.length > 0)
          .map((category) => {
            const IconComponent = category.template.icon;

            return (
              <Card key={category.template.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {category.template.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {category.selectedItems.length} items
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-4">
                    {category.selectedItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <span className="text-sm text-muted-foreground min-w-[2rem]">
                            {index + 1}.
                          </span>
                          <Image
                            src={getItemImage(item, category)}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="rounded-md object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{item.name}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 font-medium">
                            <span className="text-sm font-medium">Nu.</span>
                            {item.price}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditItem(category, item)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Success Message */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-green-900">
                Menu Setup Complete!
              </h3>
              <p className="text-sm text-green-700">
                Your menu is ready to go live. You can always add more items or
                make changes later.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Items
        </Button>

        <Button
          onClick={handleFinishSetup}
          className="gap-2 bg-green-600 hover:bg-green-700"
          size="lg"
        >
          <Check className="h-4 w-4" />
          Finish Setup
        </Button>
      </div>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>

          {editingItem && (
            <div className="space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Item Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    <Image
                      src={
                        editingItemImage
                          ? URL.createObjectURL(editingItemImage)
                          : editingItem.image
                      }
                      alt={editingItem.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditingItemImage(e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="edit-item-image"
                    />
                    <label
                      htmlFor="edit-item-image"
                      className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      Change Image
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload JPG, PNG or GIF (max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Item Name
                </label>
                <Input
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description
                </label>
                <Textarea
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                  placeholder="Enter item description"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Price (Nu.)
                </label>
                <Input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) =>
                    setEditingItem((prev) =>
                      prev ? { ...prev, price: e.target.value } : null
                    )
                  }
                  placeholder="Enter price"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingItem(null);
                    setEditingItemImage(null);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
