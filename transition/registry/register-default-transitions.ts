import { registerTransition } from "./transition-registry";
import {
  applyEnter,
  applyExit,
  createBaseTimeline,
  fadeIn,
  fadeOut,
  CLIP_PATHS,
} from "../primitives/timeline-primitives";
import {
  getLoaderTarget,
  getMenuPanelTarget,
  getStageTargets,
} from "../adapters/dom-targets";
import { runTimeline } from "../adapters/gsap-adapter";

let didRegister = false;

export const registerDefaultTransitions = () => {
  if (didRegister) return;

  registerTransition({
    key: "page-default",
    description: "Default page-to-page transition",
    run: async () => {
      const { exiting, entering } = getStageTargets();
      const tl = createBaseTimeline();

      applyExit(tl, exiting);
      applyEnter(tl, entering);

      await runTimeline(tl);
    },
  });

  registerTransition({
    key: "menu-open",
    description: "Reveal full-screen menu panel",
    run: async () => {
      const menuPanel = getMenuPanelTarget();
      const { active } = getStageTargets();

      const tl = createBaseTimeline();

      if (menuPanel) {
        tl.set(menuPanel, {
          autoAlpha: 1,
          pointerEvents: "auto",
          clipPath: CLIP_PATHS.closed,
        });
        tl.to(menuPanel, { clipPath: CLIP_PATHS.open });
      }

      if (active) {
        tl.to(active, { y: window.innerHeight / 4, scale: 1.04 }, "<");
      }

      await runTimeline(tl);
    },
  });

  registerTransition({
    key: "menu-close",
    description: "Hide full-screen menu panel",
    run: async () => {
      const menuPanel = getMenuPanelTarget();
      const { active } = getStageTargets();

      const tl = createBaseTimeline();

      if (menuPanel) {
        tl.to(menuPanel, { clipPath: CLIP_PATHS.closed });
        tl.set(menuPanel, { autoAlpha: 0, pointerEvents: "none" });
      }

      if (active) {
        tl.to(active, { y: 0, scale: 1 }, "<");
      }

      await runTimeline(tl);
    },
  });

  registerTransition({
    key: "loader-to-page",
    description: "Fade and lift loader out while showing page",
    run: async () => {
      const loader = getLoaderTarget();
      const { active } = getStageTargets();
      const tl = createBaseTimeline();

      fadeIn(tl, active);

      if (loader) {
        tl.to(loader, { y: -window.innerHeight / 4, scale: 1.05 }, "<");
        fadeOut(tl, loader);
      }

      await runTimeline(tl);
    },
  });

  didRegister = true;
};
