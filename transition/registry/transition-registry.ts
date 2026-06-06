import type { Dispatch } from "react";
import type { TransitionEvent } from "../engine/transition-events";
import type { TransitionRequest, TransitionState } from "../engine/transition-types";

export type TransitionRuntime = {
  request: TransitionRequest;
  state: TransitionState;
  dispatch: Dispatch<TransitionEvent>;
};

export type TransitionRecipe = {
  key: TransitionRequest["type"];
  description: string;
  run: (runtime: TransitionRuntime) => Promise<void>;
};

const registry = new Map<TransitionRequest["type"], TransitionRecipe>();

export const registerTransition = (recipe: TransitionRecipe) => {
  registry.set(recipe.key, recipe);
};

export const getTransition = (key: TransitionRequest["type"]): TransitionRecipe => {
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
