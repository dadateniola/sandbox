import { StaticImageData } from "next/image";

// Imports
import { PAGES } from "./data";

export type Page = (typeof PAGES)[number];

export type Transition = {
  path: string;
  scrollY: number;
} | null;

export type MenuState = "open" | "opening" | "closing" | "closed" | "hijacked";

export interface PageWrapperProps {
  className?: string;
  scrollOffset?: number;
  children: React.ReactNode;
  state: "entering" | "active" | "exiting" | "inactive" | "fixed";
}

export interface CTAProps {
  size: number;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export interface HomeSectionProps {
  href: string;
  title: string;
  children: React.ReactNode;
}

export interface ProjectCardProps {
  title: string;
  image: StaticImageData;
  layout?: { cols?: number; rows?: number; centered?: boolean };
}

export interface ExhibitionCardProps {
  title: string;
  description: string;
  image: StaticImageData;
  date: { month: string; day: number };
}
