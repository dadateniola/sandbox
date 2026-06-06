"use client";

import Link from "next/link";
import { cn } from "@/utils/cn";
import { useTransitionEngine } from "@/transition/engine/useTransitionEngine";
import { selectCanInteract } from "@/transition/engine/transition-selectors";

/**
 * Navbar view/controller boundary.
 *
 * Why this file exists:
 * - This component emits menu intent events and displays current state.
 * - It does not own animation implementation.
 */
export const Navbar = () => {
  const { state, actions } = useTransitionEngine();

  const { menuState } = state;

  const canInteract = selectCanInteract(state);
  const menuOpen = menuState === "open" || menuState === "opening";

  const toggleMenu = () => {
    if (!canInteract) return;
    if (menuOpen) {
      actions.requestMenuClose();
    } else {
      actions.requestMenuOpen();
    }
  };

  return (
    <nav className="fixed z-6 top-0 left-0 right-0 w-full pt-12.5 px-10 flex items-end justify-between gap-10">
      <Link href="/not-found" className="text-2xl leading-[110%]">
        Jacob Gronberg
      </Link>

      <button onClick={toggleMenu} className="relative group" aria-label="Toggle Menu">
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-50 rounded-full border border-border-primary",
            "transition-all duration-300",
            !menuOpen && "scale-0",
            menuOpen && "group-hover:bg-bg-primary",
          )}
        />

        <div
          className={cn(
            "flex flex-col items-end gap-2.5",
            "*:border-t *:border-border-secondary *:transition-all *:duration-300",
            menuOpen && "group-hover:*:border-white",
          )}
        >
          <div
            className={cn(
              "origin-left",
              menuOpen ? "w-10 rotate-45 translate-x-1.5 -translate-y-1" : "w-12.5",
            )}
          />
          <div className={cn("w-8.75", menuOpen && "opacity-0")} />
          <div
            className={cn(
              "origin-right",
              menuOpen ? "w-10 -rotate-45 -translate-x-1.5 -translate-y-6.25" : "w-11.25",
            )}
          />
        </div>
      </button>
    </nav>
  );
};
