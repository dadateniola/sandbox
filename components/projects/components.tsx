import Link from "next/link";
import Image from "next/image";

// Types
import type { ProjectCardProps, ProjectGridProps } from "./types";

// Imports
import { cn } from "@/utils/cn";
import { PROJECTS } from "./data";

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

    <Link href={`/projects/${slug}`} className="relative overflow-hidden group">
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

export const ProjectGrid: React.FC<ProjectGridProps> = ({ layout }) => (
  <div
    className="grid"
    style={{
      gap: `${layout.gapY}px 0`,
      gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
    }}
  >
    {layout.items.map((item, index) => {
      if (item.type === "spacer") {
        return (
          <div key={index} style={{ gridColumn: `span ${item.span}` }}></div>
        );
      }

      const project = PROJECTS[item.slug];

      return <ProjectCard key={item.slug} span={item.span} {...project} />;
    })}
  </div>
);
