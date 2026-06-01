"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useLayoutEffect } from "react";

// Types
import type {
  MenuState,
  RouteState,
  ViewportState,
  CreateTransitionArgs,
} from "@/components/global/types";

// Imports
import gsap from "gsap";
import Pages from "@/components/global/pages";
import Navbar from "@/components/navbar/navbar";
import PageInit from "@/components/global/page-init";
import { GlobalContext } from "@/components/global/GlobalContext";
import { CLIP_PATHS, TL_DEFAULTS } from "@/components/global/data";

const SlugLayout = () => {
  // Hooks
  const pathname = usePathname();

  // States
  const [routeState, setRouteState] = useState<RouteState>({
    active: pathname,
    transitioning: null,
  });
  const [menuState, setMenuState] = useState<MenuState>("closed");
  const [viewportState, setViewportState] = useState<ViewportState>({
    mode: "static",
    scrollY: 0,
  });

  const activePath = routeState.active;
  const transitioningPath = routeState.transitioning;

  // Refs
  const isTransitioningRef = useRef(false);
  const queuedPathRef = useRef<string | null>(null);
  const navbarExpandedRef = useRef<HTMLDivElement>(null);

  // Functions
  const createTransition = ({
    exiting,
    entering,
    options,
  }: CreateTransitionArgs) => {
    const exContent = exiting.querySelector("[data-content]");
    const exOverlay = exiting.querySelector("[data-overlay]");

    const tl = gsap.timeline({ defaults: TL_DEFAULTS });

    tl.set(exiting, { clipPath: CLIP_PATHS.open });

    tl.to(exContent, { y: -window.innerHeight / 2, rotate: -7, scale: 1.3 })
      .to(exOverlay, { autoAlpha: 1 }, "<")
      .to(exiting, { clipPath: CLIP_PATHS.closed }, "<");

    if (!options?.skipEntering) {
      tl.from(
        entering,
        { y: window.innerHeight / 2, rotate: 7, scale: 1.3 },
        "<",
      );
    }

    return tl;
  };

  const commitNavigation = (nextPage: string) => {
    setRouteState(() => {
      if (queuedPathRef.current) {
        const queuedPath = queuedPathRef.current;
        queuedPathRef.current = null;
        isTransitioningRef.current = true;

        return {
          active: nextPage,
          transitioning: queuedPath,
        };
      }

      isTransitioningRef.current = false;
      return { active: nextPage, transitioning: null };
    });
  };

  // Effects
  useEffect(() => {
    const navigate = () => {
      if (pathname === activePath || transitioningPath === pathname) return;

      if (isTransitioningRef.current) {
        queuedPathRef.current = pathname;
        return;
      }

      isTransitioningRef.current = true;
      setViewportState({ mode: "fixed", scrollY: window.scrollY });
      setRouteState((prev) => ({
        active: prev.active,
        transitioning: pathname,
      }));
    };

    navigate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useLayoutEffect(() => {
    if (viewportState.mode === "static") {
      window.scrollTo(0, viewportState.scrollY);
    }
  }, [viewportState]);

  return (
    <GlobalContext.Provider
      value={{
        menuState,
        routeState,
        queuedPathRef,
        viewportState,
        navbarExpandedRef,
        isTransitioningRef,
        setMenuState,
        setRouteState,
        commitNavigation,
        createTransition,
        setViewportState,
      }}
    >
      <PageInit>
        <Navbar />
        <Pages />
      </PageInit>
    </GlobalContext.Provider>
  );
};

export default SlugLayout;
