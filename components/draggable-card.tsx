"use client";

import * as React from "react";
import { Edit, Trash2, Menu } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/shadcn-button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DraggableCardProps {
  id: string;
  title: string;
  position: { x: number; y: number };
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onDelete?: (id: string) => void;
}

export function DraggableCard({
  id,
  title,
  position,
  isOpen,
  onOpenChange,
  onPositionChange,
  onDelete,
}: DraggableCardProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (_event: any, info: any) => {
    setIsDragging(false);
    onPositionChange(id, {
      x: position.x,
      y: position.y + info.offset.y,
    });
  };

  return (
    <motion.div
      drag="y"
      dragDirectionLock
      dragMomentum={false}
      dragConstraints={{ top: 0, bottom: 1000 }}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      initial={{ y: position.y }}
      animate={{ y: position.y }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        position: "absolute",
        zIndex: isDragging ? 20 : isOpen ? 10 : 1,
        left: 0,
        top: position.y,
        width: "100%",
      }}
      className="px-4"
    >
      <Card className="border shadow-md">
        <Collapsible
          open={isOpen}
          onOpenChange={onOpenChange}
          className="w-full"
        >
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDelete && onDelete(id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="px-4 pb-4 pt-0">
              <Card className="border bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-md">Collapsed Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This is the content that appears when the card is expanded.
                    You can put any information or components here.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button size="sm">Save</Button>
                </CardFooter>
              </Card>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
}
