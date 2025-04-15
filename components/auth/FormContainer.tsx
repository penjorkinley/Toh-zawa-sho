import { ReactNode } from "react";

interface FormContainerProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function FormContainer({
  title,
  subtitle,
  children,
}: FormContainerProps) {
  return (
    <div className="w-full py-6 sm:py-8 lg:py-10">
      <div className="text-center mb-8 sm:mb-10 lg:mb-8 w-full">
        <p className="text-primary text-2xl sm:text-3xl md:text-4xl font-light mb-2 sm:mb-3">
          {title}
        </p>
        <p className="text-text/60 text-sm sm:text-base mx-auto">{subtitle}</p>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
