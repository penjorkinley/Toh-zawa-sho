"use client";

import { useRouter } from "next/navigation";

export default function ClientBackButton() {
  const router = useRouter();

  return (
    <div className="absolute top-8 left-4 md:top-10 md:left-8 z-10">
      <button
        onClick={() => router.back()}
        className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Go back"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-700"
        >
          <path
            d="M15 19L8 12L15 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
