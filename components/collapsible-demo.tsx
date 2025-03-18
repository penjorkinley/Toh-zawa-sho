"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DraggableCard } from "./draggable-card"

interface CardData {
  id: string
  title: string
  position: { x: number; y: number }
}

export function CollapsibleDemo() {
  const CARD_HEIGHT = 40 // Estimated height of a collapsed card
  const CARD_GAP = 1 // Gap between cards

  const [cards, setCards] = React.useState<CardData[]>([
    { id: "card-1", title: "Draggable Card 1", position: { x: 0, y: 0 } },
    { id: "card-2", title: "Draggable Card 2", position: { x: 0, y: CARD_HEIGHT + CARD_GAP } },
    { id: "card-3", title: "Draggable Card 3", position: { x: 0, y: (CARD_HEIGHT + CARD_GAP) * 2 } },
  ])

  const handlePositionChange = (id: string, newPosition: { x: number; y: number }) => {
    setCards((prevCards) => {
      // First update the dragged card's position
      const updatedCards = prevCards.map((card) =>
        card.id === id ? { ...card, position: { ...card.position, y: newPosition.y } } : card,
      )

      // Sort cards by vertical position
      const sortedCards = [...updatedCards].sort((a, b) => a.position.y - b.position.y)

      // Reposition all cards to maintain consistent gaps
      return sortedCards.map((card, index) => {
        return {
          ...card,
          position: {
            x: 0, // Keep all cards aligned horizontally
            y: index * (CARD_HEIGHT + CARD_GAP), // Position with consistent gap
          },
        }
      })
    })
  }

  const handleAddCard = () => {
    const newId = `card-${cards.length + 1}`
    const newPosition = {
      x: 0,
      y: cards.length * (CARD_HEIGHT + CARD_GAP),
    }

    setCards([
      ...cards,
      {
        id: newId,
        title: `Draggable Card ${cards.length + 1}`,
        position: newPosition,
      },
    ])
  }

  const handleDeleteCard = (id: string) => {
    setCards((prevCards) => {
      const filteredCards = prevCards.filter((card) => card.id !== id)

      // Reposition remaining cards to maintain consistent gaps
      return filteredCards.map((card, index) => ({
        ...card,
        position: {
          x: 0,
          y: index * (CARD_HEIGHT + CARD_GAP),
        },
      }))
    })
  }

  return (
    <div className="relative w-full h-[600px] border rounded-lg bg-muted/20 overflow-auto p-4">
      <div className="absolute top-4 right-4 z-20">
        <Button onClick={handleAddCard}>
          <Plus className="mr-2 h-4 w-4" />
          Add Card
        </Button>
      </div>

      {cards.map((card) => (
        <DraggableCard
          key={card.id}
          id={card.id}
          title={card.title}
          position={card.position}
          onPositionChange={handlePositionChange}
          onDelete={handleDeleteCard}
        />
      ))}
    </div>
  )
}

