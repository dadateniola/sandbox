// Types
import type { Project, ProjectCardProps } from "./types";

// Images
import Ilona from "@/public/images/ilona.png";
import OneEye from "@/public/images/one-eye.png";
import Khamkeo from "@/public/images/khamkeo.png";
import Mathilde from "@/public/images/mathilde.png";
import BeSilent from "@/public/images/be-silent.png";
import Wilkerson from "@/public/images/wilkerson.png";
import Vinogradov from "@/public/images/vinogradov.png";

// Constants
export const PROJECTS = [
  "dancing-in-black-and-white",
  "style-and-fashion",
  "one-eye",
  "week-fashion",
  "be-silent",
  "cigarette-and-tobacco",
  "wonderful-body",
] as const;

export const PROJECTS_DATA: Record<Project, ProjectCardProps> = {
  "dancing-in-black-and-white": {
    title: "Dancing in Black & White",
    image: Vinogradov,
  },

  "style-and-fashion": {
    title: "Style & Fashion",
    image: Wilkerson,
  },
  "one-eye": {
    title: "One Eye",
    image: OneEye,
  },
  "week-fashion": {
    title: "Week Fashion",
    image: Ilona,
  },
  "be-silent": {
    title: "Be Silent",
    image: BeSilent,
  },
  "cigarette-and-tobacco": {
    title: "Cigarette & Tobacco",
    image: Khamkeo,
  },
  "wonderful-body": {
    title: "Wonderful Body",
    image: Mathilde,
  },
};

export const PROJECTS_GRID: (ProjectCardProps | number)[] = [
  {
    ...PROJECTS_DATA["dancing-in-black-and-white"],
    layout: { cols: 5, rows: 2, centered: true },
  },
  1,
  {
    ...PROJECTS_DATA["style-and-fashion"],
    layout: { cols: 3 },
  },
  1,
  1,
  {
    ...PROJECTS_DATA["one-eye"],
    layout: { cols: 3 },
  },
  1,
  1,
  {
    ...PROJECTS_DATA["week-fashion"],
    layout: { cols: 3 },
  },
  1,
  {
    ...PROJECTS_DATA["be-silent"],
    layout: { cols: 5 },
  },
  {
    ...PROJECTS_DATA["cigarette-and-tobacco"],
    layout: { cols: 5 },
  },
  1,
  {
    ...PROJECTS_DATA["wonderful-body"],
    layout: { cols: 3 },
  },
];
