// Imports
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { getTargetParts } from "../adapters/dom-targets";

// GSAP Setup
gsap.registerPlugin(CustomEase);

// Constants
const DEFAULT_EASE = CustomEase.create(
  "v2-transition-ease",
  "M0,0 C0.173,0 0.242,0.036 0.322,0.13 0.401,0.223 0.412,0.373 0.465,0.512 0.508,0.628 0.515,0.833 0.621,0.925 0.694,0.989 0.869,1 1,1",
);

export const CLIP_PATHS = {
  open: "polygon(0 0, 100% 0, 100% 120%, 0% 100%)",
  closed: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)",
};

export const createBaseTimeline = () => {
  return gsap.timeline({
    paused: true,
    defaults: {
      duration: 1,
      ease: DEFAULT_EASE,
    },
  });
};

export const applyExit = (
  tl: gsap.core.Timeline,
  exiting: HTMLElement | null,
): gsap.core.Timeline => {
  if (!exiting) return tl;

  const { content, overlay } = getTargetParts(exiting);

  tl.set(exiting, { clipPath: CLIP_PATHS.open });

  if (content) {
    tl.to(content, { y: -window.innerHeight / 2, rotate: -7, scale: 1.3 });
  }

  if (overlay) {
    tl.to(overlay, { autoAlpha: 1 }, "<");
  }

  tl.to(exiting, { clipPath: CLIP_PATHS.closed }, "<");
  return tl;
};

export const applyEnter = (
  tl: gsap.core.Timeline,
  entering: HTMLElement | null,
): gsap.core.Timeline => {
  if (!entering) return tl;

  tl.from(
    entering,
    {
      y: window.innerHeight / 2,
      rotate: 7,
      scale: 1.3,
    },
    "<",
  );

  return tl;
};
