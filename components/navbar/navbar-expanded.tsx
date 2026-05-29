"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Imports
import { cn } from "@/utils/cn";
import { PAGE_DATA, PAGES } from "../global/data";
import { isActiveRoute } from "@/utils/isActiveRoute";

const NavbarExpanded = () => {
  // Hooks
  const pathname = usePathname();

  return (
    <div className="size-full py-8.5 px-10 custom-flex-col bg-background">
      <div className="flex-1 min-h-0 custom-flex-center">
        <div className="flex flex-col items-center gap-[min(4vh,40px)]">
          {PAGES.map((page, index) => {
            const { label } = PAGE_DATA[page];

            return (
              <Link
                key={page}
                href={page}
                className="flex items-center gap-12.5"
              >
                <p className="text-text-primary text-[30px] leading-[120%]">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <p
                  className={cn(
                    "text-[min(5vw,100px)] hover:text-text-primary transition-colors duration-200 leading-[110%] uppercase",
                    isActiveRoute({ href: page, pathname }) &&
                      "text-text-primary",
                  )}
                >
                  {label}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="relative h-0">
        <div className="absolute bottom-0 left-0 right-0 w-full flex items-center justify-between [&>p]:leading-[160%]">
          <p>© Designed by Pawel Gola</p>
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
  );
};

export default NavbarExpanded;
