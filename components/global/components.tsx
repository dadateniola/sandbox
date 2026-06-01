import React from "react";

// Types
import type { CTAProps } from "./types";

// Imports
import { cn } from "@/utils/cn";

// Components
export const PageMobile: React.FC = () => (
  <div className="w-full h-screen custom-flex-center">
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
