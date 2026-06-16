// Types
import type { TransitionState } from "./types";
import type { TransitionEvent } from "./events";

// Utils
export const canProcessEvent = (
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
