"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FloatingLabelInput from "@/components/floating-label-input";
import { Button } from "../ui/shadcn-button";
import { Card } from "../ui/card";
import { Edit, Trash2 } from "lucide-react";

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeCardProps {
  id?: string;
  name?: string;
  email?: string;
  isNew?: boolean;
  onDelete?: (id: string) => void;
  onSave?: (id: string | undefined, data: EmployeeFormData) => void;
}

export default function EmployeeCard({
  id,
  name = "",
  email = "",
  isNew = false,
  onDelete,
  onSave,
}: EmployeeCardProps) {
  const [isEditing, setIsEditing] = useState(isNew);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name,
      email,
    },
  });

  const onSubmit = (data: EmployeeFormData) => {
    onSave?.(id, data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset({ name, email });
    setIsEditing(false);
  };

  if (isEditing || isNew) {
    return (
      <Card className="w-full bg-background shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div className="flex flex-col gap-4">
            <FloatingLabelInput
              label="Name"
              error={errors.name?.message}
              {...register("name")}
            />
            <FloatingLabelInput
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-primary text-primary w-20"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="bg-primary text-white w-20"
            >
              Invite
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-background shadow-sm">
      <div className="p-4 flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-semibold">{name}</h3>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete(id!)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
