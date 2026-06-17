// Types
import type { TransitionState } from "./types";
import type { TransitionEvent } from "./events";

// Utils
export const createInitialTransitionState = (
  pathname: string,
): TransitionState => ({
  phase: "idle",
  activePath: pathname,
  pendingPath: null,
  queuedPath: null,
  menuState: "closed",
  viewport: {
    mode: "fixed",
    scrollY: 0,
  },
  request: null,
  cleanup: null,
  isLoaderVisible: true,
  isMobileViewport: false,
});

const canProcessEvent = (
  state: TransitionState,
  event: TransitionEvent,
): boolean => {
  switch (event.type) {
    case "NAVIGATE": {
      const isTransitioning = state.phase !== "idle";

      if (isTransitioning) return event.to !== state.pendingPath;

      return event.to !== state.activePath && event.to !== state.pendingPath;
    }
    case "MENU_OPEN":
      return (
        state.menuState !== "opening" &&
        state.menuState !== "closing" &&
        state.phase !== "animating"
      );
    case "MENU_CLOSE":
      return (
        state.menuState !== "opening" &&
        state.menuState !== "closing" &&
        state.phase !== "animating"
      );
    default:
      return true;
  }
};

export const transitionReducer = (
  state: TransitionState,
  event: TransitionEvent,
): TransitionState => {
  if (!canProcessEvent(state, event)) {
    return state;
  }

  switch (event.type) {
    case "NAVIGATE": {
      if (state.phase !== "idle") {
        return { ...state, queuedPath: event.to };
      }

      return {
        ...state,
        phase: "animating",
        pendingPath: event.to,
        menuState: state.menuState === "open" ? "closing" : state.menuState,
        viewport: { mode: "fixed", scrollY: event.scrollY },
        request: { type: event.type },
        cleanup: {
          activePath: event.to,
          pendingPath: null,
          menuState: "closed",
          viewport: { mode: "static", scrollY: 0 },
        },
      };
    }
    case "MENU_OPEN": {
      return {
        ...state,
        phase: "animating",
        menuState: "opening",
        viewport: { mode: "fixed", scrollY: event.scrollY },
        request: { type: event.type },
        cleanup: { menuState: "open" },
      };
    }
    case "MENU_CLOSE": {
      return {
        ...state,
        phase: "animating",
        menuState: "closing",
        viewport: { mode: "fixed", scrollY: state.viewport.scrollY },
        request: { type: event.type },
        cleanup: {
          menuState: "closed",
          viewport: { mode: "static", scrollY: state.viewport.scrollY },
        },
      };
    }
    case "HIDE_LOADER": {
      return {
        ...state,
        phase: "animating",
        request: { type: event.type },
        cleanup: {
          isLoaderVisible: false,
          viewport: { mode: "static", scrollY: 0 },
        },
      };
    }
    case "SET_MOBILE_VIEWPORT": {
      return {
        ...state,
        isMobileViewport: event.isMobile,
      };
    }
    case "CLEANUP": {
      return {
        ...state,
        ...event.state,
        phase: "idle",
        request: null,
        cleanup: null,
      };
    }

    default:
      return state;
  }
};
