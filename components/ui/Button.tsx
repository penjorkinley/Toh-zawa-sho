import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-primary text-buttonText py-3 sm:py-3.5 rounded-lg font-medium transition-all duration-300 hover:bg-opacity-90 ${className}`}
    >
      {children}
    </button>
  );
}
