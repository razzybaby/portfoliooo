"use client";

import { MotionConfig } from "motion/react";

// reducedMotion="user": motion animations switch off when the OS asks for reduced motion.
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
