import { JSX } from "react";

// TYpes
import type { Page } from "./types";

// Pages
import Home from "../home/home";
import About from "../about/about";
import Contact from "../contact/contact";
import Projects from "../projects/projects";
import Exhibitions from "../exhibitions/exhibitions";

// Constants
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
