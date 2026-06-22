// Types
import type { ProjectKey } from "../projects/types";

export type RouteKey =
  | "/"
  | "/projects"
  | "/projects/:projectId"
  | "/exhibitions"
  | "/about"
  | "/contact";

export type RouteDefinition = {
  path: RouteKey;
  label: string;
  content: (params?: Record<string, string>) => JSX.Element;
};

export type GridItemSpan = {
  cols?: number;
  rows?: number;
  centered?: boolean;
};

export type GridItem =
  | { type: "image"; src: StaticImageData; alt?: string; span?: GridItemSpan }
  | { type: "project"; slug: ProjectKey; span?: GridItemSpan }
  | { type: "spacer"; span: number };

export type GridLayout<T = GridItem> = {
  cols: number;
  gapY?: number;
  items: T[];
};

export interface CTAProps {
  size: number;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
