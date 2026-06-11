"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Imports
import Navbar from "../navbar/navbar";
import MobileGate from "./mobile-gate";
import IntroLoader from "./intro-loader";
import PageHost from "../pages/page-host";
import { useTransitionEngine } from "@/transition/engine/TransitionContext";
import TransitionOrchestrator from "@/transition/engine/transition-orchestrator";
import { registerDefaultTransitions } from "@/transition/registry/register-default-transitions";

const AppShell = () => {
  // Hooks
  const pathname = usePathname();
  const { state, dispatch } = useTransitionEngine();

  // Effects
  useEffect(() => {
    registerDefaultTransitions();
  }, []);

  useEffect(() => {
    if (pathname === state.activePath || pathname === state.pendingPath) return;

    dispatch({
      type: "NAVIGATE",
      to: pathname,
      scrollY: window.scrollY,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <TransitionOrchestrator />

      {false && <IntroLoader />}

      <Navbar />

      <MobileGate>
        <PageHost />
      </MobileGate>
    </>
  );
};

export default AppShell;
