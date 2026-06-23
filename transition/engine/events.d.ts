// Types
import type { TransitionState, ViewportMode } from "./types";

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
      type: "SET_VIEWPORT";
      mode?: ViewportMode;
      scroll: TransitionState["viewport"]["scroll"];
      replace?: boolean;
    }
  | {
      type: "SET_MOBILE_VIEWPORT";
      isMobile: boolean;
    }
  | {
      type: "CLEANUP";
      requestType: TransitionEvent["type"];
    };

export type TransitionEventType = TransitionEvent["type"];
