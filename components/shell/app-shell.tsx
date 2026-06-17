"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

// Imports
import Navbar from "../navbar/navbar";
import MobileGate from "./mobile-gate";
import IntroLoader from "./intro-loader";
import PageHost from "../pages/page-host";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { NavbarMenuPanel } from "../navbar/navbar-menu-panel";
import { useTransitionEngine } from "@/transition/engine/TransitionContext";
import TransitionOrchestrator from "@/transition/engine/transition-orchestrator";

const AppShell = () => {
  // Hooks
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1023px)");

  const {
    state: { viewport },
    dispatch,
  } = useTransitionEngine();

  // Effects
  useEffect(() => {
    if (isMobile === undefined) return;
    dispatch({ type: "SET_MOBILE_VIEWPORT", isMobile });
  }, [isMobile, dispatch]);

  useEffect(() => {
    dispatch({
      type: "NAVIGATE",
      to: pathname,
      scrollY: window.scrollY,
    });
  }, [pathname, dispatch]);

  useLayoutEffect(() => {
    if (viewport.mode === "static") {
      window.scrollTo(0, viewport.scrollY);
    }
  }, [viewport]);

  return (
    <>
      <TransitionOrchestrator />

      <IntroLoader />

      <Navbar />
      <NavbarMenuPanel />

      <MobileGate>
        <PageHost />
      </MobileGate>
    </>
  );
};

export default AppShell;
