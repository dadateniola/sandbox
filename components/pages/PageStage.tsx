"use client";

import { cn } from "@/utils/cn";
import { useTransitionEngine } from "@/transition/engine/useTransitionEngine";

export type PageStageState = "active" | "exiting" | "entering" | "inactive";

/**
 * Page stage is a render primitive for transition targets.
 *
 * Why this file exists:
 * - It gives transitions stable DOM anchors through data attributes.
 * - It keeps animation-specific wrappers out of business page components.
 *
 * What this file should never do:
 * - It should never dispatch transition events.
 * - It should never decide which page is active.
 */
export const PageStage = ({
  stageState,
  children,
}: {
  stageState: PageStageState;
  children: React.ReactNode;
}) => {
  const {
    state: { viewport },
  } = useTransitionEngine();

  const shouldFixViewport = viewport.mode === "fixed";
  const applyScrollOffset =
    shouldFixViewport && (stageState === "active" || stageState === "exiting");

  return (
    <div
      data-transition-role="page-stage"
      data-stage-state={stageState}
      className={cn(
        "w-full h-screen",
        shouldFixViewport ? "fixed" : "relative",
        {
          "z-2": stageState === "exiting",
          "z-1": stageState === "entering",
        },
      )}
    >
      <div
        data-transition-role="overlay"
        className="absolute inset-0 z-2 bg-bg-secondary pointer-events-none invisible opacity-0"
      />

      <div
        data-transition-role="content"
        className={cn("w-full h-screen", shouldFixViewport ? "absolute" : "relative")}
      >
        <div
          className="w-full h-max px-4 lg:px-15 xl:px-35 bg-background"
          style={{
            transform: applyScrollOffset
              ? `translateY(-${viewport.scrollY}px)`
              : undefined,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
