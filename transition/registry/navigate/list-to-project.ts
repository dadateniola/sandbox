// Types
import type { TransitionRuntime } from "../types";

// Imports
import {
  getStageTargets,
  getProjectTargets,
} from "@/transition/adapters/dom-targets";

import { createDefaultNavigationTimeline } from "./default";
import { isProjectDetailRoute, resolveRoute } from "@/components/global/data";
import { createBaseTimeline } from "@/transition/primitives/timeline-primitives";

// Helpers
export const getProjectIdFromPath = (
  path: string | null,
): string | undefined => {
  const match = resolveRoute(path);
  return match?.params?.projectId;
};

export const isListToProjectNavigation = (ctx: TransitionRuntime) => {
  const { pendingPath } = ctx.state;
  const pendingProjectId = getProjectIdFromPath(pendingPath);
  const isToProjectDetail = isProjectDetailRoute(pendingPath);

  return Boolean(pendingProjectId && isToProjectDetail);
};

// Utils
export const createListToProjectTimeline = (ctx: TransitionRuntime) => {
  const { pendingPath } = ctx.state;

  const tl = createBaseTimeline();
  const { exiting, entering } = getStageTargets();
  const pendingProjectId = getProjectIdFromPath(pendingPath);
  const { cardImage, heroImage } = getProjectTargets(pendingProjectId);

  if (!cardImage || !heroImage) {
    return createDefaultNavigationTimeline();
  }

  const cardRect = cardImage.getBoundingClientRect();
  const heroRect = heroImage.getBoundingClientRect();

  const clone = cardImage.cloneNode(true) as HTMLElement;

  Object.assign(clone.style, {
    position: "fixed",
    top: `${cardRect.top}px`,
    left: `${cardRect.left}px`,
    width: `${cardRect.width}px`,
    height: `${cardRect.height}px`,
    zIndex: "1",
    pointerEvents: "none",
  });

  document.body.appendChild(clone);

  tl.set(entering, { autoAlpha: 0 });

  tl.to(exiting, {
    autoAlpha: 0,
    pointerEvents: "none",
    duration: 0.5,
    ease: "power1.out",
  })
    .to(clone, {
      top: `${heroRect.top}px`,
      left: `${heroRect.left}px`,
      width: `${heroRect.width}px`,
      height: `${heroRect.height}px`,
    })
    .set(clone, { zIndex: "-1" })
    .to(entering, { autoAlpha: 1, duration: 0.5, ease: "power1.out" })
    .add(() => {
      clone.remove();
    });

  return tl;
};
