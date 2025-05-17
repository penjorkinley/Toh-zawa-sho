"use client";

import * as React from "react";
import { Edit, Trash2, Menu } from "lucide-react";
import Draggable from "react-draggable"; // Import from react-draggable
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
import { Button } from "@/components/ui/shadcn-button";

// Define the props interface for the DraggableCard component
interface DraggableCardProps {
  id: string;
  title: string;
  position: { x: number; y: number };
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onDelete?: (id: string) => void;
  children?: React.ReactNode;
}

// Use forwardRef to allow the component to handle refs correctly
const DraggableCardInner = React.forwardRef<HTMLDivElement, DraggableCardProps>(
  ({
    id,
    title,
    position,
    isOpen,
    onOpenChange,
    onPositionChange,
    onDelete,
  }: // children,
  DraggableCardProps) =>
    // ref
    {
      const [isDragging, setIsDragging] = React.useState(false);

      const handleDragStart = () => {
        setIsDragging(true);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleDragStop = (e: any, data: { x: number; y: number }) => {
        setIsDragging(false);
        // On drag stop, update the new position
        onPositionChange(id, {
          x: data.x,
          y: data.y,
        });
      };

      // Create a nodeRef for Draggable (to avoid `findDOMNode`)
      const draggableRef = React.useRef<HTMLDivElement>(null);

      return (
        <Draggable
          axis="y" // Restrict movement to the vertical axis
          position={{ x: position.x, y: position.y }} // Keep the initial position
          onStart={handleDragStart} // Handle drag start
          onStop={handleDragStop} // Handle drag stop to update the position
          bounds={{ top: 0, bottom: 500 }} // Add your vertical limit here (adjust height as needed)
          nodeRef={draggableRef as React.RefObject<HTMLElement>} // Attach the ref to avoid `findDOMNode`
        >
          <div
            ref={draggableRef} // Attach the ref here to the element
            className="w-full px-4 bg-background"
            style={{
              position: "absolute",
              zIndex: isDragging ? 20 : isOpen ? 10 : 1,
              top: position.y,
            }}
          >
            <Card className="border shadow-md">
              <Collapsible
                open={isOpen}
                onOpenChange={onOpenChange}
                className="w-full"
              >
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      {title}
                    </CardTitle>
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
                        <CardTitle className="text-md">
                          Collapsed Content
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          This is the content that appears when the card is
                          expanded. You can put any information or components
                          here.
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
          </div>
        </Draggable>
      );
    }
);

// The DraggableCard now uses the `forwardRef` function
DraggableCardInner.displayName = "DraggableCardInner"; // It's good practice to set displayName for forwardRef components

export function DraggableCard(props: DraggableCardProps) {
  return <DraggableCardInner {...props} />;
}
