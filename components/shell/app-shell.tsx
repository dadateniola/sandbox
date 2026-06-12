"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Imports
import Navbar from "../navbar/navbar";
import MobileGate from "./mobile-gate";
import IntroLoader from "./intro-loader";
import PageHost from "../pages/page-host";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { NavbarMenuPanel } from "../navbar/navbar-menu-panel";
import { useTransitionEngine } from "@/transition/engine/TransitionContext";
import TransitionOrchestrator from "@/transition/engine/transition-orchestrator";
import { registerDefaultTransitions } from "@/transition/registry/register-default-transitions";

const AppShell = () => {
  // Hooks
  const pathname = usePathname();
  const { state, dispatch } = useTransitionEngine();
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Effects
  useEffect(() => {
    registerDefaultTransitions();
  }, []);

  useEffect(() => {
    if (isMobile === undefined) return;
    dispatch({ type: "SET_MOBILE_VIEWPORT", isMobile });
  }, [isMobile, dispatch]);

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
