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
      type: "HIDE_LOADER";
    }
  | {
      type: "SET_MOBILE_VIEWPORT";
      isMobile: boolean;
    }
  | {
      type: "CLEANUP";
      state: Partial<TransitionState> | null;
    };

export type TransitionEventType = TransitionEvent["type"];
