import gsap from "gsap";

import type { CreateTransitionArgs } from "./transition-state";

import { CLIP_PATHS, TL_DEFAULTS } from "@/components/global/data";

export const createTransition = ({
  exiting,
  entering,
  options,
}: CreateTransitionArgs) => {
  const exContent = exiting.querySelector("[data-content]");
  const exOverlay = exiting.querySelector("[data-overlay]");

  const tl = gsap.timeline({ defaults: TL_DEFAULTS });

  tl.set(exiting, { clipPath: CLIP_PATHS.open });

  tl.to(exContent, { y: -window.innerHeight / 2, rotate: -7, scale: 1.3 })
    .to(exOverlay, { autoAlpha: 1 }, "<")
    .to(exiting, { clipPath: CLIP_PATHS.closed }, "<");

  if (!options?.skipEntering) {
    tl.from(
      entering,
      { y: window.innerHeight / 2, rotate: 7, scale: 1.3 },
      "<",
    );
  }

  return tl;
};
