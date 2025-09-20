"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/shadcn-button";
import Image from "next/image";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type CategoryTemplate } from "@/lib/data/menu-templates";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  Upload,
  Loader2,
} from "lucide-react";
import { uploadMenuItemImage } from "@/lib/actions/menu/actions";

interface SelectedCategory {
  template: CategoryTemplate;
  selectedItems: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
    isCustom?: boolean;
    image?: string;
    isVegetarian?: boolean; // Add vegetarian status
  }>;
}

interface ItemTemplateSelectorProps {
  selectedCategories: SelectedCategory[];
  onItemSelection: (
    categoryId: string,
    items: SelectedCategory["selectedItems"]
  ) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ItemTemplateSelector({
  selectedCategories,
  onItemSelection,
  onNext,
  onBack,
}: ItemTemplateSelectorProps) {
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>(
    selectedCategories.map((cat) => cat.template.id)
  );
  const [customItems, setCustomItems] = React.useState<
    Record<
      string,
      {
        name: string;
        description: string;
        price: string;
        isVegetarian?: boolean;
      }
    >
  >({});
  const [customItemImages, setCustomItemImages] = React.useState<
    Record<string, File | null>
  >({});
  const [addingCustomItem, setAddingCustomItem] = React.useState<string | null>(
    null
  ); // Track which category is being added
  const [expandedCustomForms, setExpandedCustomForms] = React.useState<
    string[]
  >([]); // Track which custom forms are expanded

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleCustomForm = (categoryId: string) => {
    setExpandedCustomForms((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleItemToggle = async (
    categoryId: string,
    item: any,
    isTemplate: boolean = true
  ) => {
    const category = selectedCategories.find(
      (cat) => cat.template.id === categoryId
    );
    if (!category) return;

    const itemId = isTemplate ? `${categoryId}-${item.name}` : item.id;
    const existingItems = category.selectedItems;
    const isSelected = existingItems.some(
      (selectedItem) => selectedItem.id === itemId
    );

    let newItems;
    if (isSelected) {
      // Remove item
      newItems = existingItems.filter(
        (selectedItem) => selectedItem.id !== itemId
      );
    } else {
      // Add item
      let imageUrl = item.image || "/default-food-img.jpg";

      // If it's not already a GitHub URL and not the default image
      if (
        imageUrl !== "/default-food-img.jpg" &&
        !imageUrl.startsWith("https://raw.githubusercontent.com/")
      ) {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], `${item.name}-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });

          const uploadResult = await uploadMenuItemImage(file);
          if (uploadResult.success && uploadResult.url) {
            imageUrl = uploadResult.url;
          } else {
            console.error(
              "Failed to upload template item image:",
              uploadResult.error
            );
            imageUrl = "/default-food-img.jpg";
          }
        } catch (error) {
          console.error("Error processing template item image:", error);
          imageUrl = "/default-food-img.jpg";
        }
      }

      const newItem = {
        id: itemId,
        name: item.name,
        description: item.description,
        price: isTemplate ? item.defaultPrice : item.price,
        isCustom: !isTemplate,
        image: imageUrl,
        isVegetarian: item.isVegetarian, // Include vegetarian status from item
      };
      newItems = [...existingItems, newItem];
    }

    onItemSelection(categoryId, newItems);
  };

  const handleSelectAllForCategory = (categoryId: string) => {
    const category = selectedCategories.find(
      (cat) => cat.template.id === categoryId
    );
    if (!category) return;

    const allSelected =
      category.template.items.length ===
      category.selectedItems.filter((item) => !item.isCustom).length;

    if (allSelected) {
      // Unselect all template items, keep custom items
      const customItems = category.selectedItems.filter(
        (item) => item.isCustom
      );
      onItemSelection(categoryId, customItems);
    } else {
      // Select all template items
      const templateItems = category.template.items.map((item) => ({
        id: `${categoryId}-${item.name}`,
        name: item.name,
        description: item.description,
        price: item.defaultPrice,
        isCustom: false,
        isVegetarian: item.isVegetarian, // Include vegetarian status from template
      }));
      const customItems = category.selectedItems.filter(
        (item) => item.isCustom
      );
      onItemSelection(categoryId, [...templateItems, ...customItems]);
    }
  };

  const handleAddCustomItem = async (categoryId: string) => {
    const customItem = customItems[categoryId];
    if (!customItem?.name.trim()) return;

    try {
      setAddingCustomItem(categoryId); // Start loading

      let imageUrl = "/default-food-img.jpg";
      const imageFile = customItemImages[categoryId];

      if (imageFile) {
        // Upload image to GitHub
        const uploadResult = await uploadMenuItemImage(imageFile);
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
        } else {
          console.error("Failed to upload image:", uploadResult.error);
          // Still continue with default image
        }
      }

      const newItem = {
        id: `custom-${categoryId}-${Date.now()}`,
        name: customItem.name,
        description: customItem.description,
        price: customItem.price || "0",
        isCustom: true,
        image: imageUrl,
        isVegetarian: customItem.isVegetarian, // Include vegetarian status for custom items
      };

      const category = selectedCategories.find(
        (cat) => cat.template.id === categoryId
      );
      if (category) {
        onItemSelection(categoryId, [...category.selectedItems, newItem]);
      }

      // Clear the custom item form and image
      setCustomItems((prev) => ({
        ...prev,
        [categoryId]: {
          name: "",
          description: "",
          price: "",
          isVegetarian: undefined,
        },
      }));
      setCustomItemImages((prev) => ({
        ...prev,
        [categoryId]: null,
      }));

      // Close the accordion after successful addition
      setExpandedCustomForms((prev) => prev.filter((id) => id !== categoryId));
    } catch (error) {
      console.error("Error adding custom item:", error);
      // Handle error gracefully - maybe show a toast notification
    } finally {
      setAddingCustomItem(null); // Stop loading
    }
  };

  const handleCustomItemImageChange = (
    categoryId: string,
    file: File | null
  ) => {
    setCustomItemImages((prev) => ({
      ...prev,
      [categoryId]: file,
    }));
  };

  const updateCustomItem = (
    categoryId: string,
    field: string,
    value: string | boolean | undefined
  ) => {
    setCustomItems((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [field]: value,
      },
    }));
  };

  const totalSelectedItems = selectedCategories.reduce(
    (sum, cat) => sum + cat.selectedItems.length,
    0
  );
  const canProceed = totalSelectedItems > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Select Menu Items</h2>
          <p className="text-muted-foreground">
            Choose items for each category and add custom ones if needed
          </p>
        </div>
        {totalSelectedItems > 0 && (
          <Badge variant="secondary" className="px-3 py-1">
            {totalSelectedItems} items selected
          </Badge>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {selectedCategories.map((category) => {
          const isExpanded = expandedCategories.includes(category.template.id);
          const IconComponent = category.template.icon;
          const templateItemsSelected = category.selectedItems.filter(
            (item) => !item.isCustom
          ).length;
          const customItemsSelected = category.selectedItems.filter(
            (item) => item.isCustom
          ).length;
          const allTemplateItemsSelected =
            templateItemsSelected === category.template.items.length;

          return (
            <Card key={category.template.id}>
              <Collapsible
                open={isExpanded}
                onOpenChange={() => toggleCategory(category.template.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {category.template.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {templateItemsSelected}/
                            {category.template.items.length} template items
                            {customItemsSelected > 0 &&
                              ` + ${customItemsSelected} custom`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {category.selectedItems.length > 0 && (
                          <Badge className="bg-green-100 text-green-800">
                            {category.selectedItems.length} selected
                          </Badge>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {/* Select All Button */}
                    <div className="mb-4 flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleSelectAllForCategory(category.template.id)
                        }
                      >
                        {allTemplateItemsSelected ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Unselect All Templates
                          </>
                        ) : (
                          "Select All Templates"
                        )}
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {category.template.items.length} template items
                        available
                      </span>
                    </div>

                    {/* Template Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {category.template.items.map((item) => {
                        const itemId = `${category.template.id}-${item.name}`;
                        const isSelected = category.selectedItems.some(
                          (selectedItem) => selectedItem.id === itemId
                        );

                        return (
                          <div
                            key={item.name}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() =>
                              handleItemToggle(category.template.id, item)
                            }
                          >
                            <div className="flex items-start gap-3">
                              <Image
                                src={item.image || "/default-food-img.jpg"}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="rounded-md object-cover flex-shrink-0"
                              />
                              <div className="flex-1">
                                <div className="flex items-start gap-2">
                                  <Checkbox
                                    checked={isSelected}
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <p className="font-medium text-sm">
                                          {item.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                          {item.description}
                                        </p>
                                      </div>
                                      {item.isVegetarian !== undefined && (
                                        <div
                                          className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center bg-white ml-2 mt-0.5 flex-shrink-0 ${
                                            item.isVegetarian
                                              ? "border-green-600"
                                              : "border-red-600"
                                          }`}
                                          title={
                                            item.isVegetarian
                                              ? "Vegetarian"
                                              : "Non-Vegetarian"
                                          }
                                        >
                                          <div
                                            className={`w-2 h-2 rounded-full ${
                                              item.isVegetarian
                                                ? "bg-green-600"
                                                : "bg-red-600"
                                            }`}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-sm font-medium">
                                <span className="text-xs font-medium">Nu.</span>
                                {item.defaultPrice}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Custom Items Section */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Custom Item
                      </h4>

                      {/* Custom Items List */}
                      {category.selectedItems
                        .filter((item) => item.isCustom)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="border rounded-lg p-3 mb-2 bg-blue-50"
                          >
                            <div className="flex items-center gap-3">
                              <Image
                                src={item.image || "/default-food-img.jpg"}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="rounded-md object-cover flex-shrink-0"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm">
                                    {item.name}
                                  </p>
                                  {item.isVegetarian !== undefined && (
                                    <div
                                      className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center bg-white flex-shrink-0 ${
                                        item.isVegetarian
                                          ? "border-green-600"
                                          : "border-red-600"
                                      }`}
                                      title={
                                        item.isVegetarian
                                          ? "Vegetarian"
                                          : "Non-Vegetarian"
                                      }
                                    >
                                      <div
                                        className={`w-2 h-2 rounded-full ${
                                          item.isVegetarian
                                            ? "bg-green-600"
                                            : "bg-red-600"
                                        }`}
                                      />
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  Nu. {item.price}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  Custom
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* Add Custom Item Accordion */}
                      <div className="border border-gray-200 rounded-lg">
                        {/* Accordion Header */}
                        <button
                          onClick={() => toggleCustomForm(category.template.id)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-sm">
                              Add Custom Item
                            </span>
                          </div>
                          {expandedCustomForms.includes(
                            category.template.id
                          ) ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </button>

                        {/* Accordion Content */}
                        {expandedCustomForms.includes(category.template.id) && (
                          <div className="p-4 bg-blue-50/50 space-y-4 rounded-b-lg">
                            {/* Row 1: Image Upload */}
                            <div className="flex justify-center">
                              <div className="relative">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleCustomItemImageChange(
                                      category.template.id,
                                      e.target.files?.[0] || null
                                    )
                                  }
                                  className="hidden"
                                  id={`custom-image-${category.template.id}`}
                                />
                                <label
                                  htmlFor={`custom-image-${category.template.id}`}
                                  className="block w-24 h-24 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors relative overflow-hidden bg-white"
                                >
                                  {customItemImages[category.template.id] ? (
                                    <Image
                                      src={URL.createObjectURL(
                                        customItemImages[category.template.id]!
                                      )}
                                      alt="Custom item"
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-blue-400">
                                      <Upload className="h-6 w-6 mb-1" />
                                      <span className="text-xs">Upload</span>
                                    </div>
                                  )}
                                </label>
                              </div>
                            </div>

                            {/* Row 2: Name and Description */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Item Name
                                </label>
                                <Input
                                  placeholder="Enter item name"
                                  value={
                                    customItems[category.template.id]?.name ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateCustomItem(
                                      category.template.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Description
                                </label>
                                <Input
                                  placeholder="Enter description"
                                  value={
                                    customItems[category.template.id]
                                      ?.description || ""
                                  }
                                  onChange={(e) =>
                                    updateCustomItem(
                                      category.template.id,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>

                            {/* Row 3: Dietary Status and Price */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Dietary Status
                                </label>
                                <Select
                                  value={
                                    customItems[category.template.id]
                                      ?.isVegetarian === undefined
                                      ? "none"
                                      : customItems[category.template.id]
                                          ?.isVegetarian
                                      ? "veg"
                                      : "non-veg"
                                  }
                                  onValueChange={(value) => {
                                    let vegStatus: boolean | undefined;
                                    if (value === "veg") vegStatus = true;
                                    else if (value === "non-veg")
                                      vegStatus = false;
                                    else vegStatus = undefined;

                                    updateCustomItem(
                                      category.template.id,
                                      "isVegetarian",
                                      vegStatus
                                    );
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select dietary status" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    <SelectItem value="none">
                                      No preference
                                    </SelectItem>
                                    <SelectItem value="veg">
                                      Vegetarian
                                    </SelectItem>
                                    <SelectItem value="non-veg">
                                      Non-Vegetarian
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Price (Nu.)
                                </label>
                                <Input
                                  placeholder="Enter price"
                                  type="number"
                                  value={
                                    customItems[category.template.id]?.price ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateCustomItem(
                                      category.template.id,
                                      "price",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>

                            {/* Row 4: Add Button */}
                            <div className="flex justify-center pt-2">
                              <Button
                                onClick={() =>
                                  handleAddCustomItem(category.template.id)
                                }
                                disabled={
                                  !customItems[
                                    category.template.id
                                  ]?.name?.trim() ||
                                  addingCustomItem === category.template.id
                                }
                                className="px-6"
                              >
                                {addingCustomItem === category.template.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Adding...
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Custom Item
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-4">
          {!canProceed && (
            <p className="text-sm text-muted-foreground">
              Select at least one item to continue
            </p>
          )}
          <Button onClick={onNext} disabled={!canProceed} className="gap-2">
            Next: Review Menu
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
