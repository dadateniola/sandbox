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
    mode: "static",
    scrollY: 0,
  },
  request: null,
  cleanup: null,
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
            viewport: { mode: "static", scrollY: 0 },
          },
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
