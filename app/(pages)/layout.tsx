"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Types
import type { MenuState, Page, Transition } from "@/components/global/types";

// Pages
import NotFound from "@/components/not-found/not-found";

// Imports
import Navbar from "@/components/navbar/navbar";
import { PAGE_DATA } from "@/components/global/data";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import {
  PageLoader,
  PageMobile,
  PageWrapper,
} from "@/components/global/components";

import gsap from "gsap";
import { cn } from "@/utils/cn";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import NavbarExpanded from "@/components/navbar/navbar-expanded";

gsap.registerPlugin(CustomEase);

// Constants
const TL_DEFAULTS = {
  ease: CustomEase.create(
    "custom",
    "M0,0 C0.173,0 0.242,0.036 0.322,0.13 0.401,0.223 0.412,0.373 0.465,0.512 0.508,0.628 0.515,0.833 0.621,0.925 0.694,0.989 0.869,1 1,1 ",
  ),
  duration: 1.3,
};

const SlugLayout = () => {
  // Hooks
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // States
  const [activePath, setActivePath] = useState(pathname);
  const [transition, setTransition] = useState<Transition>(null);
  const [menuState, setMenuState] = useState<MenuState>("closed");

  const transitioningPage = transition?.path ?? null;
  const scrollOffset = transition?.scrollY ?? 0;

  // Refs
  const isTransitioningRef = useRef(false);
  const queuedPathRef = useRef<string | null>(null);
  const navbarExpandedRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    const navigate = () => {
      // Ignore if we're already on this page or it's already queued as next.
      if (pathname === activePath || transition?.path === pathname) return;

      // If an animation is running, keep only the latest destination.
      if (isTransitioningRef.current) {
        queuedPathRef.current = pathname;
        return;
      }

      // Start a new transition and remember the current scroll position.
      isTransitioningRef.current = true;
      const scrollY = window.scrollY;
      setTransition({ path: pathname, scrollY });
    };

    navigate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Animations
  useGSAP(() => {
    if (menuState === "closed" || menuState === "hijacked") return;

    const ne = navbarExpandedRef.current;
    const ap = document.querySelector(`[data-state="active"]`);
    if (!ne || !ap) return;

    const neContent = ne.querySelector("[data-content]");
    const neOverlay = ne.querySelector("[data-overlay]");

    const tl = gsap.timeline({ defaults: TL_DEFAULTS });

    if (menuState === "opening") {
      tl.set(neContent, {
        y: -window.innerHeight / 2,
        rotate: -7,
        scale: 1.3,
      })
        .set(neOverlay, { autoAlpha: 1 })
        .set(ne, {
          clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)",
          autoAlpha: 1,
          pointerEvents: "auto",
        });

      tl.to(neContent, { y: 0, rotate: 0, scale: 1 })
        .to(neOverlay, { autoAlpha: 0 }, "<")
        .to(ne, { clipPath: "polygon(0 0, 100% 0, 100% 110%, 0% 100%)" }, "<")
        .to(ap, { y: window.innerHeight / 2, rotate: 7, scale: 1.3 }, "<")
        .call(() => setMenuState("open"));
    } else if (menuState === "closing") {
      tl.to(neContent, { y: -window.innerHeight / 2, rotate: -7, scale: 1.3 })
        .to(neOverlay, { autoAlpha: 1 }, "<")
        .to(ne, { clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)" }, "<")
        .to(ap, { y: 0, rotate: 0, scale: 1 }, "<");

      tl.set(ne, { autoAlpha: 0, pointerEvents: "none" }).call(() =>
        setMenuState("closed"),
      );
    }
  }, [menuState]);

  useGSAP(() => {
    if (!transitioningPage) return;
    const nextPage = transitioningPage;

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
          setActivePath(nextPage);
          setTransition(null);
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
          // Commit the new active page after the timeline completes.
          setActivePath(nextPage);

          // If user navigated again mid-animation, immediately run next transition.
          if (queuedPathRef.current) {
            setTransition({ path: queuedPathRef.current, scrollY: 0 });
            queuedPathRef.current = null;
          } else {
            // No pending navigation, so clear transition state.
            setTransition(null);
            isTransitioningRef.current = false;
          }
        });
    }
  }, [transitioningPage]);

  // Functions
  const handleMenuToggle = () => {
    const isTransitioning = menuState === "opening" || menuState === "closing";
    if (isTransitioning || isTransitioningRef.current) return;

    setMenuState((prev) =>
      prev === "closed" ? "opening" : prev === "open" ? "closing" : prev,
    );
  };

  // Render
  const renderedPages = [...new Set([activePath, transitioningPage])].filter(
    (page): page is Page => Boolean(page),
  );

  return (
    <>
      {/* Loading State */}
      {isMobile === undefined && <PageLoader />}

      {isMobile ? (
        // Mobile Layout
        <PageMobile />
      ) : (
        // Desktop Layout
        <>
          <Navbar
            className="z-6"
            menuState={menuState}
            onMenuClick={handleMenuToggle}
          />

          {menuState !== "closed" && (
            <PageWrapper
              ref={navbarExpandedRef}
              data-menu-state={menuState}
              state="fixed"
              className={cn(
                "z-3",
                "invisible opacity-0 pointer-events-none", // Initial State
              )}
            >
              <NavbarExpanded />
            </PageWrapper>
          )}

          {/* Content */}
          {renderedPages.map((pagePath) => {
            const page = PAGE_DATA[pagePath];

            const isActive = pagePath === activePath;
            const isTransitioning = pagePath === transitioningPage;
            const Component = page?.content ?? NotFound;

            return (
              <PageWrapper
                key={pagePath}
                state={
                  transitioningPage
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
          })}
        </>
      )}
    </>
  );
};

export default SlugLayout;
