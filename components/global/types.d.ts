// Imports
import { PAGES } from "./data";
import type {
  CreateTransitionArgs,
  MenuState,
  RouteState,
  TransitionContextType,
  ViewportState,
} from "@/transition/transition-state";

export type TransitionContextValue = TransitionContextType;

export type Page = (typeof PAGES)[number];

export type { RouteState, MenuState, ViewportState, CreateTransitionArgs };

export interface PageInitProps {
  children: React.ReactNode;
}

export interface PageWrapperProps {
  className?: string;
  children: React.ReactNode;
  state: "entering" | "active" | "exiting" | "inactive" | "fixed";
}

export interface CTAProps {
  size: number;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
