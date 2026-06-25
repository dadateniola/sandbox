// Types
import type { TransitionRuntime } from "../types";

// Imports
import {
  getStageTargets,
  getMenuPanelTarget,
} from "@/transition/adapters/dom-targets";

import {
  applyExit,
  applyEnter,
  createBaseTimeline,
} from "@/transition/primitives/timeline-primitives";

// Helpers
export const isMenuNavigation = (ctx: TransitionRuntime) => {
  const { menuState } = ctx.state;
  return menuState === "open" || menuState === "closing";
};

// Utils
export const createMenuNavigationTimeline = () => {
  const menuPanel = getMenuPanelTarget();
  const { exiting, entering } = getStageTargets();

  const tl = createBaseTimeline();

  tl.set(exiting, {
    autoAlpha: 0,
    pointerEvents: "none",
  });

  applyExit(tl, menuPanel);
  applyEnter(tl, entering);

  return tl;
};
