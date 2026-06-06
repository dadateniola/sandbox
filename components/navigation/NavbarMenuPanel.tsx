"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { isActiveRoute } from "@/utils/isActiveRoute";
import { ROUTES } from "@/routing/route-manifest";
import { useTransitionEngine } from "@/transition/engine/useTransitionEngine";

export const NavbarMenuPanel = () => {
  const pathname = usePathname();
  const {
    state: { menuState },
  } = useTransitionEngine();

  return (
    <div
      data-transition-role="menu-panel"
      data-menu-state={menuState}
      className={cn(
        "fixed z-3 inset-0 bg-background px-10 py-8.5",
        "opacity-0 invisible pointer-events-none",
      )}
    >
      <div className="size-full custom-flex-col">
        <div className="flex-1 min-h-0 custom-flex-center">
          <div className="flex flex-col items-center gap-[min(4vh,40px)]">
            {ROUTES.map((route, index) => (
              <Link key={route.path} href={route.path} className="flex items-center gap-12.5">
                <p className="text-text-primary text-[30px] leading-[120%]">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <p
                  className={cn(
                    "text-[min(5vw,100px)] hover:text-text-primary transition-colors duration-200 leading-[110%] uppercase",
                    isActiveRoute({ href: route.path, pathname }) && "text-text-primary",
                  )}
                >
                  {route.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
