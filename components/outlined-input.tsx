"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface FloatingLabelInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function FloatingLabelInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  required = false,
  disabled = false,
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full max-w-md">
      <motion.label
        animate={{
          y: isFocused || value ? -10 : 8,
          fontSize: isFocused || value ? "12px" : "16px",
          color: isFocused ? "#C78853" : "#6B7280",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute left-3 bg-white px-1 0"
      >
        {label}
      </motion.label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(value.length > 0)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`border-[1px] border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:ring-[1px] focus:border-primary ${className}`}
      />
    </div>
  );
}
