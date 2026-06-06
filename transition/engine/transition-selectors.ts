import type { TransitionState } from "./transition-types";

/**
 * Selector layer keeps component rendering logic simple and repeatable.
 *
 * Why this file exists:
 * - Components should not duplicate conditional phase logic.
 * - Selectors make state interpretation explicit and testable.
 */
export const selectRenderedPaths = (state: TransitionState): string[] => {
  const paths = [state.activePath, state.pendingPath].filter(Boolean) as string[];
  return [...new Set(paths)];
};

export const selectStageState = (
  state: TransitionState,
  path: string,
): "active" | "exiting" | "entering" | "inactive" => {
  if (!state.pendingPath) {
    return path === state.activePath ? "active" : "inactive";
  }

  if (path === state.activePath) return "exiting";
  if (path === state.pendingPath) return "entering";
  return "inactive";
};

export const selectHasActiveRequest = (state: TransitionState): boolean => {
  return state.request !== null;
};

export const selectCanInteract = (state: TransitionState): boolean => {
  return state.phase === "idle";
};
