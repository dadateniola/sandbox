// Imports
import { PROJECTS } from "./data";

export type Project = (typeof PROJECTS)[number];

export interface ProjectCardProps {
  title: string;
  image: StaticImageData;
  layout?: { cols?: number; rows?: number; centered?: boolean };
}
