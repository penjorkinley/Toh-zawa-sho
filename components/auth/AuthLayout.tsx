import Image from "next/image";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full relative">
      <div className="h-[40vh] w-full relative">
        <Image
          src="/auth-bg-img.svg"
          alt="Auth Header"
          fill
          className="object-cover lg:w-20 lg:h-20"
          sizes="100vw"
          priority
        />
      </div>

      <div className="absolute w-full top-[35vh] bottom-0 lg:top-[20vh]">
        <div className="w-full sm:max-w-[480px] md:max-w-[540px] lg:max-w-[600px] mx-auto h-full">
          <div className="bg-white shadow-md rounded-t-3xl px-6 sm:px-8 md:px-10 py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
