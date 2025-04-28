"use client";
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import FloatingLabelInput from "../floating-label-input";
import { Button } from "../ui/shadcn-button";
import { Edit, QrCodeIcon, Trash2 } from "lucide-react";
import { Card } from "../ui/card";

export default function TableCard() {
  const [value, setValue] = useState("1");
  return (
    <Card className="rounded-xl p-4 shadow-md w-11/12">
      <Collapsible className="animate-in fade-in-0">
        <div className="flex justify-between items-center w-full">
          <p className="text-lg">Table 1</p>
          <div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <QrCodeIcon className="h-4 w-4" />
              <span className="sr-only">Generate QR</span>
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </CollapsibleTrigger>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              // onClick={() => onDelete && onDelete(id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
        <CollapsibleContent>
          <div className="flex flex-col gap-2 border-primary border-[1px] rounded-lg p-4">
            <FloatingLabelInput
              label="Table Number"
              value={value}
              onChange={setValue}
            />
            <div className="flex justify-between items-center gap-2 w-full">
              <p className="underline font-semibold">Generate QR</p>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  className="border-primary text-primary w-20"
                >
                  Cancel
                </Button>
                <Button variant="default" className=" text-white w-20">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
