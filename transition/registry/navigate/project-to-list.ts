// Types
import type { TransitionRuntime } from "../types";

// Imports
import { getProjectIdFromPath } from "./list-to-project";
import { isProjectDetailRoute } from "@/components/global/data";
import { createBaseTimeline } from "@/transition/primitives/timeline-primitives";

import {
  getTargetParts,
  getStageTargets,
  getProjectTargets,
} from "@/transition/adapters/dom-targets";

import { createDefaultNavigationTimeline } from "./default";

// Helpers
export const isProjectToListNavigation = (ctx: TransitionRuntime) => {
  const { activePath } = ctx.state;
  const activeProjectId = getProjectIdFromPath(activePath);
  const isFromProjectDetail = isProjectDetailRoute(activePath);

  return Boolean(activeProjectId && isFromProjectDetail);
};

// Utils
export const createProjectToListTimeline = (ctx: TransitionRuntime) => {
  const {
    state: { activePath },
    dispatch,
  } = ctx;

  const tl = createBaseTimeline();
  const { exiting, entering } = getStageTargets();
  const activeProjectId = getProjectIdFromPath(activePath);
  const { cardImage, heroImage } = getProjectTargets(activeProjectId);

  const hasScrolledPastHero =
    (heroImage?.getBoundingClientRect().bottom || 1) < 0;

  if (!cardImage || !heroImage || hasScrolledPastHero) {
    return createDefaultNavigationTimeline();
  }

  const cardRect = cardImage.getBoundingClientRect();
  const heroRect = heroImage.getBoundingClientRect();
  const { scrollContainer } = getTargetParts(entering);

  const scrollHeight = scrollContainer?.scrollHeight || 0;

  const maxScrollY = scrollHeight - window.innerHeight;

  const viewportHeight = window.innerHeight;

  const preferredTargetTop =
    cardRect.height >= viewportHeight * 0.8
      ? viewportHeight * 0.1
      : (viewportHeight - cardRect.height) / 2;

  const desiredScrollY = cardRect.top - preferredTargetTop;

  const finalScrollY = Math.min(desiredScrollY, maxScrollY);

  const actualTargetTop = cardRect.top - finalScrollY;

  dispatch({
    type: "SET_VIEWPORT",
    scroll: { entering: finalScrollY },
  });

  const clone = cardImage.cloneNode(true) as HTMLElement;

  Object.assign(clone.style, {
    position: "fixed",
    top: `${heroRect.top}px`,
    left: `${heroRect.left}px`,
    width: `${heroRect.width}px`,
    height: `${heroRect.height}px`,
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
      top: `${actualTargetTop}px`,
      left: `${cardRect.left}px`,
      width: `${cardRect.width}px`,
      height: `${cardRect.height}px`,
    })
    .set(clone, { zIndex: "-1" })
    .to(entering, { autoAlpha: 1, duration: 0.5, ease: "power1.out" })
    .add(() => {
      clone.remove();
    });

  return tl;
};
