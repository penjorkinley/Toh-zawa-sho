"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/shadcn-button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Equal,
  ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

// SIMPLIFIED: Clean schema without confusing default logic
const sizeSchema = z.object({
  name: z.string().min(1, "Size name is required"),
  price: z.string().min(1, "Price is required"),
});

const menuItemSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    hasMultipleSizes: z.boolean(),
    simplePrice: z.string().optional(),
    sizes: z.array(sizeSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.hasMultipleSizes) {
        return data.sizes && data.sizes.length > 0;
      }
      return data.simplePrice && data.simplePrice.trim().length > 0;
    },
    {
      message: "Please provide either a price or size options",
    }
  );

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

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
  isOpen,
  onOpenChange,
  onDelete,
  children,
}: MenuItemCardProps) {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      hasMultipleSizes: false,
      simplePrice: "",
      sizes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sizes",
  });

  const hasMultipleSizes = form.watch("hasMultipleSizes");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      // Here you would typically upload to your server and get back a URL
      console.log("Image selected:", file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (data: MenuItemFormValues) => {
    console.log("Saving menu item:", data);
    // Save to database here
    setIsEditing(false);
    onOpenChange(false);
  };

  const togglePricingType = (useMultipleSizes: boolean) => {
    form.setValue("hasMultipleSizes", useMultipleSizes);
    if (useMultipleSizes && fields.length === 0) {
      append({ name: "", price: "" });
    }
  };

  const addSize = () => {
    append({ name: "", price: "" });
  };

  const handleEdit = () => {
    setIsEditing(true);
    onOpenChange(true);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
    if (!title) {
      // If this is a new item that was never saved, delete it
      onDelete?.(id);
    } else {
      onOpenChange(false);
    }
  };

  return (
    <motion.div className="px-4">
      <Card className="border bg-background">
        <Collapsible open={isOpen} onOpenChange={onOpenChange}>
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              {!isOpen && (
                <div className="flex items-center gap-3 flex-1">
                  <Equal className="w-5 h-5 text-muted-foreground" />
                  <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={selectedImage || "/default-food-img.jpg"}
                      alt="menu item"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                      {form.watch("name") || title || "New Item"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground truncate">
                      {form.watch("description") || "No description"}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                {!isOpen && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleEdit}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        const itemName =
                          form.watch("name") || title || "this item";
                        if (
                          window.confirm(
                            `Are you sure you want to delete "${itemName}"?`
                          )
                        ) {
                          onDelete?.(id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
          </CardHeader>

          <CollapsibleContent>
            {children || (
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="p-4 space-y-4">
                  {/* Basic Info with Image Upload */}
                  <div className="flex gap-4">
                    <div className="relative">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <div
                        onClick={triggerImageUpload}
                        className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted transition-colors overflow-hidden"
                      >
                        {selectedImage ? (
                          <Image
                            src={selectedImage}
                            alt="Uploaded item"
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      {selectedImage && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerImageUpload();
                          }}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs hover:bg-primary/90"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <Input
                        placeholder="Item name (e.g., Chicken Momo)"
                        {...form.register("name")}
                      />
                      <Textarea
                        placeholder="Description"
                        {...form.register("description")}
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Pricing Type */}
                  <div className="border-t pt-4">
                    <div className="flex gap-4 mb-4">
                      <Button
                        type="button"
                        variant={!hasMultipleSizes ? "default" : "outline"}
                        size="sm"
                        onClick={() => togglePricingType(false)}
                      >
                        Single Price
                      </Button>
                      <Button
                        type="button"
                        variant={hasMultipleSizes ? "default" : "outline"}
                        size="sm"
                        onClick={() => togglePricingType(true)}
                      >
                        Multiple Sizes
                      </Button>
                    </div>

                    {/* Single Price */}
                    {!hasMultipleSizes && (
                      <Input
                        placeholder="Price (e.g., 180)"
                        {...form.register("simplePrice")}
                      />
                    )}

                    {/* Multiple Sizes - Fixed field sizing */}
                    {hasMultipleSizes && (
                      <div className="space-y-3">
                        {fields.map((field, index) => (
                          <div key={field.id} className="flex gap-2">
                            <Input
                              placeholder="Size (e.g., Small)"
                              {...form.register(`sizes.${index}.name`)}
                              className="w-32" // Fixed width for size
                            />
                            <Input
                              placeholder="Price"
                              {...form.register(`sizes.${index}.price`)}
                              className="flex-1" // Price takes remaining space
                            />
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSize}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Size
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-2 p-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </CardFooter>
              </form>
            )}
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
}
