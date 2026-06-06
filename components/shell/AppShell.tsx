"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { normalizeRoute, shouldRequestNavigation } from "@/transition/adapters/route-adapter";
import { registerDefaultTransitions } from "@/transition/registry/register-default-transitions";
import { useTransitionEngine } from "@/transition/engine/useTransitionEngine";

import { Navbar } from "@/components/navigation/Navbar";
import { NavbarMenuPanel } from "@/components/navigation/NavbarMenuPanel";
import { PageHost } from "@/components/pages/PageHost";
import { IntroLoader } from "./IntroLoader";
import { MobileGate } from "./MobileGate";
import { TransitionDebugPanel } from "./TransitionDebugPanel";

import { NavigationOrchestrator } from "@/transition/orchestrators/NavigationOrchestrator";
import { MenuOrchestrator } from "@/transition/orchestrators/MenuOrchestrator";
import { LoaderOrchestrator } from "@/transition/orchestrators/LoaderOrchestrator";

/**
 * AppShell composes the full transition runtime.
 *
 * Why this file exists:
 * - It wires providers, orchestrators, and render surfaces in one readable place.
 * - It teaches future engineers where lifecycle starts without mixing in reducer logic.
 *
 * What this file should never do:
 * - It should never define transition recipes.
 * - It should never mutate engine state outside dispatch/actions.
 */
export const AppShell = () => {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1023px)");

  const { state, dispatch } = useTransitionEngine();

  useEffect(() => {
    registerDefaultTransitions();
  }, []);

  useEffect(() => {
    if (isMobile === undefined) return;
    dispatch({ type: "SET_MOBILE_VIEWPORT", isMobile });
  }, [dispatch, isMobile]);

  useEffect(() => {
    if (!pathname) return;

    const normalizedPath = normalizeRoute(pathname);

    if (
      !shouldRequestNavigation({
        pathname: normalizedPath,
        activePath: state.activePath,
        pendingPath: state.pendingPath,
      })
    ) {
      return;
    }

    dispatch({
      type: "NAVIGATE_REQUEST",
      to: normalizedPath,
      source: "url",
      scrollY: window.scrollY,
    });
  }, [dispatch, pathname, state.activePath, state.pendingPath]);

  useLayoutEffect(() => {
    if (state.viewport.mode === "static") {
      window.scrollTo(0, state.viewport.scrollY);
    }
  }, [state.viewport.mode, state.viewport.scrollY]);

  return (
    <>
      <NavigationOrchestrator />
      <MenuOrchestrator />
      <LoaderOrchestrator />

      <Navbar />
      <NavbarMenuPanel />

      <MobileGate isMobile={state.isMobileViewport}>
        <PageHost />
      </MobileGate>

      <IntroLoader />
      <TransitionDebugPanel />
    </>
  );
};
