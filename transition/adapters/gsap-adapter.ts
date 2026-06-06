import type gsap from "gsap";

/**
 * GSAP adapter keeps animation runtime concerns isolated from transition business logic.
 */
export const runTimeline = (timeline: gsap.core.Timeline): Promise<void> => {
  return new Promise((resolve, reject) => {
    timeline.eventCallback("onComplete", () => resolve());
    timeline.eventCallback("onInterrupt", () => {
      reject(new Error("Timeline interrupted"));
    });
    timeline.play(0);
  });
};
