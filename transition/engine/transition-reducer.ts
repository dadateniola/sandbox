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

export const transitionReducer = (
  state: TransitionState,
  event: TransitionEvent,
): TransitionState => {
  const getState = (): TransitionState => {
    switch (event.type) {
      case "NAVIGATE": {
        return {
          ...state,
          phase: "preparing",
          pendingPath: event.to,
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
          phase: "preparing",
          menuState: "opening",
          viewport: { mode: "fixed", scrollY: event.scrollY },
          request: { type: event.type },
          cleanup: { menuState: "open" },
        };
      }
      case "MENU_CLOSE": {
        return {
          ...state,
          phase: "preparing",
          menuState: "closing",
          viewport: { mode: "fixed", scrollY: event.scrollY },
          request: { type: event.type },
          cleanup: {
            menuState: "closed",
            viewport: { mode: "static", scrollY: event.scrollY },
          },
        };
      }
      case "HIDE_LOADER": {
        return {
          ...state,
          phase: "preparing",
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

  const newState = getState();

  // console.log("State updated:", newState);

  return newState;
};
