"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/shadcn-button";
import { DraggableCard } from "@/components/draggable-card";

interface CardData {
  id: string;
  title: string;
  position: { x: number; y: number };
  isOpen: boolean;
}

export default function OrderPage() {
  const COLLAPSED_CARD_HEIGHT = 40; // Height of a collapsed card
  const EXPANDED_CONTENT_HEIGHT = 100; // Estimated height of expanded content
  const CARD_GAP = 1; // Gap between cards

  const [cards, setCards] = React.useState<CardData[]>([
    {
      id: "card-1",
      title: "Draggable Card 1",
      position: { x: 0, y: 0 },
      isOpen: false,
    },
    {
      id: "card-2",
      title: "Draggable Card 2",
      position: { x: 0, y: 0 },
      isOpen: false,
    },
    {
      id: "card-3",
      title: "Draggable Card 3",
      position: { x: 0, y: 0 },
      isOpen: false,
    },
  ]);

  // Calculate positions based on expanded state
  React.useEffect(() => {
    let currentY = 0;
    const updatedCards = cards.map((card) => {
      const newCard = {
        ...card,
        position: { ...card.position, y: currentY },
      };
      // Increment y position for next card
      currentY +=
        COLLAPSED_CARD_HEIGHT +
        (card.isOpen ? EXPANDED_CONTENT_HEIGHT : 0) +
        CARD_GAP;
      return newCard;
    });

    // Only update if positions have changed
    if (JSON.stringify(updatedCards) !== JSON.stringify(cards)) {
      setCards(updatedCards);
    }
  }, [cards]);

  const handlePositionChange = (
    id: string,
    newPosition: { x: number; y: number }
  ) => {
    setCards((prevCards) => {
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

  const handleOpenChange = (id: string, isOpen: boolean) => {
    setCards((prevCards) =>
      prevCards.map((card) => (card.id === id ? { ...card, isOpen } : card))
    );
  };

  const handleAddCard = () => {
    const newId = `card-${cards.length + 1}`;
    setCards([
      ...cards,
      {
        id: newId,
        title: `Draggable Card ${cards.length + 1}`,
        position: { x: 0, y: 0 }, // Will be calculated by useEffect
        isOpen: false,
      },
    ]);
  };

  const handleDeleteCard = (id: string) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  return (
    <div className="relative w-full h-[600px] border rounded-lg bg-muted/20 overflow-auto p-4">
      <div className="absolute top-4 right-4 z-20">
        <Button onClick={handleAddCard}>
          <Plus className="mr-2 h-4 w-4" />
          Add Card
        </Button>
      </div>

      <div
        style={{
          height:
            cards.length > 0
              ? cards[cards.length - 1].position.y +
                COLLAPSED_CARD_HEIGHT +
                (cards[cards.length - 1].isOpen ? EXPANDED_CONTENT_HEIGHT : 0) +
                100
              : 0,
        }}
      >
        {cards.map((card) => (
          <DraggableCard
            key={card.id}
            id={card.id}
            title={card.title}
            position={card.position}
            isOpen={card.isOpen}
            onOpenChange={(isOpen) => handleOpenChange(card.id, isOpen)}
            onPositionChange={handlePositionChange}
            onDelete={handleDeleteCard}
          />
        ))}
      </div>
    </div>
  );
}
