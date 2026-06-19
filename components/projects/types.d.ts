// Types
import type { GridItemSpan, GridLayout } from "../global/types";

export type ProjectKey =
  | "dancing-in-black-and-white"
  | "style-and-fashion"
  | "one-eye"
  | "week-fashion"
  | "be-silent"
  | "cigarette-and-tobacco"
  | "wonderful-body";

export type ProjectDefinition = {
  slug: ProjectKey;
  title: string;
  coverImage: StaticImageData;
};
export interface ProjectCardProps extends ProjectDefinition {
  span?: GridItemSpan;
}

export interface ProjectGridProps {
  layout: GridLayout;
}

export interface ProjectDetailProps {
  projectId?: string;
}
