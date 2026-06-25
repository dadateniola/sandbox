// Imports
import {
  getTargetParts,
  getStageTargets,
  getMenuPanelTarget,
} from "@/transition/adapters/dom-targets";

import {
  applyExit,
  CLIP_PATHS,
  createBaseTimeline,
} from "@/transition/primitives/timeline-primitives";

// Utils
export function createMenuOpenTimeline() {
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

  return tl;
}

export function createMenuCloseTimeline() {
  const menuPanel = getMenuPanelTarget();
  const { active } = getStageTargets();
  if (!menuPanel || !active) return;

  const tl = createBaseTimeline();

  applyExit(tl, menuPanel);

  tl.to(active, { y: 0, rotate: 0, scale: 1 }, "<").set(menuPanel, {
    autoAlpha: 0,
    pointerEvents: "none",
  });

  return tl;
}
