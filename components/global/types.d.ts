// Imports
import { PAGES } from "./data";

export type Page = (typeof PAGES)[number];

export interface NavbarProps {
  className?: string;
}

export interface CTAProps {
  size: number;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
