"use client";

import React, { useState } from "react";
import { MoreVertical, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { MenuItemCard } from "../menu-setup/menu-item";
import { Button } from "../ui/shadcn-button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader } from "../ui/card";

interface MenuItem {
  id: string;
  title: string;
  isOpen: boolean;
}

interface CategoryCardProps {
  id: string;
  title: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDelete?: (id: string) => void;
}

export default function CategoryCard({
  id,
  title,
  isOpen,
  onOpenChange,
  onDelete,
}: CategoryCardProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleAddMenuItem = () => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      title: "",
      isOpen: true,
    };

    setMenuItems([...menuItems, newItem]);
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
    // Here you would typically save the changes to your backend
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="border bg-background">
        <CardContent className="p-4 space-y-4">
          <Input
            placeholder="Category Name"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="border-primary text-primary"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-white"
              size="sm"
              onClick={handleSaveEdit}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border bg-background">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">=</span>
            <span className="text-base">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
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
          <div className="relative space-y-4">
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
          <Button
            variant="outline"
            className="w-full border-primary text-primary"
            onClick={handleAddMenuItem}
          >
            Add items to {title}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
