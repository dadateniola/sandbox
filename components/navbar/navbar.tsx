"use client";

import Link from "next/link";

// Imports
import gsap from "gsap";
import { cn } from "@/utils/cn";
import { useGSAP } from "@gsap/react";
import { TL_DEFAULTS } from "../global/data";
import NavbarExpanded from "./navbar-expanded";
import { PageWrapper } from "../global/components";
import { useGlobalContext } from "../global/GlobalContext";

const Navbar = () => {
  // Hooks
  const { menuState, navbarExpandedRef, isTransitioningRef, setMenuState } =
    useGlobalContext();

  // Functions
  const handleMenuToggle = () => {
    const isTransitioning = menuState === "opening" || menuState === "closing";
    if (isTransitioning || isTransitioningRef.current) return;

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
