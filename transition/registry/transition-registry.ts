// Types
import type { TransitionRecipe } from "./types";
import type { TransitionRequest } from "../engine/types";

// Imports
import { createHideLoaderTimeline } from "./loader";
import { createNavigateTimeline } from "./navigate";
import { runTimeline } from "../adapters/gsap-adapter";
import { createMenuCloseTimeline, createMenuOpenTimeline } from "./menu";

// Registry
const registry = (() => {
  const map = new Map<TransitionRequest["type"], TransitionRecipe>();

  const register = (recipe: TransitionRecipe) => {
    map.set(recipe.key, recipe);
  };

  register({
    key: "NAVIGATE",
    description: "Default page-to-page transition",
    run: async (ctx) => {
      const tl = createNavigateTimeline(ctx);
      await runTimeline(tl);
    },
  });

  register({
    key: "MENU_OPEN",
    description: "Reveal full-screen menu panel",
    run: async () => {
      const tl = createMenuOpenTimeline();
      await runTimeline(tl);
    },
  });

  register({
    key: "MENU_CLOSE",
    description: "Hide full-screen menu panel",
    run: async () => {
      const tl = createMenuCloseTimeline();
      await runTimeline(tl);
    },
  });

  register({
    key: "HIDE_LOADER",
    description: "Hide full-screen loader overlay",
    run: async () => {
      const tl = createHideLoaderTimeline();
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
