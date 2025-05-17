"use client";
import React, { useState } from "react";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
import FloatingLabelInput from "../floating-label-input";
import { Button } from "../ui/shadcn-button";
import { Edit, QrCodeIcon, Trash2 } from "lucide-react";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TableCardProps {
  id?: string;
  tableNumber?: string;
  isNew?: boolean;
  onDelete?: (id: string) => void;
}

export default function TableCard({
  id,
  tableNumber = "",
  isNew = false,
  onDelete,
}: TableCardProps) {
  const [isEditing, setIsEditing] = useState(isNew);
  const [value, setValue] = useState(tableNumber);
  const [showQR, setShowQR] = useState(false);

  const handleSave = () => {
    // Here you would save the changes to your backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(tableNumber);
    setIsEditing(false);
  };

  const handleDownloadQR = () => {
    // Implement QR code download functionality
    // This will be implemented when you add the QR code generation logic
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  if (isEditing) {
    return (
      <Card className="rounded-xl p-4 shadow-md w-11/12">
        <div className="flex flex-col gap-4">
          <FloatingLabelInput
            label="Table Number"
            value={value}
            onChange={handleChange}
          />
          <div className="flex justify-between items-center gap-2 w-full">
            <Button
              variant="ghost"
              className="text-primary underline"
              onClick={() => setShowQR(true)}
            >
              Generate QR
            </Button>
            <div className="space-x-2">
              <Button
                variant="outline"
                className="border-primary text-primary w-20"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="bg-primary text-white w-20"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="rounded-xl p-4 shadow-md w-11/12">
        <div className="flex justify-between items-center w-full">
          <p className="text-lg">Table {value}</p>
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowQR(true)}
            >
              <QrCodeIcon className="h-4 w-4" />
              <span className="sr-only">Generate QR</span>
            </Button>
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

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Table {value}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-64 h-64 bg-muted flex items-center justify-center">
              {/* QR code will be generated here */}
              <QrCodeIcon className="w-32 h-32 text-muted-foreground" />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDownloadQR}
            >
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
