"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Equal,
  Trash2,
  ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/shadcn-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

const sizeSchema = z.object({
  size: z.string().optional(),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  isDefault: z.boolean().default(false),
});

const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  sizes: z.array(sizeSchema).min(1, "At least one size is required"),
});

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
  // position,
  isOpen,
  onOpenChange,
  // onPositionChange,
  onDelete,
  children,
}: MenuItemCardProps) {
  // const [isDragging, setIsDragging] = React.useState(false);

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      sizes: [{ size: "", price: "", isDefault: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sizes",
  });

  // const handleDragStart = () => {
  //   setIsDragging(true);
  // };

  // const handleDragEnd = (_event: any, info: any) => {
  //   setIsDragging(false);
  //   onPositionChange(id, {
  //     x: position.x,
  //     y: position.y + info.offset.y,
  //   });
  // };

  const onSubmit = (data: MenuItemFormValues) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <motion.div className="px-4">
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
                    src={require("@/public/tzs-logo.svg")}
                    alt="menu item"
                    className="w-12 h-12"
                  />
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-lg">{title}</CardTitle>
                      <Badge variant="default">Out of Stock</Badge>
                    </div>
                    <p className="text-sm">{form.watch("description")}</p>
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
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="bg-muted/50"
                >
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-center items-start gap-4">
                      <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Food/Drink Name"
                          {...form.register("name")}
                        />
                        {form.formState.errors.name && (
                          <p className="text-sm text-red-500 mt-1">
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Textarea
                        placeholder="Description"
                        {...form.register("description")}
                        className="min-h-[100px]"
                      />
                      {form.formState.errors.description && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.description.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-start gap-4">
                          <div className="flex-1">
                            <Input
                              placeholder="Size"
                              {...form.register(`sizes.${index}.size`)}
                              className="w-full"
                            />
                            {form.formState.errors.sizes?.[index]?.size && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  form.formState.errors.sizes[index]?.size
                                    ?.message
                                }
                              </p>
                            )}
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="Price"
                              {...form.register(`sizes.${index}.price`)}
                              className="w-full"
                            />
                            {form.formState.errors.sizes?.[index]?.price && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  form.formState.errors.sizes[index]?.price
                                    ?.message
                                }
                              </p>
                            )}
                          </div>
                          <div className="flex h-full justify-center gap-2">
                            <Checkbox
                              checked={form.watch(`sizes.${index}.isDefault`)}
                              onCheckedChange={(checked) =>
                                form.setValue(
                                  `sizes.${index}.isDefault`,
                                  checked as boolean
                                )
                              }
                            />
                            <span className="text-sm">Default</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {form.formState.errors.sizes && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.sizes.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <button
                        type="button"
                        className="text-sm font-semibold underline"
                        onClick={() =>
                          append({ size: "", price: "", isDefault: false })
                        }
                      >
                        Add Size
                      </button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 p-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-primary text-primary"
                      size="sm"
                      onClick={() => form.reset()}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary text-white"
                      size="sm"
                    >
                      Save
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            )}
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
}
