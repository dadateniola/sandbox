// Types
import type { GridLayout } from "../global/types";

// Constants
export const SERVICES = [
  "photo shooting",
  "video editing",
  "art direction",
] as const;

export const HOME_PROJECTS_LAYOUT: GridLayout = {
  cols: 10,
  gapY: 120,
  items: [
    {
      type: "project",
      slug: "dancing-in-black-and-white",
      span: { cols: 5, rows: 2 },
    },
    { type: "spacer", span: 2 },
    { type: "project", slug: "style-and-fashion", span: { cols: 3 } },
    { type: "spacer", span: 1 },
    { type: "project", slug: "one-eye", span: { cols: 3, rows: 2 } },
    { type: "spacer", span: 1 },
    { type: "project", slug: "week-fashion", span: { cols: 3 } },
  ],
};
