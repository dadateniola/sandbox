import Link from "next/link";
import Image from "next/image";

// Types
import type {
  ProjectCardProps,
  ProjectGridProps,
  GalleryImageProps,
  ProjectDetailAboutProps,
} from "./types";

// Imports
import { cn } from "@/utils/cn";
import { getProjectLink, PROJECTS } from "./data";

// Components
export const ProjectCard: React.FC<ProjectCardProps> = ({
  slug,
  span,
  title,
  coverImage,
}) => (
  <div
    className={cn(
      "custom-flex-col gap-2.5",
      span?.centered && "justify-center",
    )}
    style={{
      gridRow: span?.rows ? `span ${span.rows}` : "span 1",
      gridColumn: span?.cols ? `span ${span.cols}` : "span 1",
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

    <Link
      href={getProjectLink(slug)}
      className="relative overflow-hidden group"
    >
      <Image
        src={coverImage}
        alt={title}
        className={cn(
          "w-full h-auto object-cover",
          "group-hover:scale-105 transition-transform duration-500",
        )}
      />
    </Link>

    <p className="leading-[160%]">
      New York <br />
      October 2021
    </p>
  </div>
);

export const GalleryImage: React.FC<GalleryImageProps> = ({
  src,
  alt = "Gallery Image",
  span,
}) => (
  <div
    className={cn("custom-flex-col", span?.centered && "justify-center")}
    style={{
      gridRow: span?.rows ? `span ${span.rows}` : "span 1",
      gridColumn: span?.cols ? `span ${span.cols}` : "span 1",
    }}
  >
    <Image src={src} alt={alt} className="w-full h-auto object-cover" />
  </div>
);

export const ProjectGrid: React.FC<ProjectGridProps> = ({ layout }) => (
  <div
    className="grid"
    style={{
      gap: `${layout.gapY}px 0`,
      gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
    }}
  >
    {layout.items.map((item, index) => {
      switch (item.type) {
        case "project":
          return (
            <ProjectCard
              key={item.slug}
              span={item.span}
              {...PROJECTS[item.slug]}
            />
          );
        case "image":
          return <GalleryImage key={index} {...item} />;
        case "spacer":
          return (
            <div key={index} style={{ gridColumn: `span ${item.span}` }}></div>
          );
      }
    })}
  </div>
);

export const ProjectDetailAbout: React.FC<ProjectDetailAboutProps> = ({
  title,
  children,
  className,
}) => (
  <div className="flex items-start gap-25">
    <p className="w-37.5 text-[30px] leading-[120%] uppercase">{title}</p>

    <div className={cn("flex-1 min-w-0", className)}>{children}</div>
  </div>
);
