// Types
import type { TransitionState } from "./types";
import type { Page } from "@/components/global/types";
import type { PageStageState } from "@/components/pages/types";

// Utils
export const selectRenderedPaths = (state: TransitionState) => {
  const paths = [state.activePath, state.pendingPath].filter((p): p is Page =>
    Boolean(p),
  );
  return [...new Set(paths)];
};

export const selectStageState = (
  state: TransitionState,
  path: string,
): PageStageState => {
  if (!state.pendingPath) {
    return path === state.activePath ? "active" : "inactive";
  }

  if (path === state.activePath) return "exiting";
  if (path === state.pendingPath) return "entering";
  return "inactive";
};
