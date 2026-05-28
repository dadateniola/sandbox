// Types
import type { ProjectCardProps } from "../global/types";

// Imports
import { PROJECTS_DATA } from "../projects/data";

// Constants
export const SERVICES = [
  "photo shooting",
  "video editing",
  "art direction",
] as const;

export const HOME_PROJECTS_GRID: (ProjectCardProps | number)[] = [
  {
    ...PROJECTS_DATA["dancing-in-black-and-white"],
    layout: { cols: 5, rows: 2 },
  },
  2,
  {
    ...PROJECTS_DATA["style-and-fashion"],
    layout: { cols: 3 },
  },
  1,
  {
    ...PROJECTS_DATA["one-eye"],
    layout: { cols: 3, rows: 2 },
  },
  1,
  {
    ...PROJECTS_DATA["week-fashion"],
    layout: { cols: 3 },
  },
];
