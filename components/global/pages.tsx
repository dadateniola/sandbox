"use client";

// Types
import type { Page } from "./types";

// Imports
import gsap from "gsap";
import { PAGE_DATA } from "./data";
import { useGSAP } from "@gsap/react";
import PageWrapper from "./page-wrapper";
import NotFound from "../not-found/not-found";
import { useTransitionContext } from "@/transition/TransitionProvider";

const Pages = () => {
  // Hooks
  const {
    menuState,
    routeState,
    navbarExpandedRef,
    setMenuState,
    commitNavigation,
    createTransition,
    setViewportState,
  } = useTransitionContext();

  const activePath = routeState.active;
  const transitioningPath = routeState.transitioning;

  // Animations
  useGSAP(() => {
    if (!transitioningPath) return;
    const nextPage = transitioningPath;

    const tl = gsap.timeline();

    // If we're mid-menu-transition, we want to immediately jump to the new page without animating the navbar again.
    if (menuState === "open") {
      setMenuState("hijacked");

      const ne = navbarExpandedRef.current;
      const exiting = document.querySelector(`[data-state="exiting"]`);
      const entering = document.querySelector(`[data-state="entering"]`);
      if (!ne || !exiting || !entering) return;

      tl.set(exiting, {
        autoAlpha: 0,
        pointerEvents: "none",
      });

      tl.add(createTransition({ exiting: ne, entering }));

      tl.call(() => {
        setMenuState("closed");
        setViewportState({ mode: "static", scrollY: 0 });
      });
    } else {
      const exiting = document.querySelector(`[data-state="exiting"]`);
      const entering = document.querySelector(`[data-state="entering"]`);
      if (!exiting || !entering) return;

      tl.add(createTransition({ exiting, entering })).call(() =>
        setViewportState({ mode: "static", scrollY: 0 }),
      );
    }

    tl.call(() => commitNavigation(nextPage));
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
      >
        <Component />
      </PageWrapper>
    );
  });
};

export default Pages;
