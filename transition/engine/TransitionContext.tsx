"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useReducer } from "react";

// Types
import type { TransitionContextType, TransitionProviderProps } from "./types";

// Imports
import {
  transitionReducer,
  createInitialTransitionState,
} from "./transition-reducer";

// Context
export const TransitionContext = createContext<TransitionContextType | null>(
  null,
);

// Provider
export const TransitionProvider: React.FC<TransitionProviderProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const [state, dispatch] = useReducer(
    transitionReducer,
    pathname,
    createInitialTransitionState,
  );

  return (
    <TransitionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransitionContext.Provider>
  );
};

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
