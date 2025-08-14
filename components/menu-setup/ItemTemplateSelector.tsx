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
import { type CategoryTemplate } from "@/lib/data/menu-templates";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  Upload,
} from "lucide-react";

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
    Record<string, { name: string; description: string; price: string }>
  >({});
  const [customItemImages, setCustomItemImages] = React.useState<
    Record<string, File | null>
  >({});

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleItemToggle = (
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
      const newItem = {
        id: itemId,
        name: item.name,
        description: item.description,
        price: isTemplate ? item.defaultPrice : item.price,
        isCustom: !isTemplate,
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
      }));
      const customItems = category.selectedItems.filter(
        (item) => item.isCustom
      );
      onItemSelection(categoryId, [...templateItems, ...customItems]);
    }
  };

  const handleAddCustomItem = (categoryId: string) => {
    const customItem = customItems[categoryId];
    if (!customItem?.name.trim()) return;

    // Create image URL for the custom item
    let imageUrl = "/default-food-img.jpg";
    const imageFile = customItemImages[categoryId];
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    }

    const newItem = {
      id: `custom-${categoryId}-${Date.now()}`,
      name: customItem.name,
      description: customItem.description,
      price: customItem.price || "0",
      isCustom: true,
      image: imageUrl,
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
      [categoryId]: { name: "", description: "", price: "" },
    }));
    setCustomItemImages((prev) => ({
      ...prev,
      [categoryId]: null,
    }));
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
    value: string
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
                                    <p className="font-medium text-sm">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {item.description}
                                    </p>
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
                                src="/default-food-img.jpg"
                                alt={item.name}
                                width={40}
                                height={40}
                                className="rounded-md object-cover flex-shrink-0"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {item.name}
                                </p>
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

                      {/* Add Custom Item Form */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* Image Upload */}
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
                            className="block w-full h-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors relative overflow-hidden"
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
                              <div className="flex items-center justify-center h-full">
                                <Upload className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                          </label>
                        </div>

                        {/* Name Input */}
                        <Input
                          placeholder="Item name"
                          value={customItems[category.template.id]?.name || ""}
                          onChange={(e) =>
                            updateCustomItem(
                              category.template.id,
                              "name",
                              e.target.value
                            )
                          }
                        />

                        {/* Description Input */}
                        <Input
                          placeholder="Description"
                          value={
                            customItems[category.template.id]?.description || ""
                          }
                          onChange={(e) =>
                            updateCustomItem(
                              category.template.id,
                              "description",
                              e.target.value
                            )
                          }
                        />

                        {/* Price and Add Button */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Price"
                            type="number"
                            value={
                              customItems[category.template.id]?.price || ""
                            }
                            onChange={(e) =>
                              updateCustomItem(
                                category.template.id,
                                "price",
                                e.target.value
                              )
                            }
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              handleAddCustomItem(category.template.id)
                            }
                            disabled={
                              !customItems[category.template.id]?.name?.trim()
                            }
                          >
                            Add
                          </Button>
                        </div>
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
