// Utils
export const runTimeline = (timeline: gsap.core.Timeline): Promise<void> => {
  return new Promise((resolve, reject) => {
    timeline.eventCallback("onComplete", () => resolve());
    timeline.eventCallback("onInterrupt", () => {
      reject(new Error("Timeline interrupted"));
    });
    timeline.play(0);
  });
};
