"use client";

import React, { useState } from "react";
import { DraggableCard } from "../draggable-card";
import { MenuItemCard } from "../menu-setup/menu-item";
import { Button } from "../ui/shadcn-button";
import FloatingLabelInput from "../floating-label-input";
import MenuItemEditCard from "./menuItemEditCard";

interface MenuItem {
  id: string;
  title: string;
  position: { x: number; y: number };
  isOpen: boolean;
}

interface CategoryCardProps {
  id: string;
  title: string;
  position: { x: number; y: number };
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onDelete?: (id: string) => void;
}

export default function CategoryCard({
  id,
  title,
  position,
  isOpen,
  onOpenChange,
  onPositionChange,
  onDelete,
}: CategoryCardProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItemName, setNewItemName] = useState("");

  const handleAddMenuItem = () => {
    if (!newItemName.trim()) return;

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      title: newItemName,
      position: { x: 0, y: 0 },
      isOpen: false,
    };

    setMenuItems([...menuItems, newItem]);
    setNewItemName("");
  };

  //   const handleMenuItemPositionChange = (
  //     itemId: string,
  //     newPosition: { x: number; y: number }
  //   ) => {
  //     setMenuItems((items) =>
  //       items.map((item) =>
  //         item.id === itemId ? { ...item, position: newPosition } : item
  //       )
  //     );
  //   };
  const handleMenuItemPositionChange = (
    id: string,
    newPosition: { x: number; y: number }
  ) => {
    setMenuItems((prevCards) => {
      // Find the dragged card and its index
      const draggedCardIndex = prevCards.findIndex((card) => card.id === id);
      if (draggedCardIndex === -1) return prevCards;

      // Calculate the new order based on the dragged position
      const draggedCard = prevCards[draggedCardIndex];
      const otherCards = prevCards.filter((card) => card.id !== id);

      // Find where to insert the dragged card
      let insertIndex = 0;
      for (let i = 0; i < otherCards.length; i++) {
        if (newPosition.y > otherCards[i].position.y) {
          insertIndex = i + 1;
        }
      }

      // Create new array with the dragged card in the new position
      const reorderedCards = [
        ...otherCards.slice(0, insertIndex),
        draggedCard,
        ...otherCards.slice(insertIndex),
      ];

      return reorderedCards;
    });
  };

  const handleMenuItemOpenChange = (itemId: string, isOpen: boolean) => {
    setMenuItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, isOpen } : item))
    );
  };

  const handleDeleteMenuItem = (itemId: string) => {
    setMenuItems((items) => items.filter((item) => item.id !== itemId));
  };

  return (
    <DraggableCard
      id={id}
      title={title}
      position={position}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onPositionChange={onPositionChange}
      onDelete={onDelete}
    >
      <div className="px-4 pb-4 space-y-4">
        <div className="flex justify-between items-center gap-2">
          <FloatingLabelInput
            label="Item Name"
            value={newItemName}
            onChange={setNewItemName}
          />
          <Button onClick={handleAddMenuItem}>Add Item</Button>
        </div>

        <div className="relative space-y-4">
          {menuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              id={item.id}
              title={item.title}
              position={item.position}
              isOpen={item.isOpen}
              onOpenChange={(isOpen) =>
                handleMenuItemOpenChange(item.id, isOpen)
              }
              onPositionChange={handleMenuItemPositionChange}
              onDelete={() => handleDeleteMenuItem(item.id)}
            >
              <MenuItemEditCard />
            </MenuItemCard>
          ))}
        </div>
      </div>
    </DraggableCard>
  );
}
