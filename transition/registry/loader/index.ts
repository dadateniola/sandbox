// Imports
import {
  getLoaderTarget,
  getStageTargets,
} from "@/transition/adapters/dom-targets";

import {
  applyExit,
  applyEnter,
  createBaseTimeline,
} from "@/transition/primitives/timeline-primitives";

// Utils
export const createHideLoaderTimeline = () => {
  const loader = getLoaderTarget();
  const { active } = getStageTargets();
  if (!loader || !active) return;

  const tl = createBaseTimeline();

  applyExit(tl, loader);
  applyEnter(tl, active);

  return tl;
};
