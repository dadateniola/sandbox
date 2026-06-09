"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Types
import type { Page } from "@/components/global/types";

// Imports
import { cn } from "@/utils/cn";
import Navbar from "@/components/navbar/navbar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import NotFound from "@/components/not-found/not-found";
import { PageMobile } from "@/components/global/components";
import { PAGE_DATA, PAGES } from "@/components/global/data";

const SlugLayout = () => {
  // Hooks
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // States
  const [currentPath, setCurrentPath] = useState(pathname);

  // Effects
  useEffect(() => {
    const changePath = () => setCurrentPath(pathname);
    changePath();
  }, [pathname]);

  const isKnownPath = PAGES.includes(currentPath as Page);
  const ActiveComponent = isKnownPath
    ? PAGE_DATA[currentPath as Page].content
    : NotFound;

  const shouldShowLoader = isMobile === undefined;
  const shouldShowMobileLayout = isMobile === true;

  return (
    <>
      {shouldShowLoader && (
        <div className="fixed z-10 inset-0 custom-flex-center bg-background overflow-hidden">
          <div
            className={cn(
              "custom-flex-col gap-5",
              "text-text-primary text-3xl text-center leading-[90%] tracking-[-0.6px] uppercase",
            )}
          >
            <p>Jacob</p>
            <p>Grønberg</p>
          </div>
        </div>
      )}

      {shouldShowMobileLayout ? (
        <PageMobile />
      ) : (
        <>
          <Navbar className="z-6" />

          <main className="relative z-1 px-4 lg:px-15 xl:px-35 overflow-hidden">
            <ActiveComponent />
          </main>
        </>
      )}
    </>
  );
};

export default SlugLayout;
