// Types
import type { TransitionRecipe } from "./types";
import type { TransitionRequest } from "../engine/types";

// Registry
const registry = new Map<TransitionRequest["type"], TransitionRecipe>();

// Utils
export const registerTransition = (recipe: TransitionRecipe) => {
  registry.set(recipe.key, recipe);
};

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
