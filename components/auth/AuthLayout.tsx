import Image from "next/image";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full relative flex flex-col lg:flex-row">
      {/* Background/Image Section */}
      <div className="h-[40vh] w-full relative lg:h-screen lg:w-1/2 xl:w-3/5">
        <Image
          src="/auth-bg-img.svg"
          alt="Auth Header"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Form Section */}
      <div className="absolute w-full top-[35vh] bottom-0 lg:static lg:w-1/2 xl:w-2/5 lg:h-screen lg:flex lg:items-center lg:justify-center">
        <div className="w-full lg:flex lg:justify-center">
          <div className="w-full sm:max-w-[480px] md:max-w-[540px] lg:max-w-[500px] xl:max-w-[550px] bg-white shadow-md rounded-t-3xl px-6 sm:px-8 md:px-10 py-8 lg:py-4 lg:bg-transparent lg:shadow-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
