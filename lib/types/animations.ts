// lib/types/animations.ts
export interface SlideVariants {
  enter: (direction: number) => { x: number; opacity: number };
  center: { zIndex: number; x: number; opacity: number };
  exit: (direction: number) => { zIndex: number; x: number; opacity: number };
}

export interface SlideTransition {
  duration: number;
  ease: string;
}
