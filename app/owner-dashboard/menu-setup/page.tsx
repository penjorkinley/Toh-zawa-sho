"use client";

import * as React from "react";
import CategoryCard from "@/components/menu-setup/categoryCard";
import { Button } from "@/components/ui/shadcn-button";

interface Category {
  id: string;
  title: string;
  isOpen: boolean;
}

export default function MenuSetupPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = React.useState(false);

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      title: "New Category",
      isOpen: true,
    };
    setCategories([...categories, newCategory]);
  };

  const handleCategoryOpenChange = (categoryId: string, isOpen: boolean) => {
    setCategories((categories) =>
      categories.map((category) =>
        category.id === categoryId ? { ...category, isOpen } : category
      )
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((categories) =>
      categories.filter((category) => category.id !== categoryId)
    );
  };

  return (
    <div className="relative w-full h-full bg-muted/20 p-4 space-y-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          id={category.id}
          title={category.title}
          isOpen={category.isOpen}
          onOpenChange={(isOpen) => handleCategoryOpenChange(category.id, isOpen)}
          onDelete={() => handleDeleteCategory(category.id)}
        />
      ))}
      <Button
        variant="outline"
        className="w-full border-primary text-primary"
        onClick={handleAddCategory}
      >
        Add Category
      </Button>
    </div>
  );
}
