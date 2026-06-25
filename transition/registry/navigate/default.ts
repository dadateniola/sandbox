// Imports
import { getStageTargets } from "@/transition/adapters/dom-targets";

import {
  applyExit,
  applyEnter,
  createBaseTimeline,
} from "@/transition/primitives/timeline-primitives";

// Utils
export const createDefaultNavigationTimeline = () => {
  const { exiting, entering } = getStageTargets();

  const tl = createBaseTimeline();

  applyExit(tl, exiting);
  applyEnter(tl, entering);

  return tl;
};
