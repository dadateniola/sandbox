"use client";

// Types
import type { PageStateProps } from "./types";

// Imports
import { cn } from "@/utils/cn";
import { useTransitionEngine } from "@/transition/engine/TransitionContext";

const PageState: React.FC<PageStateProps> = ({ children, stageState }) => {
  // Hooks
  const {
    state: { viewport },
  } = useTransitionEngine();

  // Render
  const shouldFixViewport = viewport.mode === "fixed" || stageState === "fixed";
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
        className={cn(
          "z-1 w-full h-screen",
          shouldFixViewport ? "absolute" : "relative",
        )}
      >
        <div
          className={cn(
            stageState === "fixed"
              ? "size-full"
              : "w-full h-max px-4 lg:px-15 xl:px-35 bg-background",
          )}
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

export default PageState;
