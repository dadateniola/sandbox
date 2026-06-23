"use client";

import { useEffect, useRef, useState } from "react";

// Imports
import gsap from "gsap";
import { cn } from "@/utils/cn";
import { useGSAP } from "@gsap/react";
import PageState from "../pages/page-state";
import { useTransitionEngine } from "@/transition/engine/TransitionContext";

const IntroLoader = () => {
  // Hooks
  const {
    state: { isLoaderVisible, isMobileViewport },
    dispatch,
  } = useTransitionEngine();

  // States
  const [isAnimating, setIsAnimating] = useState(true);

  // Refs
  const loaderTextsRef = useRef<HTMLParagraphElement[]>([]);

  // Animations
  useGSAP(() => {
    const loaderTexts = loaderTextsRef.current;
    if (loaderTexts.length === 0) return;

    const tl = gsap.timeline();

    tl.set(loaderTexts, { yPercent: 100, autoAlpha: 1 });

    tl.to(loaderTexts, {
      yPercent: 0,
      stagger: 0.1,
      delay: 0.3,
      ease: "power4.out",
    }).call(() => setIsAnimating(false));
  }, []);

  useEffect(() => {
    if (isMobileViewport === undefined || isAnimating) return;

    dispatch({ type: "HIDE_LOADER" });
  }, [isAnimating, isMobileViewport, dispatch]);

  if (!isLoaderVisible) return null;

  return (
    <PageState role="loader" stageState="fixed" className="z-9">
      <div className="size-full custom-flex-center bg-background overflow-hidden">
        <div
          className={cn(
            "custom-flex-col gap-5",
            "text-text-primary text-3xl text-center leading-[90%] tracking-[-0.6px] uppercase",
          )}
        >
          {["Jacob", "Grønberg"].map((text, index) => (
            <div key={index} className="overflow-hidden">
              <p
                ref={(el) => {
                  if (el) loaderTextsRef.current[index] = el;
                }}
                className="opacity-0 invisible" // Initial State
              >
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageState>
  );
};

export default IntroLoader;
