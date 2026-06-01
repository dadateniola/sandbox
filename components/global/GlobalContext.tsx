"use client";

import { createContext, useContext } from "react";

// Types
import type { GlobalContextType } from "./types";

// Context
export const GlobalContext = createContext<GlobalContextType | null>(null);

// Hook
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
