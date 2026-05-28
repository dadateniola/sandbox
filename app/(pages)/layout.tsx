"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Pages
import Home from "@/components/home/home";
import About from "@/components/about/about";
import Contact from "@/components/contact/contact";
import Projects from "@/components/projects/projects";
import NotFound from "@/components/not-found/not-found";
import Exhibitions from "@/components/exhibitions/exhibitions";

// Imports
import { cn } from "@/utils/cn";
import Navbar from "@/components/navbar/navbar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { NAVBAR_LINKS } from "@/components/navbar/data";

const SlugLayout = () => {
  // Hooks
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // States
  const [currentPath, setCurrentPath] = useState<
    (typeof NAVBAR_LINKS)[number]["path"] | ({} & string)
  >(pathname);

  // Effects
  useEffect(() => {
    const changePath = () => setCurrentPath(pathname);
    changePath();
  }, [pathname]);

  return (
    <>
      {/* Loading State */}
      {isMobile === undefined && (
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

      {isMobile ? (
        // Mobile Layout
        <div className="w-full h-screen px-4 custom-flex-center">
          <p className="text-text-primary text-lg font-medium text-center leading-[110%]">
            This experience was designed for larger screens.
            <br />
            <br />
            I didn&apos;t have the strength to make the mobile version yet 🙂
            <br />
            <br />
            Please visit on a device wider than 1024px.
          </p>
        </div>
      ) : (
        // Desktop Layout
        <>
          <Navbar className="z-2" />

          {/* Content */}
          <div className="relative z-1 px-15 xl:px-35 overflow-hidden">
            {currentPath === "/" ? (
              <Home />
            ) : currentPath === "/projects" ? (
              <Projects />
            ) : currentPath === "/exhibitions" ? (
              <Exhibitions />
            ) : currentPath === "/about" ? (
              <About />
            ) : currentPath === "/contact" ? (
              <Contact />
            ) : (
              <NotFound />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default SlugLayout;
