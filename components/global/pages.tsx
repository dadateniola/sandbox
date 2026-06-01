"use client";

// Types
import type { Page } from "./types";

// Imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PageWrapper } from "./components";
import NotFound from "../not-found/not-found";
import { PAGE_DATA, TL_DEFAULTS } from "./data";
import { useGlobalContext } from "./GlobalContext";

const Pages = () => {
  // Hooks
  const {
    menuState,
    routeState,
    queuedPathRef,
    navbarExpandedRef,
    isTransitioningRef,
    setMenuState,
    setRouteState,
  } = useGlobalContext();

  const activePath = routeState.active;
  const transitioningPath = routeState.transitioning?.path ?? null;
  const scrollOffset = routeState.transitioning?.scrollY ?? 0;

  // Animations
  useGSAP(() => {
    if (!transitioningPath) return;
    const nextPage = transitioningPath;

    if (menuState === "open") {
      setMenuState("hijacked");

      const ne = navbarExpandedRef.current;
      const exitingPage = document.querySelector(`[data-state="exiting"]`);
      const enteringPage = document.querySelector(`[data-state="entering"]`);
      if (!ne || !exitingPage || !enteringPage) return;

      const neContent = ne.querySelector("[data-content]");
      const neOverlay = ne.querySelector("[data-overlay]");

      const tl = gsap.timeline({ defaults: TL_DEFAULTS });

      tl.set(enteringPage, {
        y: window.innerHeight / 2,
        rotate: 7,
        scale: 1.3,
      }).set(exitingPage, {
        autoAlpha: 0,
        pointerEvents: "none",
      });

      tl.to(neContent, { y: -window.innerHeight / 2, rotate: -7, scale: 1.3 })
        .to(neOverlay, { autoAlpha: 1 }, "<")
        .to(ne, { clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)" }, "<")
        .to(enteringPage, { y: 0, rotate: 0, scale: 1 }, "<")
        .call(() => {
          setMenuState("closed");
          setRouteState({ active: nextPage, transitioning: null });
          isTransitioningRef.current = false;
        });
    } else {
      // Grab both layers: the page leaving and the page coming in.
      const exitingPage = document.querySelector(`[data-state="exiting"]`);
      const enteringPage = document.querySelector(`[data-state="entering"]`);
      if (!exitingPage || !enteringPage) return;

      const exitingPageContent = exitingPage.querySelector("[data-content]");
      const exitingPageOverlay = exitingPage.querySelector("[data-overlay]");

      const tl = gsap.timeline({ defaults: TL_DEFAULTS });

      tl.set(exitingPage, {
        clipPath: "polygon(0 0, 100% 0, 100% 110%, 0% 100%)",
      }).set(enteringPage, {
        y: window.innerHeight / 2,
        rotate: 7,
        scale: 1.3,
      });

      tl.to(exitingPageContent, {
        y: -window.innerHeight,
        rotate: -7,
        scale: 1.3,
      })
        .to(exitingPageOverlay, { autoAlpha: 1 }, "<")
        .to(
          exitingPage,
          { clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)" },
          "<",
        )
        .to(enteringPage, { y: 0, rotate: 0, scale: 1 }, "<")
        .call(() => {
          // Commit the new active page.
          setRouteState(() => {
            const ap = nextPage;

            // If user navigated again mid-animation, immediately run next transition.
            if (queuedPathRef.current) {
              const queuedPath = queuedPathRef.current;
              queuedPathRef.current = null;
              return {
                active: ap,
                transitioning: { path: queuedPath, scrollY: 0 },
              };
            } else {
              // No pending navigation, so clear transition state.
              isTransitioningRef.current = false;
              return { active: ap, transitioning: null };
            }
          });
        });
    }
  }, [transitioningPath]);

  // Render
  const renderedPages = [...new Set([activePath, transitioningPath])].filter(
    (page): page is Page => Boolean(page),
  );

  return renderedPages.map((pagePath) => {
    const page = PAGE_DATA[pagePath];

    const isActive = pagePath === activePath;
    const isTransitioning = pagePath === transitioningPath;
    const Component = page?.content ?? NotFound;

    return (
      <PageWrapper
        key={pagePath}
        state={
          transitioningPath
            ? isActive
              ? "exiting"
              : isTransitioning
                ? "entering"
                : "inactive"
            : isActive
              ? "active"
              : "inactive"
        }
        scrollOffset={scrollOffset}
      >
        <Component />
      </PageWrapper>
    );
  });
};

export default Pages;
