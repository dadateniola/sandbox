// Types
import type { TransitionState } from "./types";

export type TransitionEvent =
  | {
      type: "NAVIGATE";
      to: string;
      scrollY: number;
    }
  | {
      type: "MENU_OPEN";
      scrollY: number;
    }
  | {
      type: "MENU_CLOSE";
      scrollY: number;
    }
  | {
      type: "CLEANUP";
      state: Partial<TransitionState> | null;
    };

export type TransitionEventType = TransitionEvent["type"];
