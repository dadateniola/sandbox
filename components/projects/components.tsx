import Image from "next/image";

// Types
import type { ProjectCardProps, ProjectGridProps } from "./types";

// Imports
import { cn } from "@/utils/cn";
import { PROJECTS } from "./data";

// Components
export const ProjectCard: React.FC<ProjectCardProps> = ({
  span,
  image,
  title,
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

    <Image src={image} alt={title} className="w-full h-auto object-cover" />

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

      return (
        <ProjectCard
          key={item.slug}
          span={item.span}
          title={project.title}
          image={project.coverImage}
        />
      );
    })}
  </div>
);
