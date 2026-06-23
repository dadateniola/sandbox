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
    scroll: {},
  },
  request: null,
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

const cleanupReducer = (
  state: TransitionState,
  requestType: TransitionEvent["type"],
): TransitionState => {
  const getPatch = (): Partial<TransitionState> => {
    switch (requestType) {
      case "NAVIGATE":
        return {
          activePath: state.pendingPath || state.activePath,
          pendingPath: null,
          menuState: "closed",
          viewport: {
            mode: "static",
            scroll: { active: state.viewport.scroll.entering },
          },
        };
      case "MENU_OPEN":
        return {
          menuState: "open",
        };
      case "MENU_CLOSE":
        return {
          menuState: "closed",
          viewport: { ...state.viewport, mode: "static" },
        };
      case "HIDE_LOADER":
        return {
          isLoaderVisible: false,
          viewport: { mode: "static", scroll: {} },
        };
      default:
        return {};
    }
  };

  const patch = getPatch();

  return {
    ...state,
    ...patch,
    phase: "idle",
    request: null,
  };
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
        viewport: { mode: "fixed", scroll: { exiting: event.scrollY } },
        request: { type: event.type },
      };
    }
    case "MENU_OPEN": {
      return {
        ...state,
        phase: "animating",
        menuState: "opening",
        viewport: { mode: "fixed", scroll: { active: event.scrollY } },
        request: { type: event.type },
      };
    }
    case "MENU_CLOSE": {
      return {
        ...state,
        phase: "animating",
        menuState: "closing",
        request: { type: event.type },
      };
    }
    case "HIDE_LOADER": {
      return {
        ...state,
        phase: "animating",
        request: { type: event.type },
      };
    }
    case "SET_VIEWPORT": {
      return {
        ...state,
        viewport: {
          mode: event.mode || state.viewport.mode,
          scroll: event.replace
            ? event.scroll
            : { ...state.viewport.scroll, ...event.scroll },
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
      return cleanupReducer(state, event.requestType);
    }

    default:
      return state;
  }
};
