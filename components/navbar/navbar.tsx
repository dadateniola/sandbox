"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Imports
import { cn } from "@/utils/cn";
import { ArrowLeft } from "../svg/svg";
import { resolveRoute } from "../global/data";
import { useTransitionEngine } from "@/transition/engine/TransitionContext";

const Navbar = () => {
  // Hooks
  const pathname = usePathname();
  const {
    state: { menuState, isMobileViewport },
    dispatch,
  } = useTransitionEngine();

  // Functions
  const handleMenuToggle = () => {
    dispatch({
      type: menuState === "closed" ? "MENU_OPEN" : "MENU_CLOSE",
      scrollY: window.scrollY,
    });
  };

  // Render
  const match = resolveRoute(pathname);
  const isProjectDetail = match?.route.path === "/projects/:projectId";

  const menuOpen = menuState === "open" || menuState === "opening";

  return (
    <nav className="fixed z-6 top-0 left-0 right-0 w-full pt-12.5 px-10">
      <div className="relative flex items-end justify-between gap-10">
        {isMobileViewport ? (
          <div className="text-2xl leading-[110%]">Jacob Grönberg</div>
        ) : (
          <Link href="/not-found" className="text-2xl leading-[110%]">
            Jacob Grönberg
          </Link>
        )}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden">
          <Link
            href="/projects"
            className={cn(
              "flex items-center gap-3",
              "transition-transform duration-300",
              {
                "translate-y-full pointer-events-none":
                  menuOpen || !isProjectDetail,
                "delay-500": menuState === "closing" || isProjectDetail,
              },
            )}
          >
            <ArrowLeft />
            <p className="text-lg leading-[120%]">Back to Projects</p>
          </Link>
        </div>

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
      </div>
    </nav>
  );
};

export default Navbar;
