"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Types
import type { RouteKey } from "../global/types";

// Imports
import { cn } from "@/utils/cn";
import { ROUTES } from "../global/data";
import PageState from "../pages/page-state";
import { isActiveRoute } from "@/utils/isActiveRoute";
import { useTransitionEngine } from "@/transition/engine/TransitionContext";

// Constants
const PAGES: RouteKey[] = [
  "/",
  "/projects",
  "/exhibitions",
  "/about",
  "/contact",
];

export const NavbarMenuPanel = () => {
  const pathname = usePathname();
  const {
    state: { menuState, isMobileViewport },
  } = useTransitionEngine();

  if (menuState === "closed") {
    return null;
  }

  return (
    <PageState
      role="menu-panel"
      stageState="fixed"
      data-menu-state={menuState}
      className={cn(
        "z-3",
        "invisible opacity-0 pointer-events-none", // Initial State
      )}
    >
      <div className="size-full py-8.5 px-10 custom-flex-col bg-background">
        <div className="flex-1 min-h-0 custom-flex-center">
          <div className="flex flex-col items-center gap-[min(4vh,40px)]">
            {PAGES.map((page, index) => {
              const label = ROUTES.find((r) => r.path === page)?.label;
              if (!label) return null;

              const Component = isMobileViewport ? "div" : Link;

              return (
                <Component
                  key={page}
                  href={page}
                  className="flex items-center gap-10 lg:gap-12.5"
                >
                  <p className="text-text-primary text-xl lg:text-[30px] leading-[120%]">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <p
                    className={cn(
                      "text-[clamp(30px,5vw,100px)] hover:text-text-primary transition-colors duration-200 leading-[110%] uppercase",
                      isActiveRoute({ href: page, pathname }) &&
                        "text-text-primary",
                    )}
                  >
                    {label}
                  </p>
                </Component>
              );
            })}
          </div>
        </div>

        <div className="relative h-0">
          <div className="absolute bottom-0 left-0 right-0 w-full flex items-center justify-between [&>p]:leading-[160%]">
            <p className="max-sm:hidden">© Designed by Pawel Gola</p>
            <p>
              Developed by{" "}
              <a
                href="https://github.com/dadateniola"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary hover:underline"
              >
                Dada Teniola
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageState>
  );
};
