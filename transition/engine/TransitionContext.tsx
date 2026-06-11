"use client";

import { createContext, useContext } from "react";

// Types
import type { TransitionContextType } from "./types";

// Context
export const TransitionContext = createContext<TransitionContextType | null>(
  null,
);

// Hook
export const useTransitionEngine = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error(
      "useTransitionEngine must be used inside TransitionProvider",
    );
  }
  return context;
};
