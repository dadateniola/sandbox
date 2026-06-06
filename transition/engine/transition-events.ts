import type { TransitionTypeKey, MenuState } from "./transition-types";

export type TransitionEvent =
  | {
      type: "NAVIGATE_REQUEST";
      to: string;
      source: "url" | "ui" | "system";
      scrollY: number;
      transitionType?: TransitionTypeKey;
    }
  | {
      type: "MENU_OPEN_REQUEST";
      source: "ui" | "system";
      scrollY: number;
    }
  | {
      type: "MENU_CLOSE_REQUEST";
      source: "ui" | "system";
      scrollY: number;
    }
  | {
      type: "LOADER_COMPLETE_REQUEST";
      source: "system";
    }
  | {
      type: "SET_MOBILE_VIEWPORT";
      isMobile: boolean;
    }
  | {
      type: "PHASE_CHANGED";
      phase: "preparing" | "exiting" | "switching" | "entering" | "settling" | "completed";
      message: string;
    }
  | {
      type: "TRANSITION_COMPLETE";
      message: string;
    }
  | {
      type: "TRANSITION_FAILED";
      error: string;
    }
  | {
      type: "SET_MENU_STATE";
      menuState: MenuState;
      message: string;
    };
