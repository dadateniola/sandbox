// Types
import type { GridItem, GridItemSpan, GridLayout } from "../global/types";

// Imports
import { PROJECT_KEYS } from "./data";

export type ProjectKey = (typeof PROJECT_KEYS)[number];

export type ProjectDefinition = {
  slug: ProjectKey;
  title: string;
  coverImage: StaticImageData;
  details: { year: number; service: string; client: string };
  gallery?: GridLayout<
    Extract<GridItem, { type: "image" }> | Extract<GridItem, { type: "spacer" }>
  >;
};
export interface ProjectCardProps extends ProjectDefinition {
  span?: GridItemSpan;
}

export interface GalleryImageProps {
  alt?: string;
  span?: GridItemSpan;
  src: StaticImageData;
}

export interface ProjectGridProps {
  layout: GridLayout;
}

export interface ProjectDetailProps {
  projectId?: string;
}

export interface ProjectDetailAboutProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}
