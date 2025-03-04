import { useState } from "react";

interface InputFieldProps {
  type: string;
  placeholder?: string;
  label: string;
  name: string;
  value?: string | number | readonly string[] | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  error?: string | string[] | null;
}

export default function InputField({
  type,
  placeholder,
  label,
  name,
  value,
  onChange,
  className = "",
  error,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`mb-5 sm:mb-6 ${className}`}>
      <label className="text-text font-normal block mb-2 sm:mb-3 text-sm sm:text-base">
        {label}
      </label>
      <div className="relative">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={type !== "file" ? placeholder : undefined}
          name={name}
          defaultValue={type !== "file" ? value || "" : undefined}
          onChange={onChange}
          className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg border text-sm sm:text-base border-text/40 focus:outline-none focus:border-primary text-text font-normal placeholder-text/50 pr-10 ${
            error
              ? "border-red-500 focus:ring-red-500/20"
              : "border-text/40 focus:border-primary"
          }`}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-text/40 hover:text-text/60 focus:outline-none"
          >
            {showPassword ? (
              // Open eye icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              // Closed eye icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
