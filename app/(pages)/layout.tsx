"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Types
import type { MenuState, RouteState } from "@/components/global/types";

// Imports
import Pages from "@/components/global/pages";
import Navbar from "@/components/navbar/navbar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { GlobalContext } from "@/components/global/GlobalContext";
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
