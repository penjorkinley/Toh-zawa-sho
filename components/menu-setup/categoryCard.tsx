"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  Edit,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";
import { MenuItemCard } from "../menu-setup/menu-item";
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

interface MenuItem {
  id: string;
  title: string;
  isOpen: boolean;
  price?: string;
  description?: string;
}

interface CategoryCardProps {
  id: string;
  title: string;
  isOpen: boolean;
  isEditing?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDelete?: (id: string) => void;
  onSave?: (id: string, newTitle: string) => void;
}

export default function CategoryCard({
  id,
  title,
  isOpen,
  isEditing = false,
  onOpenChange,
  onDelete,
  onSave,
}: CategoryCardProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isEditingLocal, setIsEditingLocal] = useState(isEditing);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const isNewCategory = !title; // Flag to track if this is a new category

  // Auto-focus when editing starts or when it's a new category
  React.useEffect(() => {
    if (isEditing || isNewCategory) {
      setIsEditingLocal(true);
    }
  }, [isEditing, isNewCategory]);

  const [pendingNewItem, setPendingNewItem] = useState<string | null>(null);

  const handleAddMenuItem = () => {
    const newItemId = `item-${Date.now()}`;
    setPendingNewItem(newItemId);
    const newItem: MenuItem = {
      id: newItemId,
      title: "",
      isOpen: true,
    };

    setMenuItems([...menuItems, newItem]);
    setIsAddingItem(true);
  };

  const handleMenuItemOpenChange = (itemId: string, isOpen: boolean) => {
    setMenuItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, isOpen } : item))
    );
  };

  const handleDeleteMenuItem = (itemId: string) => {
    setMenuItems((items) => items.filter((item) => item.id !== itemId));
  };

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      onSave?.(id, editedTitle.trim());
      setIsEditingLocal(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(title);
    setIsEditingLocal(false);
    if (!title) {
      // If it's a new category without a title, remove it
      onDelete?.(id);
    }
  };

  const handleDuplicateCategory = () => {
    // In a real implementation, this would duplicate the category
    console.log(`Duplicating category: ${title}`);
  };

  const getItemCount = () => {
    const activeItems = menuItems.filter((item) => item.title.trim() !== "");
    return activeItems.length;
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
                {getItemCount() > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {getItemCount()} items
                  </Badge>
                )}
              </div>
              {!isOpen && getItemCount() > 0 && (
                <p className="text-sm text-muted-foreground">
                  {menuItems
                    .slice(0, 2)
                    .map((item) => item.title)
                    .filter(Boolean)
                    .join(", ")}
                  {getItemCount() > 2 && ` +${getItemCount() - 2} more`}
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
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white border shadow-lg z-50"
                sideOffset={5}
              >
                <DropdownMenuItem
                  onClick={() => setIsEditingLocal(true)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Rename Category
                </DropdownMenuItem>
                {/* <DropdownMenuItem
                  onClick={handleDuplicateCategory}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Duplicate Category
                </DropdownMenuItem> */}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete the category "${title}"?`
                        )
                      ) {
                        onDelete(id);
                      }
                    }}
                    className="text-red-600 focus:text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Category
                  </DropdownMenuItem>
                )}
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
        <CardContent className="px-4 pb-4 space-y-4">
          {/* Menu Items */}
          <div className="space-y-3">
            {menuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                position={{ x: 0, y: 0 }}
                isOpen={item.isOpen}
                onOpenChange={(isOpen) =>
                  handleMenuItemOpenChange(item.id, isOpen)
                }
                onPositionChange={() => {}}
                onDelete={() => handleDeleteMenuItem(item.id)}
              />
            ))}
          </div>

          {/* Add Item Button */}
          <Button
            variant="outline"
            className="w-full border-dashed border-primary text-primary hover:bg-primary/5"
            onClick={handleAddMenuItem}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item to {title}
          </Button>

          {/* Empty State */}
          {menuItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No items in this category yet</p>
              <p className="text-xs">
                Click the button above to add your first item
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
