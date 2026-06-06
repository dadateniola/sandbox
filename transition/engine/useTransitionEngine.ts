"use client";

import { useContext } from "react";
import { TransitionContext } from "./TransitionContext";

/**
 * Public hook for all transition-aware modules.
 *
 * Why this file exists:
 * - It creates one ergonomic API surface for the engine.
 * - It guarantees the provider contract and throws early if wiring is wrong.
 */
export const useTransitionEngine = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransitionEngine must be used inside TransitionProvider");
  }
  return context;
};
