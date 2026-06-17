// Types
import type { TransitionRecipe } from "./types";
import type { TransitionRequest } from "../engine/types";

// Imports
import {
  getTargetParts,
  getLoaderTarget,
  getStageTargets,
  getMenuPanelTarget,
} from "../adapters/dom-targets";

import {
  applyExit,
  applyEnter,
  CLIP_PATHS,
  createBaseTimeline,
} from "../primitives/timeline-primitives";

import { runTimeline } from "../adapters/gsap-adapter";

// Registry
const registry = (() => {
  const map = new Map<TransitionRequest["type"], TransitionRecipe>();

  const register = (recipe: TransitionRecipe) => {
    map.set(recipe.key, recipe);
  };

  register({
    key: "NAVIGATE",
    description: "Default page-to-page transition",
    run: async ({ state: { menuState } }) => {
      const menuPanel = getMenuPanelTarget();
      const { exiting, entering } = getStageTargets();

      const tl = createBaseTimeline();

      if (menuState === "open" || menuState === "closing") {
        tl.set(exiting, {
          autoAlpha: 0,
          pointerEvents: "none",
        });

        applyExit(tl, menuPanel);
        applyEnter(tl, entering);
      } else {
        applyExit(tl, exiting);
        applyEnter(tl, entering);
      }

      await runTimeline(tl);
    },
  });

  register({
    key: "MENU_OPEN",
    description: "Reveal full-screen menu panel",
    run: async () => {
      const menuPanel = getMenuPanelTarget();
      const { active } = getStageTargets();
      if (!menuPanel || !active) return;

      const { content, overlay } = getTargetParts(menuPanel);

      const tl = createBaseTimeline();

      tl.set(menuPanel, {
        clipPath: CLIP_PATHS.closed,
        autoAlpha: 1,
        pointerEvents: "auto",
      });

      tl.from(content, {
        y: -window.innerHeight / 2,
        rotate: -7,
        scale: 1.3,
      })
        .from(overlay, { autoAlpha: 1 }, "<")
        .to(menuPanel, { clipPath: CLIP_PATHS.open }, "<")
        .to(active, { y: window.innerHeight / 2, rotate: 7, scale: 1.3 }, "<");

      await runTimeline(tl);
    },
  });

  register({
    key: "MENU_CLOSE",
    description: "Hide full-screen menu panel",
    run: async () => {
      const menuPanel = getMenuPanelTarget();
      const { active } = getStageTargets();
      if (!menuPanel || !active) return;

      const tl = createBaseTimeline();

      applyExit(tl, menuPanel);

      tl.to(active, { y: 0, rotate: 0, scale: 1 }, "<").set(menuPanel, {
        autoAlpha: 0,
        pointerEvents: "none",
      });

      await runTimeline(tl);
    },
  });

  register({
    key: "HIDE_LOADER",
    description: "Hide full-screen loader overlay",
    run: async () => {
      const loader = getLoaderTarget();
      const { active } = getStageTargets();
      if (!loader || !active) return;

      const tl = createBaseTimeline();

      applyExit(tl, loader);
      applyEnter(tl, active);

      await runTimeline(tl);
    },
  });

  return map;
})();

// Utils
export const getTransition = (
  key: TransitionRequest["type"],
): TransitionRecipe => {
  const transition = registry.get(key);
  if (!transition) {
    throw new Error(`No transition recipe registered for ${key}`);
  }
  return transition;
};

export const hasTransition = (key: TransitionRequest["type"]): boolean => {
  return registry.has(key);
};

export const listTransitions = (): string[] => {
  return [...registry.keys()];
};
