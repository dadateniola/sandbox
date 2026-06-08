"use client";

import { useRef, useState } from "react";

// Types
import type { PageInitProps } from "./types";

// Imports
import gsap from "gsap";
import { cn } from "@/utils/cn";
import { useGSAP } from "@gsap/react";
import PageWrapper from "./page-wrapper";
import { PageMobile } from "./components";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTransitionContext } from "@/transition/TransitionProvider";

const PageInit: React.FC<PageInitProps> = ({ children }) => {
  // Hooks
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const { createTransition, setViewportState } = useTransitionContext();

  // States
  const [isAnimating, setIsAnimating] = useState(true);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);

  // Refs
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderTextsRef = useRef<HTMLParagraphElement[]>([]);

  // Animations
  useGSAP(() => {
    const loaderTexts = loaderTextsRef.current;
    if (loaderTexts.length === 0) return;

    const tl = gsap.timeline();

    tl.set(loaderTexts, { yPercent: 100, autoAlpha: 1 });

    tl.to(loaderTexts, { yPercent: 0, stagger: 0.1, ease: "power4.out" }).call(
      () => {
        setViewportState({ mode: "fixed", scrollY: 0 });
        setIsAnimating(false);
      },
    );
  }, []);

  useGSAP(() => {
    if (isMobile === undefined || isAnimating) return;

    const loader = loaderRef.current;
    const ap = document.querySelector(`[data-state="active"]`);
    if (!loader || !ap) return;

    const tl = gsap.timeline();

    tl.add(createTransition({ exiting: loader, entering: ap })).call(() => {
      setViewportState({ mode: "static", scrollY: 0 });
      setIsLoaderVisible(false);
    });
  }, [isMobile, isAnimating]);

  return (
    <>
      {isLoaderVisible && (
        <PageWrapper ref={loaderRef} state="fixed" className="z-10">
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
        </PageWrapper>
      )}

      {isMobile ? (
        <PageWrapper state="active">
          <PageMobile />
        </PageWrapper>
      ) : (
        children
      )}
    </>
  );
};

export default PageInit;
