import React from "react";

// Types
import type { CTAProps, PageWrapperProps } from "./types";

// Imports
import { cn } from "@/utils/cn";

// Components
export const PageLoader: React.FC = () => (
  <div className="fixed z-10 inset-0 custom-flex-center bg-background overflow-hidden">
    <div
      className={cn(
        "custom-flex-col gap-5",
        "text-text-primary text-3xl text-center leading-[90%] tracking-[-0.6px] uppercase",
      )}
    >
      <p>Jacob</p>
      <p>Grønberg</p>
    </div>
  </div>
);

export const PageMobile: React.FC = () => (
  <div className="w-full h-screen px-4 custom-flex-center">
    <p className="text-text-primary text-lg font-medium text-center leading-[110%]">
      This experience was designed for larger screens.
      <br />
      <br />
      I didn&apos;t have the strength to make the mobile version yet 🙂
      <br />
      <br />
      Please visit on a device wider than 1024px.
    </p>
  </div>
);

export const PageWrapper = React.forwardRef<HTMLDivElement, PageWrapperProps>(
  ({ state, children, className, scrollOffset, ...props }, ref) => {
    const shouldBeFixed =
      state === "exiting" || state === "entering" || state === "fixed";

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
                : "w-full h-max px-15 xl:px-35 bg-background",
            )}
            style={{
              transform:
                state === "exiting"
                  ? `translateY(-${scrollOffset}px)`
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

export const CTA: React.FC<CTAProps> = ({
  size,
  style,
  className,
  children,
}) => (
  <div className={cn("relative", className)}>
    <div
      className="absolute left-0 top-1/2 -translate-x-2.5 -translate-y-1/2 custom-flex-center bg-bg-primary rounded-full"
      style={{ width: size - 20, height: size - 20 }}
    >
      <p className="text-white text-center" style={style}>
        {children}
      </p>
    </div>

    <div
      className="rounded-full border border-border-primary"
      style={{ width: size, height: size }}
    ></div>
  </div>
);
