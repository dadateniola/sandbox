// Types
import type { TransitionRuntime } from "../types";

// Imports
import {
  isMenuNavigation,
  createMenuNavigationTimeline,
} from "./menu-navigation";

import {
  isListToProjectNavigation,
  createListToProjectTimeline,
} from "./list-to-project";

import {
  isProjectToListNavigation,
  createProjectToListTimeline,
} from "./project-to-list";

import { createDefaultNavigationTimeline } from "./default";

// Utils
export const createNavigateTimeline = (ctx: TransitionRuntime) => {
  if (isMenuNavigation(ctx)) {
    return createMenuNavigationTimeline();
  }

  if (isListToProjectNavigation(ctx)) {
    return createListToProjectTimeline(ctx);
  }

  if (isProjectToListNavigation(ctx)) {
    return createProjectToListTimeline(ctx);
  }

  return createDefaultNavigationTimeline();
};
