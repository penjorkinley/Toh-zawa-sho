"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Edit, Equal, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/shadcn-button";
import { Badge } from "@/components/ui/badge";
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

interface MenuItemCardProps {
  id: string;
  title: string;
  position: { x: number; y: number };
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onDelete?: (id: string) => void;
  children?: React.ReactNode;
}

export function MenuItemCard({
  id,
  title,
  position,
  isOpen,
  onOpenChange,
  onPositionChange,
  onDelete,
  children,
}: MenuItemCardProps) {
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
      dragConstraints={{ top: 0 }}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      initial={{ y: position.y }}
      animate={{ y: position.y }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        position: "relative",
        zIndex: isDragging ? 20 : 0,
        // left: 0,
        // top: position.y,
        width: "100%",
      }}
      className="px-4"
    >
      <Card className="border bg-background">
        <Collapsible
          open={isOpen}
          onOpenChange={onOpenChange}
          className="w-full"
        >
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              {!isOpen && (
                <div className="flex items-center gap-2">
                  <Equal className="w-6 h-6" />
                  <Image
                    // eslint-disable-next-line @typescript-eslint/no-require-imports
                    src={require("@/public/tzs-logo.svg")}
                    alt="menu item"
                    className="w-12 h-12"
                  />
                  <div>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{title}</CardTitle>
                      <Badge variant="default">Out of Stock</Badge>
                    </div>
                    <p className="text-sm">
                      Local Chilli, Cottage cheese, Onion and Tomato
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-center items-center">
                {!isOpen && (
                  <>
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
                  </>
                )}
                <CollapsibleTrigger asChild>
                  {isOpen ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronDown className="h-10 w-10" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronUp className="h-10 w-10" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  )}
                </CollapsibleTrigger>
              </div>
            </div>
          </CardHeader>
          <CollapsibleContent>
            {children || (
              <CardContent className="px-4 pb-4 pt-0">
                {
                  <Card className="border bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-md">
                        Collapsed Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Here Goes the Editable Card */}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        className="border-primary text-primary"
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button className="text-white" size="sm">
                        Save
                      </Button>
                    </CardFooter>
                  </Card>
                }
              </CardContent>
            )}
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
}
