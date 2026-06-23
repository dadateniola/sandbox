// Types
import type { TransitionRecipe } from "./types";
import type { TransitionRequest } from "../engine/types";

// Imports
import {
  getTargetParts,
  getLoaderTarget,
  getStageTargets,
  getProjectTargets,
  getMenuPanelTarget,
} from "../adapters/dom-targets";

import {
  applyExit,
  applyEnter,
  CLIP_PATHS,
  createBaseTimeline,
} from "../primitives/timeline-primitives";

import { runTimeline } from "../adapters/gsap-adapter";
import { isProjectDetailRoute, resolveRoute } from "@/components/global/data";

// Registry
const registry = (() => {
  const map = new Map<TransitionRequest["type"], TransitionRecipe>();

  const register = (recipe: TransitionRecipe) => {
    map.set(recipe.key, recipe);
  };

  register({
    key: "NAVIGATE",
    description: "Default page-to-page transition",
    run: async ({
      state: {
        viewport: { scroll },
        menuState,
        activePath,
        pendingPath,
      },
      dispatch,
    }) => {
      const menuPanel = getMenuPanelTarget();
      const { exiting, entering } = getStageTargets();

      const activeMatch = resolveRoute(activePath);
      const pendingMatch = resolveRoute(pendingPath);

      const activeProjectId = activeMatch?.params?.projectId;
      const pendingProjectId = pendingMatch?.params?.projectId;

      const isToProjectDetail = isProjectDetailRoute(pendingPath);
      const isFromProjectDetail = isProjectDetailRoute(activePath);

      const tl = createBaseTimeline();

      if (menuState === "open" || menuState === "closing") {
        tl.set(exiting, {
          autoAlpha: 0,
          pointerEvents: "none",
        });

        applyExit(tl, menuPanel);
        applyEnter(tl, entering);
      } else if (pendingProjectId && isToProjectDetail) {
        const { cardImage, heroImage } = getProjectTargets(pendingProjectId);

        if (!cardImage || !heroImage) {
          applyExit(tl, exiting);
          applyEnter(tl, entering);
        } else {
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
        }
      } else if (activeProjectId && isFromProjectDetail) {
        const { cardImage, heroImage } = getProjectTargets(activeProjectId);

        if (!cardImage || !heroImage) {
          applyExit(tl, exiting);
          applyEnter(tl, entering);
        } else {
          const cardRect = cardImage.getBoundingClientRect();
          const heroRect = heroImage.getBoundingClientRect();
          const { scrollContainer } = getTargetParts(entering);

          const currentScrollY = scroll.exiting || 0;
          const scrollHeight = scrollContainer?.scrollHeight || 0;

          const maxScrollY = scrollHeight - window.innerHeight;
          const desiredScrollY = currentScrollY + cardRect.top;
          const finalScrollY = Math.min(desiredScrollY, maxScrollY);

          const scrollDelta = finalScrollY - currentScrollY;
          const targetTop = cardRect.top - scrollDelta;

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
              top: `${targetTop}px`,
              left: `${cardRect.left}px`,
              width: `${cardRect.width}px`,
              height: `${cardRect.height}px`,
            })
            .set(clone, { zIndex: "-1" })
            .to(entering, { autoAlpha: 1, duration: 0.5, ease: "power1.out" })
            .add(() => {
              clone.remove();
            });
        }
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
