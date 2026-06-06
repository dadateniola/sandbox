import { createContext } from "react";
import type { Dispatch } from "react";
import type { TransitionEvent } from "./transition-events";
import type { TransitionState } from "./transition-types";

export type TransitionEngineApi = {
  state: TransitionState;
  dispatch: Dispatch<TransitionEvent>;
  actions: {
    requestNavigation: (to: string, source?: "url" | "ui" | "system") => void;
    requestMenuOpen: () => void;
    requestMenuClose: () => void;
    requestLoaderComplete: () => void;
  };
};

export const TransitionContext = createContext<TransitionEngineApi | null>(null);
