// Imports
import { getStageTargets } from "../adapters/dom-targets";
import { registerTransition } from "./transition-registry";

import {
  applyExit,
  applyEnter,
  createBaseTimeline,
} from "../primitives/timeline-primitives";

import { runTimeline } from "../adapters/gsap-adapter";

// Variables
let didRegister = false;

// Utils
export const registerDefaultTransitions = () => {
  if (didRegister) return;

  registerTransition({
    key: "NAVIGATE",
    description: "Default page-to-page transition",
    run: async () => {
      const { exiting, entering } = getStageTargets();
      const tl = createBaseTimeline();

      applyExit(tl, exiting);
      applyEnter(tl, entering);

      await runTimeline(tl);
    },
  });

  console.log("Transitions registered");
  didRegister = true;
};
