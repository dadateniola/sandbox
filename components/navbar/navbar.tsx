"use client";

import Link from "next/link";
import { useState } from "react";

// Imports
import { cn } from "@/utils/cn";
import NavbarExpanded from "./navbar-expanded";
import type { NavbarProps } from "../global/types";

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  // States
  const [menuState, setMenuState] = useState<"open" | "closed">("closed");

  // Functions
  const handleMenuToggle = () => {
    const isMenuAnimating = false;
    if (isMenuAnimating) return;

    setMenuState((prev) => (prev === "closed" ? "open" : "closed"));
  };

  // Render
  const menuOpen = menuState === "open";

  return (
    <>
      <nav
        className={cn(
          "fixed z-6 top-0 left-0 right-0 w-full pt-12.5 px-10 flex items-end justify-between gap-10",
          className,
        )}
      >
        <Link href="/" className="text-2xl leading-[110%]">
          Jacob Grönberg
        </Link>

        <button onClick={handleMenuToggle} className="relative group">
          <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-50 rounded-full border border-border-primary",
              !menuOpen && "scale-0",
              menuState === "open" && "group-hover:bg-bg-primary",
            )}
          />

          <div
            className={cn(
              "flex flex-col items-end gap-2.5",
              "*:border-t *:border-border-secondary",
              menuState === "open" && "group-hover:*:border-white",
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
        <div className="fixed z-3 inset-0 bg-background">
          <NavbarExpanded />
        </div>
      )}
    </>
  );
};

export default Navbar;
