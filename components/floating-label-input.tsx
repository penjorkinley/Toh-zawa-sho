"use client";
import { useState, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingLabelInput = forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(({ label, error, className, onFocus, onBlur, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = Boolean(props.value);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // if (!hasValue) {
    setIsFocused(true);
    // }

    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!hasValue) {
      setIsFocused(false);
    }
    onBlur?.(e);
  };

  return (
    <div className="relative w-full">
      <motion.label
        animate={{
          y: isFocused || hasValue ? -22 : 0,
          scale: isFocused || hasValue ? 0.85 : 1,
          color: isFocused ? "#C78853" : error ? "#EF4444" : "#6B7280",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute left-3 top-2 bg-white px-1 pointer-events-none origin-[0%_50%]"
      >
        {label}
      </motion.label>
      <Input
        ref={ref}
        className={`border-[1px] border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:ring-[1px] focus:border-primary ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
        } ${className || ""}`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-500 mt-1 block">{error}</span>
      )}
    </div>
  );
});

FloatingLabelInput.displayName = "FloatingLabelInput";

export default FloatingLabelInput;
