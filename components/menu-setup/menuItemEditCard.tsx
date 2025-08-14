"use client";
import { Image } from "lucide-react";
import { useState } from "react";
import FloatingLabelInput from "../floating-label-input";
import { Card } from "../ui/card";
import { Button } from "../ui/shadcn-button";

export default function MenuItemEditCard() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Card className="p-4 m-4 w-[90%] md:w-5/6  space-y-4 mx-auto">
      <div className="flex justify-center items-center gap-2 ">
        <div className="h-12 w-12 border-[1px] border-dashed border-[#A3A2A2] rounded-md flex justify-center items-center">
          <Image className="w-6 h-6 text-[#A3A2A2] text-sm" />
          <input type="file" hidden />
        </div>
        <FloatingLabelInput
          label="Food/ Drink Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <FloatingLabelInput
        label="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <FloatingLabelInput
        // className="h-32"
        type="textarea"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex justify-between items-center gap-2 ">
        <p className="text-md underline font-semibold">Add Size</p>
        <div className="flex justify-end items-center gap-2 ">
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
    </Card>
  );
}
