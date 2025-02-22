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
      <div className="text-center mb-8">
        <p className="text-primary text-2xl font-light mb-1">{title}</p>
        <p className="text-text/50 text-sm">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
