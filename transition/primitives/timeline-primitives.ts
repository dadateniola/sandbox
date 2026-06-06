import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { getTargetParts } from "../adapters/dom-targets";

gsap.registerPlugin(CustomEase);

const defaultEase = CustomEase.create(
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
      duration: 0.9,
      ease: defaultEase,
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
    tl.to(content, { y: -window.innerHeight / 3, rotate: -5, scale: 1.1 });
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
      y: window.innerHeight / 3,
      rotate: 5,
      scale: 1.1,
    },
    "<",
  );

  return tl;
};

export const fadeIn = (tl: gsap.core.Timeline, element: HTMLElement | null) => {
  if (!element) return tl;
  tl.fromTo(element, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45 });
  return tl;
};

export const fadeOut = (tl: gsap.core.Timeline, element: HTMLElement | null) => {
  if (!element) return tl;
  tl.to(element, { autoAlpha: 0, duration: 0.45 });
  return tl;
};
