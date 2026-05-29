import Link from "next/link";
import Image from "next/image";

// Types
import type {
  CTAProps,
  HomeSectionProps,
  PageWrapperProps,
  ProjectCardProps,
  ExhibitionCardProps,
} from "./types";

// Images
import { ArrowRight, ArrowTopRight } from "../svg/svg";

// Imports
import { cn } from "@/utils/cn";
import React from "react";

// Components
export const PageLoader: React.FC = () => (
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
);

export const PageMobile: React.FC = () => (
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
);

export const PageWrapper = React.forwardRef<HTMLDivElement, PageWrapperProps>(
  ({ state, children, className, scrollOffset, ...props }, ref) => {
    const shouldBeFixed =
      state === "exiting" || state === "entering" || state === "fixed";

    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(
          "w-full h-screen",
          shouldBeFixed ? "fixed" : "relative",
          {
            "z-2": state === "exiting",
            "z-1": state === "entering",
          },
          className,
        )}
        {...props}
      >
        <div
          data-overlay
          className="absolute z-2 inset-0 bg-bg-secondary pointer-events-none opacity-0 invisible"
        ></div>

        <div
          data-content
          className={cn(
            "z-1 w-full h-screen",
            shouldBeFixed ? "absolute" : "relative",
          )}
        >
          <div
            className={cn(
              state === "fixed"
                ? "size-full"
                : "w-full h-max px-15 xl:px-35 bg-background",
            )}
            style={{
              transform:
                state === "exiting"
                  ? `translateY(-${scrollOffset}px)`
                  : undefined,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

PageWrapper.displayName = "PageWrapper";

export const CTA: React.FC<CTAProps> = ({
  size,
  style,
  className,
  children,
}) => (
  <div className={cn("relative", className)}>
    <div
      className="absolute left-0 top-1/2 -translate-x-2.5 -translate-y-1/2 custom-flex-center bg-bg-primary rounded-full"
      style={{ width: size - 20, height: size - 20 }}
    >
      <p className="text-white text-center" style={style}>
        {children}
      </p>
    </div>

    <div
      className="rounded-full border border-border-primary"
      style={{ width: size, height: size }}
    ></div>
  </div>
);

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

export const ProjectCard: React.FC<ProjectCardProps> = ({
  image,
  title,
  layout,
}) => (
  <div
    className={cn(
      "custom-flex-col gap-2.5",
      layout?.centered && "justify-center",
    )}
    style={{
      gridRow: layout?.rows ? `span ${layout.rows}` : "span 1",
      gridColumn: layout?.cols ? `span ${layout.cols}` : "span 1",
    }}
  >
    <p className="text-3xl leading-[120%] uppercase">
      {title.split(" ").map((word, index) =>
        index === title.split(" ").length - 1 ? (
          <span key={index} className="text-text-primary capitalize">
            {word}
          </span>
        ) : (
          word + " "
        ),
      )}
    </p>

    <Image src={image} alt={title} className="w-full h-auto object-cover" />

    <p className="leading-[160%]">
      New York <br />
      October 2021
    </p>
  </div>
);

export const ExhibitionCard: React.FC<ExhibitionCardProps> = ({
  date,
  image,
  title,
  description,
}) => (
  <div className="flex items-center justify-between gap-12">
    <div className="flex items-center gap-12">
      <div className="relative size-57.5 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="400px"
          className="object-cover"
        />
      </div>

      <div className="custom-flex-col gap-5">
        <div className="custom-flex-col gap-2">
          <p className="leading-[160%]">New York — Town Hall — 2022</p>

          <p className="text-[40px] leading-[110%] uppercase">
            {title.split(" ").map((word, index) =>
              index === title.split(" ").length - 1 ? (
                <span key={index} className="text-text-primary capitalize">
                  {word}
                </span>
              ) : (
                word + " "
              ),
            )}
          </p>
        </div>

        <p className="max-w-[40vw] leading-[160%]">{description}</p>
      </div>
    </div>

    <div className="flex items-center gap-3 text-text-primary">
      <p className="text-lg leading-[120%] whitespace-nowrap">Buy Ticket</p>

      <ArrowTopRight />
    </div>

    <div className="flex flex-col items-end text-text-primary">
      <p className="text-3xl capitalize leading-[110%]">{date.month}</p>
      <p className="text-[min(6vw,100px)] leading-[110%]">
        {String(date.day).padStart(2, "0")}
      </p>
    </div>
  </div>
);
