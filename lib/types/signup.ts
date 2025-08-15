// lib/types/signup.ts
import type { SlideTransition, SlideVariants } from "@/lib/types/animations";
import type { SignupFormData } from "@/lib/validations/auth/signup";

export interface FirstStepSignupProps {
  formData: SignupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => void;
  direction: number;
  slideVariants: SlideVariants;
  slideTransition: SlideTransition;
}

export interface SecondStepSignupProps {
  formData: SignupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBack: () => void;
  handleSubmit: () => void;
  direction: number;
  slideVariants: SlideVariants;
  slideTransition: SlideTransition;
}
