import type { TransitionEvent } from "./transition-events";
import type { TransitionState } from "./transition-types";

/**
 * State machine gatekeeper.
 *
 * Why this file exists:
 * - Reducers are great for state changes, but they do not communicate intent constraints by themselves.
 * - This machine centralizes legal event/phase combinations and protects the engine from impossible flows.
 *
 * What this file should never do:
 * - It should never mutate state.
 * - It should never run animations.
 */
export const canProcessEvent = (
  state: TransitionState,
  event: TransitionEvent,
): boolean => {
  switch (event.type) {
    case "NAVIGATE_REQUEST":
      return true;
    case "MENU_OPEN_REQUEST":
      return state.menuState === "closed" && state.phase === "idle";
    case "MENU_CLOSE_REQUEST":
      return state.menuState === "open" && state.phase === "idle";
    case "LOADER_COMPLETE_REQUEST":
      return state.isLoaderVisible && state.phase === "idle";
    case "SET_MOBILE_VIEWPORT":
      return true;
    case "SET_MENU_STATE":
      return true;
    case "PHASE_CHANGED":
      return state.request !== null;
    case "TRANSITION_COMPLETE":
      return state.request !== null;
    case "TRANSITION_FAILED":
      return state.request !== null;
    default:
      return false;
  }
};
