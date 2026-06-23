import { Dispatch } from "react";

// Types
import type { PageStageState } from "@/components/pages/types";
import type { TransitionEvent, TransitionEventType } from "./events";

export type TransitionPhase = "idle" | "animating";

export type ViewportMode = "static" | "fixed";

export type MenuState = "closed" | "opening" | "open" | "closing";

export type TransitionRequest = {
  type: TransitionEventType;
};

export type TransitionState = {
  phase: TransitionPhase;
  activePath: string;
  pendingPath: string | null;
  queuedPath: string | null;
  menuState: MenuState;
  viewport: {
    mode: ViewportMode;
    scroll: Partial<Record<PageStageState, number>>;
  };
  request: TransitionRequest | null;
  cleanup: Partial<
    Omit<TransitionState, "phase" | "request" | "cleanup">
  > | null;
  isLoaderVisible: boolean;
  isMobileViewport: boolean;
};

export type TransitionContextType = {
  state: TransitionState;
  dispatch: Dispatch<TransitionEvent>;
};

export interface TransitionProviderProps {
  children: React.ReactNode;
}
