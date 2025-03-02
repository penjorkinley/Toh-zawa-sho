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
    <div className="w-full">
      <div className="text-center mb-8 sm:mb-10">
        <p className="text-primary text-2xl sm:text-3xl md:text-4xl font-light mb-1 sm:mb-2">
          {title}
        </p>
        <p className="text-text/50 text-sm sm:text-base">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
