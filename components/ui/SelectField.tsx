import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  className?: string;
}

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  className = "",
}: SelectFieldProps) {
  return (
    <div className={`mb-5 ${className}`}>
      <label className="text-text font-normal block mb-2 sm:mb-3">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full appearance-none px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg border bg-white
            ${error ? "border-red-500" : "border-text/40"}
            focus:outline-none focus:border-primary text-text font-normal`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
