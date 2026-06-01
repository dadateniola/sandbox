"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Types
import type {
  MenuState,
  RouteState,
  CreateTransitionArgs,
} from "@/components/global/types";

// Imports
import gsap from "gsap";
import Pages from "@/components/global/pages";
import Navbar from "@/components/navbar/navbar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { GlobalContext } from "@/components/global/GlobalContext";
import { CLIP_PATHS, TL_DEFAULTS } from "@/components/global/data";
import { PageLoader, PageMobile } from "@/components/global/components";

const SlugLayout = () => {
  // Hooks
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // States
  const [routeState, setRouteState] = useState<RouteState>({
    active: pathname,
    transitioning: null,
  });
  const [menuState, setMenuState] = useState<MenuState>("closed");

  const activePath = routeState.active;
  const transitioningPath = routeState.transitioning?.path ?? null;

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

    tl.to(exContent, { y: -window.innerHeight, rotate: -7, scale: 1.3 })
      .to(exOverlay, { autoAlpha: 1 }, "<")
      .to(exiting, { clipPath: CLIP_PATHS.closed }, "<");

    if (!options?.skipEntering) {
      tl.from(entering, { y: window.innerHeight, rotate: 7, scale: 1.3 }, "<");
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
          transitioning: { path: queuedPath, scrollY: 0 },
        };
      }

      isTransitioningRef.current = false;
      return { active: nextPage, transitioning: null };
    });
  };

  // Effects
  useEffect(() => {
    const navigate = () => {
      // Ignore if we're already on this page or it's already queued as next.
      if (pathname === activePath || transitioningPath === pathname) return;

      // If an animation is running, keep only the latest destination.
      if (isTransitioningRef.current) {
        queuedPathRef.current = pathname;
        return;
      }

      // Start a new transition and remember the current scroll position.
      isTransitioningRef.current = true;
      const scrollY = window.scrollY;
      setRouteState((prev) => ({
        active: prev.active,
        transitioning: { path: pathname, scrollY },
      }));
    };

    navigate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <GlobalContext.Provider
      value={{
        menuState,
        routeState,
        queuedPathRef,
        navbarExpandedRef,
        isTransitioningRef,
        setMenuState,
        setRouteState,
        commitNavigation,
        createTransition,
      }}
    >
      {/* Loading State */}
      {isMobile === undefined && <PageLoader />}

      {isMobile ? (
        // Mobile Layout
        <PageMobile />
      ) : (
        // Desktop Layout
        <>
          <Navbar />
          <Pages />
        </>
      )}
    </GlobalContext.Provider>
  );
};

export default SlugLayout;
