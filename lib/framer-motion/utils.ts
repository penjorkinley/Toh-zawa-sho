import { Dispatch, SetStateAction } from "react";

export const slideVariants = {
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

export const slideTransition = {
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