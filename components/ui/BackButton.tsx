import React from "react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  onClick?: () => void;
  title: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, title }) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (typeof window !== "undefined" && router) {
      router.back();
    }
  };

  return (
    <div className="relative flex items-center w-full mb-6 sm:mb-8">
      <button
        onClick={handleClick}
        className="absolute left-0 flex items-center justify-center py-2"
      >
        <svg
          className="h-6 w-6 sm:h-7 sm:w-7"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <span className="flex-1 text-lg sm:text-xl font-bold text-center text-primary">
        {title}
      </span>
    </div>
  );
};

export default BackButton;
