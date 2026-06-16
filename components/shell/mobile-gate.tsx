"use client";

import PageState from "../pages/page-state";
// Types
import type { MobileGateProps } from "./types";

// Imports
import { useTransitionEngine } from "@/transition/engine/TransitionContext";

const MobileGate: React.FC<MobileGateProps> = ({ children }) => {
  // Hooks
  const {
    state: { isMobileViewport },
  } = useTransitionEngine();

  if (isMobileViewport) {
    return (
      <PageState
        role="page-stage"
        stageState="active"
        data-stage-state="active"
      >
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
      </PageState>
    );
  }

  return <>{children}</>;
};

export default MobileGate;
