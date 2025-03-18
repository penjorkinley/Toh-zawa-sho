"use client";
import React, { useState } from "react";
import OutlinedInput from "@/components/outlined-input";

export default function MenuSetupPage() {
  const [value, setValue] = useState("");

  return (
    <div>
      <OutlinedInput label="Menu Name" value={value} onChange={setValue} />
    </div>
  );
}
