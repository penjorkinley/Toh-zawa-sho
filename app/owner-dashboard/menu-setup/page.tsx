// app/owner-dashboard/menu-setup/page.tsx (Updated Integration)
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
import { Plus, Loader2 } from "lucide-react";
import * as React from "react";
import {
  checkMenuSetupStatus,
  completeMenuSetup,
  getCompleteMenu,
  deleteMenuCategory,
  updateMenuCategory,
} from "@/lib/actions/menu/actions";
import { MenuSetupData } from "@/lib/types/menu-management";
import { useRouter } from "next/navigation";

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
    isVegetarian?: boolean; // Add vegetarian status
  }>;
}

export default function MenuSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState<
    "template" | "items" | "review" | "manage"
  >("template");
  const [selectedCategories, setSelectedCategories] = React.useState<
    SelectedCategory[]
  >([]);
  const [isQuickSetup, setIsQuickSetup] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isMenuAlreadySetup, setIsMenuAlreadySetup] = React.useState(false);

  // For manual category management
  const [manualCategories, setManualCategories] = React.useState<
    Array<{
      id: string;
      title: string;
      isOpen: boolean;
      isEditing?: boolean;
    }>
  >([]);

  // State for complete menu data (categories with items)
  const [completeMenuData, setCompleteMenuData] = React.useState<
    Array<{
      id: string;
      name: string;
      items: Array<{
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
      }>;
    }>
  >([]);

  // Check menu setup status on component mount
  React.useEffect(() => {
    async function checkSetupStatus() {
      try {
        setIsLoading(true);
        // console.log("🔍 Checking menu setup status...");
        const result = await checkMenuSetupStatus();
        // console.log("📊 Setup status result:", result);

        if (result.success && result.isSetupComplete) {
          setIsMenuAlreadySetup(true);
          setIsQuickSetup(false);
          setCurrentStep("manage");

          // Load existing menu data WITH items
          // console.log("📋 Loading complete menu...");
          const menuResult = await getCompleteMenu();
          // console.log("📋 Complete menu result:", menuResult);

          if (menuResult.success && menuResult.categories) {
            // Store complete menu data for CategoryCard
            setCompleteMenuData(menuResult.categories);

            // Convert to simple format for management state
            const convertedCategories = menuResult.categories.map(
              (category) => ({
                id: category.id,
                title: category.name,
                isOpen: false,
                isEditing: false,
              })
            );
            // console.log("🏷️ Converted categories:", convertedCategories);
            setManualCategories(convertedCategories);
          }
        } else {
          // console.log("🆕 Menu not setup yet, showing template flow");
        }
      } catch (error) {
        console.error("❌ Error checking menu setup status:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkSetupStatus();
  }, []);

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

  const handleSaveCategory = async (categoryId: string, newTitle: string) => {
    console.log("💾 handleSaveCategory called:", { categoryId, newTitle });

    if (categoryId.startsWith("temp-")) {
      console.log(
        "🏷️ This is a temporary category, CategoryCard will handle database creation"
      );
      // Remove the temporary category from local state - CategoryCard will refresh the page
      setManualCategories((categories) =>
        categories.filter((category) => category.id !== categoryId)
      );
    } else {
      console.log(
        "📝 Updating existing category in both local state and database"
      );

      try {
        // First update the database
        const result = await updateMenuCategory(categoryId, {
          name: newTitle.trim(),
        });

        if (result.success) {
          console.log("✅ Category updated successfully in database");

          // Then update local state
          setManualCategories((categories) =>
            categories.map((category) =>
              category.id === categoryId
                ? { ...category, title: newTitle, isEditing: false }
                : category
            )
          );

          // Also update the complete menu data
          setCompleteMenuData((menuData) =>
            menuData.map((category) =>
              category.id === categoryId
                ? { ...category, name: newTitle }
                : category
            )
          );

          // Optional: Show success message
          console.log("✅ Category name updated successfully");
        } else {
          console.error(
            "❌ Failed to update category in database:",
            result.error
          );
          alert(
            "Failed to update category: " + (result.error || "Unknown error")
          );
        }
      } catch (error) {
        console.error("❌ Error updating category:", error);
        alert("Error updating category. Please try again.");
      }
    }
  };

  // Updated handleFinishSetup to fetch fresh data from database
  const handleFinishSetup = async () => {
    try {
      setIsSaving(true);

      // Convert selectedCategories to MenuSetupData format
      const setupData: MenuSetupData = {
        categories: selectedCategories
          .filter((cat) => cat.selectedItems.length > 0)
          .map((cat) => ({
            template_id: cat.template.id,
            name: cat.template.name,
            description: cat.template.description,
            items: cat.selectedItems.map((item) => ({
              name: item.name,
              description: item.description,
              price: item.price,
              image_url: item.image,
              is_vegetarian: item.isVegetarian, // Use the vegetarian status from item
              template_item_id: item.isCustom
                ? undefined
                : `${cat.template.id}-${item.name}`,
              is_custom: item.isCustom || false,
            })),
          })),
      };

      // console.log("💾 Saving menu setup data:", setupData);
      const result = await completeMenuSetup(setupData);

      if (!result.success) {
        throw new Error(result.error || "Failed to save menu");
      }

      // console.log("✅ Menu setup saved successfully");

      // 🔥 KEY FIX: Fetch fresh data from database instead of using frontend state
      // console.log("📋 Fetching fresh menu data from database...");
      const menuResult = await getCompleteMenu();

      if (menuResult.success && menuResult.categories) {
        // console.log("📋 Fresh menu data:", menuResult.categories);

        // Store complete menu data for CategoryCard (with items!)
        setCompleteMenuData(menuResult.categories);

        // Convert to simple format for management state using REAL database IDs
        const convertedCategories = menuResult.categories.map((category) => ({
          id: category.id, // ✅ Real database ID
          title: category.name, // ✅ Real database name
          isOpen: false,
          isEditing: false,
        }));

        // console.log(
        //   "🏷️ Converted categories with real IDs:",
        //   convertedCategories
        // );
        setManualCategories(convertedCategories);

        // Update state flags
        setCurrentStep("manage");
        setIsQuickSetup(false);
        setIsMenuAlreadySetup(true);

        // Show success message
        alert(result.message || "Menu setup completed successfully!");
      } else {
        console.error("❌ Failed to fetch fresh menu data:", menuResult.error);
        // Fallback - reload the page to get fresh data
        window.location.reload();
      }
    } catch (error) {
      console.error("❌ Error saving menu setup:", error);
      alert("Failed to save menu setup. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddManualCategory = () => {
    // console.log("➕ Adding manual category");
    const newCategory = {
      id: `temp-category-${Date.now()}`, // Use temp- prefix for local categories
      title: "",
      isOpen: true,
      isEditing: true,
    };
    // console.log("🆕 New category object:", newCategory);
    setManualCategories((prev) => {
      // console.log("📋 Previous categories:", prev);
      const updated = [...prev, newCategory];
      // console.log("📋 Updated categories:", updated);
      return updated;
    });
  };

  const handleCategoryOpenChange = (categoryId: string, isOpen: boolean) => {
    setManualCategories((categories) =>
      categories.map((category) =>
        category.id === categoryId ? { ...category, isOpen } : category
      )
    );
  };
  const handleDeleteCategory = async (categoryId: string) => {
    console.log("🗑️ Attempting to delete category:", categoryId);

    // Check if this is a temporary category (not yet saved to database)
    const isTemporaryCategory = categoryId.startsWith("temp-");

    if (isTemporaryCategory) {
      // For temporary categories, just remove from local state
      console.log("🏷️ Removing temporary category from local state");
      setManualCategories((categories) =>
        categories.filter((category) => category.id !== categoryId)
      );
      return;
    }

    // For real database categories, confirm deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category? This will also delete all items in this category. This action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      console.log("🗑️ Deleting category from database:", categoryId);

      // Call the API to delete from database
      const result = await deleteMenuCategory(categoryId);

      if (result.success) {
        console.log("✅ Category deleted successfully from database");

        // Remove from local state
        setManualCategories((categories) =>
          categories.filter((category) => category.id !== categoryId)
        );

        // Also remove from complete menu data
        setCompleteMenuData((menuData) =>
          menuData.filter((category) => category.id !== categoryId)
        );

        // Optional: Show success message
        alert("Category deleted successfully!");
      } else {
        console.error("❌ Failed to delete category:", result.error);
        alert(
          "Failed to delete category: " + (result.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error("❌ Error deleting category:", error);
      alert("Error deleting category. Please try again.");
    }
  };

  const startQuickSetup = () => {
    if (isMenuAlreadySetup) {
      const confirmResetup = window.confirm(
        "You already have a menu setup. Starting quick setup will help you add more categories. Continue?"
      );
      if (!confirmResetup) return;
    }

    setIsQuickSetup(true);
    setCurrentStep("template");
    setSelectedCategories([]);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Checking menu setup status...</p>
        </div>
      </div>
    );
  }

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

          {/* Only show template button if menu is NOT already setup */}
          {!isMenuAlreadySetup && (
            <Button onClick={startQuickSetup} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Quick Setup
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {manualCategories.map((category) => {
            // Find the corresponding menu data for this category
            const menuData = completeMenuData.find(
              (menuCat) => menuCat.id === category.id
            );
            const existingItems = menuData?.items || [];

            return (
              <CategoryCard
                key={category.id}
                id={category.id}
                title={category.title}
                isOpen={category.isOpen}
                isEditing={category.isEditing}
                existingItems={existingItems}
                onOpenChange={(isOpen) =>
                  handleCategoryOpenChange(category.id, isOpen)
                }
                onDelete={() => handleDeleteCategory(category.id)}
                onSave={handleSaveCategory}
              />
            );
          })}

          {/* Add Custom Category Button - Always available */}
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
        <h1 className="text-3xl font-bold mb-2">
          {isMenuAlreadySetup ? "Add More Categories" : "Quick Menu Setup"}
        </h1>
        <p className="text-muted-foreground">
          {isMenuAlreadySetup
            ? "Add more categories to your existing menu"
            : "Set up your menu in minutes using our templates"}
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
            isLoading={isSaving}
          />
        )}
      </div>

      {/* Footer Actions */}
      {currentStep === "template" && (
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
      )}
    </div>
  );
}
