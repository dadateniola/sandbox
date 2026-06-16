"use client";

import { useReducer } from "react";
import { usePathname } from "next/navigation";

// Types
import type { TransitionProviderProps } from "./types";

// Imports
import {
  transitionReducer,
  createInitialTransitionState,
} from "./transition-reducer";
import { TransitionContext } from "./TransitionContext";

const TransitionProvider: React.FC<TransitionProviderProps> = ({
  children,
}) => {
  // Hooks
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

export default TransitionProvider;
