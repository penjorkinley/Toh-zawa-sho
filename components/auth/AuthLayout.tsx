import Image from "next/image";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full relative">
      {/* Image Section */}
      <div className="h-[40vh] w-full relative">
        <Image
          src="/auth-bg-img.svg"
          alt="Auth Header"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Form Section - Overlayed */}
      <div className="absolute w-full top-[35vh] bottom-0">
        <div className="w-full max-w-md mx-auto h-full">
          <div className="bg-white rounded-t-3xl px-6 py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
