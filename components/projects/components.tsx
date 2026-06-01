import Image from "next/image";

// Types
import type { ProjectCardProps } from "./types";

// Imports
import { cn } from "@/utils/cn";

// Components
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
