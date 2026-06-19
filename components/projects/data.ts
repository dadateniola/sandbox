// Types
import type { GridLayout } from "../global/types";
import type { ProjectDefinition, ProjectKey } from "./types";

// Images
import Ilona from "@/public/images/ilona.png";
import OneEye from "@/public/images/one-eye.png";
import Khamkeo from "@/public/images/khamkeo.png";
import Mathilde from "@/public/images/mathilde.png";
import BeSilent from "@/public/images/be-silent.png";
import Wilkerson from "@/public/images/wilkerson.png";
import Vinogradov from "@/public/images/vinogradov.png";

// Constants
export const PROJECTS: Record<ProjectKey, ProjectDefinition> = {
  "dancing-in-black-and-white": {
    slug: "dancing-in-black-and-white",
    title: "Dancing in Black & White",
    coverImage: Vinogradov,
  },

  "style-and-fashion": {
    slug: "style-and-fashion",
    title: "Style & Fashion",
    coverImage: Wilkerson,
  },
  "one-eye": {
    slug: "one-eye",
    title: "One Eye",
    coverImage: OneEye,
  },
  "week-fashion": {
    slug: "week-fashion",
    title: "Week Fashion",
    coverImage: Ilona,
  },
  "be-silent": {
    slug: "be-silent",
    title: "Be Silent",
    coverImage: BeSilent,
  },
  "cigarette-and-tobacco": {
    slug: "cigarette-and-tobacco",
    title: "Cigarette & Tobacco",
    coverImage: Khamkeo,
  },
  "wonderful-body": {
    slug: "wonderful-body",
    title: "Wonderful Body",
    coverImage: Mathilde,
  },
};

export const PROJECTS_LAYOUT: GridLayout = {
  cols: 10,
  gapY: 120,
  items: [
    {
      type: "project",
      slug: "dancing-in-black-and-white",
      span: { cols: 5, rows: 2, centered: true },
    },
    { type: "spacer", span: 1 },
    { type: "project", slug: "style-and-fashion", span: { cols: 3 } },
    { type: "spacer", span: 1 },
    { type: "spacer", span: 1 },
    { type: "project", slug: "one-eye", span: { cols: 3 } },
    { type: "spacer", span: 1 },
    { type: "spacer", span: 1 },
    { type: "project", slug: "week-fashion", span: { cols: 3 } },
    { type: "spacer", span: 1 },
    { type: "project", slug: "be-silent", span: { cols: 5 } },
    { type: "project", slug: "cigarette-and-tobacco", span: { cols: 5 } },
    { type: "spacer", span: 1 },
    { type: "project", slug: "wonderful-body", span: { cols: 3 } },
  ],
};
