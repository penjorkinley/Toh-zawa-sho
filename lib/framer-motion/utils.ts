// lib/framer-motion/utils.ts
import type { SlideTransition, SlideVariants } from "@/lib/types/animations";
import { Dispatch, SetStateAction } from "react";

export const slideVariants: SlideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export const slideTransition: SlideTransition = {
  duration: 0.6,
  ease: "easeInOut",
};

export const useStepNavigation = (
  setStep: Dispatch<SetStateAction<number>>,
  setDirection: Dispatch<SetStateAction<number>>
) => {
  const handleNext = () => {
    setDirection(1);
    setStep(2);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(1);
  };

  return { handleNext, handleBack };
};
