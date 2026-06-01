"use client";

import Link from "next/link";

// Imports
import gsap from "gsap";
import { cn } from "@/utils/cn";
import { useGSAP } from "@gsap/react";
import NavbarExpanded from "./navbar-expanded";
import PageWrapper from "../global/page-wrapper";
import { CLIP_PATHS, TL_DEFAULTS } from "../global/data";
import { useGlobalContext } from "../global/GlobalContext";

const Navbar = () => {
  // Hooks
  const {
    menuState,
    routeState,
    navbarExpandedRef,
    isTransitioningRef,
    setMenuState,
    commitNavigation,
    createTransition,
    setViewportState,
  } = useGlobalContext();

  // Functions
  const handleMenuToggle = () => {
    const isTransitioning = menuState === "opening" || menuState === "closing";
    if (isTransitioning || isTransitioningRef.current) return;

    setViewportState(prev => ({ mode: "fixed", scrollY: window.scrollY || prev.scrollY }));
    setMenuState((prev) =>
      prev === "closed" ? "opening" : prev === "open" ? "closing" : prev,
    );
  };

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
      tl.set(ne, {
        clipPath: CLIP_PATHS.closed,
        autoAlpha: 1,
        pointerEvents: "auto",
      });

      tl.from(neContent, {
        y: -window.innerHeight / 2,
        rotate: -7,
        scale: 1.3,
      })
        .from(neOverlay, { autoAlpha: 1 }, "<")
        .to(ne, { clipPath: CLIP_PATHS.open }, "<")
        .to(ap, { y: window.innerHeight / 2, rotate: 7, scale: 1.3 }, "<")
        .call(() => setMenuState("open"));
    } else if (menuState === "closing") {
      tl.add(
        createTransition({
          exiting: ne,
          entering: ap,
          options: { skipEntering: true },
        }),
      );

      tl.to(ap, { y: 0, rotate: 0, scale: 1 }, "<")
        .set(ne, { autoAlpha: 0, pointerEvents: "none" })
        .call(() => {
          setViewportState((prev) => ({ ...prev, mode: "static" }));
          setMenuState("closed");
        });
    }

    tl.call(() => {
      commitNavigation(routeState.active);
    });
  }, [menuState]);

  // Render
  const menuOpen = menuState === "open" || menuState === "opening";

  return (
    <>
      <nav className="fixed z-6 top-0 left-0 right-0 w-full pt-12.5 px-10 flex items-end justify-between gap-10">
        <Link href="/not-found" className="text-2xl leading-[110%]">
          Jacob Grönberg
        </Link>

        <button onClick={handleMenuToggle} className="relative group">
          <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-50 rounded-full border border-border-primary",
              "transition-all duration-300",
              !menuOpen && "scale-0",
              {
                "delay-500": menuState === "opening",
                "group-hover:bg-bg-primary": menuState === "open",
              },
            )}
          />

          <div
            className={cn(
              "flex flex-col items-end gap-2.5",
              "*:border-t *:border-border-secondary *:transition-all *:duration-300",
              {
                "group-hover:*:border-white": menuState === "open",
              },
            )}
          >
            <div
              className={cn(
                "origin-left",
                menuOpen
                  ? "w-10 rotate-45 translate-x-1.5 -translate-y-1"
                  : "w-12.5",
              )}
            ></div>
            <div className={cn("w-8.75", menuOpen && "opacity-0")}></div>
            <div
              className={cn(
                "origin-right",
                menuOpen
                  ? "w-10 -rotate-45 -translate-x-1.5 -translate-y-6.25"
                  : "w-11.25",
              )}
            ></div>
          </div>
        </button>
      </nav>

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
    </>
  );
};

export default Navbar;
