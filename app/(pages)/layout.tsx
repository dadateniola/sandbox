"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Types
import type { Page, Transition } from "@/components/global/types";

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
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

const SlugLayout = () => {
  // Hooks
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // States
  const [activePath, setActivePath] = useState(pathname);
  const [transition, setTransition] = useState<Transition>(null);

  const transitioningPage = transition?.path ?? null;
  const scrollOffset = transition?.scrollY ?? 0;

  // Refs
  const isTransitioningRef = useRef(false);
  const queuedPathRef = useRef<string | null>(null);

  // Effects
  useEffect(() => {
    const navigate = () => {
      if (pathname === activePath || transition?.path === pathname) return;

      if (isTransitioningRef.current) {
        queuedPathRef.current = pathname;
        return;
      }

      isTransitioningRef.current = true;
      const scrollY = window.scrollY;
      setTransition({ path: pathname, scrollY });
    };

    navigate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Animations
  useGSAP(() => {
    if (!transitioningPage) return;
    const nextPage = transitioningPage;

    const exitingPage = document.querySelector(`[data-state="exiting"]`);
    const enteringPage = document.querySelector(`[data-state="entering"]`);
    if (!exitingPage || !enteringPage) return;

    const exitingPageMain = exitingPage.querySelector("main");
    const exitingPageOverlay = exitingPage.querySelector("[data-overlay]");

    const tl = gsap.timeline({
      defaults: {
        ease: CustomEase.create(
          "custom",
          "M0,0 C0.173,0 0.242,0.036 0.322,0.13 0.401,0.223 0.412,0.373 0.465,0.512 0.508,0.628 0.515,0.833 0.621,0.925 0.694,0.989 0.869,1 1,1 ",
        ),
        duration: 1.3,
      },
    });

    tl.set(exitingPage, {
      clipPath: "polygon(0 0, 100% 0, 100% 110%, 0% 100%)",
    }).set(enteringPage, {
      y: window.innerHeight / 2,
      rotate: 7,
      scale: 1.3,
    });

    tl.to(exitingPageMain, { y: -window.innerHeight, rotate: -7, scale: 1.3 })
      .to(exitingPageOverlay, { opacity: 1, visibility: "visible" }, "<")
      .to(
        exitingPage,
        { clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)" },
        "<",
      )
      .to(enteringPage, { y: 0, rotate: 0, scale: 1 }, "<")
      .call(() => {
        setActivePath(nextPage);
        if (queuedPathRef.current) {
          setTransition({ path: queuedPathRef.current, scrollY: 0 });
          queuedPathRef.current = null;
        } else {
          setTransition(null);
          isTransitioningRef.current = false;
        }
      });
  }, [transitioningPage]);

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
          <Navbar className="z-5" />

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
