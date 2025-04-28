import React from "react";
import FloatingLabelInput from "@/components/floating-label-input";
import { Button } from "../ui/shadcn-button";

export default function EmployeeCard() {
  return (
    <div className="flex flex-col justify-right items-center border-[1px] border-primary bg-background rounded-lg p-4 gap-4">
      <div className="flex flex-col md:flex-row justify-start md:items-center gap-2 w-full">
        <FloatingLabelInput label="Name" value="" onChange={() => {}} />
        <FloatingLabelInput label="Email" value="" onChange={() => {}} />
      </div>
      <div className="flex justify-end items-center gap-2 w-full">
        <Button variant="outline" className="border-primary text-primary w-20">
          Cancel
        </Button>
        <Button variant="default" className=" text-white w-20">
          Invite
        </Button>
      </div>
    </div>
  );
}
