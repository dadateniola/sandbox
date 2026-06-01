import Link from "next/link";

// Types
import type { HomeSectionProps } from "./types";

// Images
import { ArrowRight } from "../svg/svg";

// Components
export const HomeSection: React.FC<HomeSectionProps> = ({
  href,
  title,
  children,
}) => (
  <section id={title.split(" ").join("-").toLowerCase()}>
    <div className="custom-flex-col gap-32">
      <div className="flex items-center justify-between gap-10">
        <h2 className="text-[min(6vw,100px)] leading-[110%] uppercase">
          {title.split(" ").map((word, index) =>
            index === title.split(" ").length - 1 ? (
              <span key={index} className="text-text-primary capitalize">
                {word}
              </span>
            ) : (
              word + " "
            ),
          )}
        </h2>

        <Link href={href} className="flex items-center gap-3">
          <p className="text-lg leading-[120%]">View All</p>
          <ArrowRight />
        </Link>
      </div>

      {children}
    </div>
  </section>
);
