"use client";

import CategoryTemplateSelector from "@/components/menu-setup/CategoryTemplateSelector";
import ItemTemplateSelector from "@/components/menu-setup/ItemTemplateSelector";
import MenuReview from "@/components/menu-setup/MenuReview";
import CategoryCard from "@/components/menu-setup/categoryCard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/shadcn-button";
import {
  CATEGORY_TEMPLATES,
  type CategoryTemplate,
} from "@/lib/data/menu-templates";
import { Plus } from "lucide-react";
import * as React from "react";

// Consistent interface definition matching all components
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

export default function MenuSetupPage() {
  const [currentStep, setCurrentStep] = React.useState<
    "template" | "items" | "review" | "manage"
  >("template");
  const [selectedCategories, setSelectedCategories] = React.useState<
    SelectedCategory[]
  >([]);
  const [isQuickSetup, setIsQuickSetup] = React.useState(true);

  // For manual category management
  const [manualCategories, setManualCategories] = React.useState<
    Array<{
      id: string;
      title: string;
      isOpen: boolean;
      isEditing?: boolean;
    }>
  >([]);

  const progress = React.useMemo(() => {
    switch (currentStep) {
      case "template":
        return 25;
      case "items":
        return 50;
      case "review":
        return 75;
      case "manage":
        return 100;
      default:
        return 0;
    }
  }, [currentStep]);

  const handleCategorySelection = (categories: typeof CATEGORY_TEMPLATES) => {
    const newSelectedCategories: SelectedCategory[] = categories.map(
      (template) => ({
        template,
        selectedItems: [], // Will be filled in next step
      })
    );
    setSelectedCategories(newSelectedCategories);
    setCurrentStep("items");
  };

  const handleItemSelection = (
    categoryId: string,
    items: SelectedCategory["selectedItems"]
  ) => {
    setSelectedCategories((prev) =>
      prev.map((cat) =>
        cat.template.id === categoryId ? { ...cat, selectedItems: items } : cat
      )
    );
  };
  const handleUpdateCategory = (
    categoryId: string,
    updatedCategory: SelectedCategory
  ) => {
    setSelectedCategories((prev) =>
      prev.map((cat) =>
        cat.template.id === categoryId ? updatedCategory : cat
      )
    );
  };

  const handleSaveCategory = (categoryId: string, newTitle: string) => {
    setManualCategories((categories) =>
      categories.map((category) =>
        category.id === categoryId
          ? { ...category, title: newTitle, isEditing: false }
          : category
      )
    );
  };

  const handleFinishSetup = () => {
    // Convert selected categories to the format expected by manual management
    const convertedCategories = selectedCategories
      .filter((cat) => cat.selectedItems.length > 0)
      .map((cat) => ({
        id: `category-${Date.now()}-${Math.random()}`,
        title: cat.template.name,
        isOpen: false,
      }));

    setManualCategories(convertedCategories);
    setCurrentStep("manage");
    setIsQuickSetup(false);
  };

  const handleAddManualCategory = () => {
    const newCategory = {
      id: `category-${Date.now()}`,
      title: "",
      isOpen: true,
      isEditing: true,
    };
    setManualCategories((prev) => [...prev, newCategory]);
  };

  const handleCategoryOpenChange = (categoryId: string, isOpen: boolean) => {
    setManualCategories((categories) =>
      categories.map((category) =>
        category.id === categoryId ? { ...category, isOpen } : category
      )
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    setManualCategories((categories) =>
      categories.filter((category) => category.id !== categoryId)
    );
  };

  const startQuickSetup = () => {
    setIsQuickSetup(true);
    setCurrentStep("template");
    setSelectedCategories([]);
  };

  if (!isQuickSetup) {
    // Manual category management view
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Menu Management</h1>
            <p className="text-muted-foreground">
              Manage your menu categories and items
            </p>
          </div>
          <Button onClick={startQuickSetup} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Quick Setup
          </Button>
        </div>

        <div className="space-y-4">
          {manualCategories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              title={category.title}
              isOpen={category.isOpen}
              isEditing={category.isEditing}
              onOpenChange={(isOpen) =>
                handleCategoryOpenChange(category.id, isOpen)
              }
              onDelete={() => handleDeleteCategory(category.id)}
              onSave={handleSaveCategory}
            />
          ))}

          <Button
            variant="outline"
            className="w-full border-primary text-primary"
            onClick={handleAddManualCategory}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Category
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Quick Menu Setup</h1>
        <p className="text-muted-foreground">
          Set up your menu in minutes using our templates
        </p>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span
              className={
                currentStep === "template" ? "text-primary font-medium" : ""
              }
            >
              Choose Categories
            </span>
            <span
              className={
                currentStep === "items" ? "text-primary font-medium" : ""
              }
            >
              Select Items
            </span>
            <span
              className={
                currentStep === "review" ? "text-primary font-medium" : ""
              }
            >
              Review & Customize
            </span>
            <span
              className={
                currentStep === "manage" ? "text-primary font-medium" : ""
              }
            >
              Manage Menu
            </span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {currentStep === "template" && (
          <CategoryTemplateSelector
            templates={CATEGORY_TEMPLATES}
            onNext={handleCategorySelection}
          />
        )}

        {currentStep === "items" && (
          <ItemTemplateSelector
            selectedCategories={selectedCategories}
            onItemSelection={handleItemSelection}
            onNext={() => setCurrentStep("review")}
            onBack={() => setCurrentStep("template")}
          />
        )}

        {currentStep === "review" && (
          <MenuReview
            selectedCategories={selectedCategories}
            onBack={() => setCurrentStep("items")}
            onFinish={handleFinishSetup}
            onUpdateCategory={handleUpdateCategory}
          />
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-8 pt-6 border-t flex justify-center">
        <Button
          variant="ghost"
          onClick={() => {
            setIsQuickSetup(false);
            setCurrentStep("manage");
          }}
        >
          Skip and manage manually
        </Button>
      </div>
    </div>
  );
}
