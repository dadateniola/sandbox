"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTransitionEngine } from "@/transition/engine/useTransitionEngine";

/**
 * Intro loader is intentionally simple in V2.
 *
 * Its teaching purpose is to demonstrate that loader transitions are just another engine request,
 * not a one-off bespoke flow hidden in a layout component.
 */
export const IntroLoader = () => {
  const { state, actions } = useTransitionEngine();
  const textRef = useRef<HTMLParagraphElement>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!state.isLoaderVisible || state.isMobileViewport) return;
    if (hasStartedRef.current) return;

    hasStartedRef.current = true;

    const tl = gsap.timeline();
    tl.fromTo(
      textRef.current,
      { yPercent: 100, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.7,
      },
    ).call(() => {
      actions.requestLoaderComplete();
    });
  }, [actions, state.isLoaderVisible, state.isMobileViewport]);

  if (!state.isLoaderVisible) return null;

  return (
    <div
      data-transition-role="loader"
      className="fixed inset-0 z-10 custom-flex-center bg-background overflow-hidden"
    >
      <p
        ref={textRef}
        className="text-text-primary text-4xl text-center uppercase opacity-0"
      >
        Transition Engine V2
      </p>
    </div>
  );
};
