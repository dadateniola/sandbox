"use client";

import React from "react";

// Types
import type { PageWrapperProps } from "./types";

// Imports
import { cn } from "@/utils/cn";
import { useTransitionContext } from "@/transition/TransitionProvider";

const PageWrapper = React.forwardRef<HTMLDivElement, PageWrapperProps>(
  ({ state, children, className, ...props }, ref) => {
    // Hooks
    const {
      viewportState: { mode, scrollY },
    } = useTransitionContext();

    const shouldBeFixed = mode === "fixed";
    const ownsScrollOffset =
      shouldBeFixed && (state === "active" || state === "exiting");

    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(
          "w-full h-screen",
          shouldBeFixed ? "fixed" : "relative",
          {
            "z-2": state === "exiting",
            "z-1": state === "entering",
          },
          className,
        )}
        {...props}
      >
        <div
          data-overlay
          className="absolute z-2 inset-0 bg-bg-secondary pointer-events-none opacity-0 invisible"
        ></div>

        <div
          data-content
          className={cn(
            "z-1 w-full h-screen",
            shouldBeFixed ? "absolute" : "relative",
          )}
        >
          <div
            className={cn(
              state === "fixed"
                ? "size-full"
                : "w-full h-max px-4 lg:px-15 xl:px-35 bg-background",
            )}
            style={{
              transform: ownsScrollOffset
                ? `translateY(-${scrollY}px)`
                : undefined,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

PageWrapper.displayName = "PageWrapper";

export default PageWrapper;
