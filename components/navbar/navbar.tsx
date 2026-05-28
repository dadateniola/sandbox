"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Types
import type { NavbarProps } from "./types";

// Imports
import { cn } from "@/utils/cn";
import { NAVBAR_LINKS } from "./data";
import { isActiveRoute } from "@/utils/isActiveRoute";

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  // Hooks
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 w-full pt-12.5 px-10 flex items-end justify-between gap-10",
        className,
      )}
    >
      <Link href="/" className="text-2xl leading-[110%]">
        Jacob Grönberg
      </Link>

      <div className="flex items-center gap-6">
        {NAVBAR_LINKS.map(({ path, label }) => (
          <Link
            key={path}
            href={path}
            className={cn(
              "text-lg hover:text-text-primary transition-colors duration-200 leading-[100%]",
              isActiveRoute({ href: path, pathname }) && "text-text-primary",
            )}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
