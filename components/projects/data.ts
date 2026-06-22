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

// Gallery Images
import Eve from "@/public/images/eve.png";
import Jack from "@/public/images/jack.png";
import Mike from "@/public/images/mike.png";
import Bruno from "@/public/images/bruno.png";
import Haryo from "@/public/images/haryo.png";
import Tyler from "@/public/images/tyler.png";
import Olenka from "@/public/images/olenka.png";
import Tobias from "@/public/images/tobias.png";
import Huseyin from "@/public/images/huseyin.png";
import Hernandez from "@/public/images/hernandez.png";

// Constants
export const PROJECT_KEYS = [
  "dancing-in-black-and-white",
  "style-and-fashion",
  "one-eye",
  "week-fashion",
  "be-silent",
  "cigarette-and-tobacco",
  "wonderful-body",
] as const;

export const PROJECTS: Record<ProjectKey, ProjectDefinition> = {
  "dancing-in-black-and-white": {
    slug: "dancing-in-black-and-white",
    title: "Dancing in Black & White",
    coverImage: Vinogradov,
    details: { year: 2022, service: "Photography", client: "Vinogradov" },
    gallery: {
      cols: 10,
      gapY: 120,
      items: [
        { type: "image", src: Olenka, span: { cols: 5 } },
        { type: "spacer", span: 1 },
        { type: "image", src: Bruno, span: { cols: 3, centered: true } },
        { type: "image", src: Jack, span: { cols: 10 } },
        { type: "spacer", span: 1 },
        { type: "image", src: Huseyin, span: { cols: 3, centered: true } },
        { type: "spacer", span: 1 },
        { type: "image", src: Haryo, span: { cols: 5 } },
      ],
    },
  },

  "style-and-fashion": {
    slug: "style-and-fashion",
    title: "Style & Fashion",
    coverImage: Wilkerson,
    details: { year: 2021, service: "Fashion", client: "Wilkerson" },
    gallery: {
      cols: 10,
      gapY: 120,
      items: [
        { type: "image", src: Eve, span: { cols: 6 } },
        { type: "spacer", span: 1 },
        { type: "image", src: Tyler, span: { cols: 3 } },
        { type: "image", src: Tobias, span: { cols: 10 } },
      ],
    },
  },
  "one-eye": {
    slug: "one-eye",
    title: "One Eye",
    coverImage: OneEye,
    details: { year: 2020, service: "Photography", client: "OneEye" },
    gallery: {
      cols: 10,
      gapY: 120,
      items: [
        { type: "image", src: Mike, span: { cols: 4 } },
        { type: "spacer", span: 1 },
        { type: "image", src: Hernandez, span: { cols: 5 } },
        { type: "image", src: Eve, span: { cols: 10 } },
      ],
    },
  },
  "week-fashion": {
    slug: "week-fashion",
    title: "Week Fashion",
    coverImage: Ilona,
    details: { year: 2019, service: "Fashion", client: "Ilona" },
    gallery: {
      cols: 10,
      gapY: 120,
      items: [
        { type: "image", src: Tyler, span: { cols: 10 } },
        { type: "spacer", span: 2 },
        { type: "image", src: Tobias, span: { cols: 6 } },
        { type: "spacer", span: 2 },
        { type: "image", src: Mike, span: { cols: 4, centered: true } },
      ],
    },
  },
  "be-silent": {
    slug: "be-silent",
    title: "Be Silent",
    coverImage: BeSilent,
    details: { year: 2018, service: "Photography", client: "BeSilent" },
    gallery: {
      cols: 10,
      gapY: 120,
      items: [
        { type: "spacer", span: 1 },
        { type: "image", src: Hernandez, span: { cols: 4 } },
        { type: "spacer", span: 1 },
        { type: "image", src: Eve, span: { cols: 4 } },
        { type: "image", src: Mike, span: { cols: 10 } },
      ],
    },
  },
  "cigarette-and-tobacco": {
    slug: "cigarette-and-tobacco",
    title: "Cigarette & Tobacco",
    coverImage: Khamkeo,
    details: { year: 2017, service: "Photography", client: "Khamkeo" },
    gallery: {
      cols: 10,
      gapY: 120,
      items: [
        { type: "image", src: Tobias, span: { cols: 5 } },
        { type: "spacer", span: 1 },
        { type: "image", src: Tyler, span: { cols: 4 } },
        { type: "spacer", span: 3 },
        { type: "image", src: Hernandez, span: { cols: 7 } },
      ],
    },
  },
  "wonderful-body": {
    slug: "wonderful-body",
    title: "Wonderful Body",
    coverImage: Mathilde,
    details: { year: 2016, service: "Photography", client: "Mathilde" },
    gallery: {
      cols: 10,
      gapY: 120,
      items: [
        { type: "image", src: Eve, span: { cols: 3, centered: true } },
        { type: "spacer", span: 1 },
        { type: "image", src: Mike, span: { cols: 6 } },
        { type: "image", src: Tobias, span: { cols: 5 } },
        { type: "spacer", span: 1 },
        { type: "image", src: Hernandez, span: { cols: 4 } },
      ],
    },
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

// Helpers
export const getProjectLink = (slug: ProjectKey) => `/projects/${slug}`;

export const getNextProject = (currentSlug: ProjectKey): ProjectDefinition => {
  const index = PROJECT_KEYS.indexOf(currentSlug);
  const nextIndex = (index + 1) % PROJECT_KEYS.length;

  return PROJECTS[PROJECT_KEYS[nextIndex]];
};
