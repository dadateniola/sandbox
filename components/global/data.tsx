import { JSX } from "react";

// Types
import type { Page } from "./types";

// Pages
import Home from "../home/home";
import About from "../about/about";
import Contact from "../contact/contact";
import Projects from "../projects/projects";
import Exhibitions from "../exhibitions/exhibitions";

// Imports
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

// Constants
export const TL_DEFAULTS = {
  ease: CustomEase.create(
    "custom",
    "M0,0 C0.173,0 0.242,0.036 0.322,0.13 0.401,0.223 0.412,0.373 0.465,0.512 0.508,0.628 0.515,0.833 0.621,0.925 0.694,0.989 0.869,1 1,1 ",
  ),
  duration: 1.2,
};

export const PAGES = [
  "/",
  "/projects",
  "/exhibitions",
  "/about",
  "/contact",
] as const;

export const PAGE_DATA: Record<
  Page,
  { label: string; content: () => JSX.Element }
> = {
  "/": { label: "Home", content: Home },
  "/projects": { label: "Projects", content: Projects },
  "/exhibitions": { label: "Exhibitions", content: Exhibitions },
  "/about": { label: "About", content: About },
  "/contact": { label: "Contact", content: Contact },
};
