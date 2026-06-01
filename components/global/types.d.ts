// Imports
import { PAGES } from "./data";

export type GlobalContextType = {
  menuState: MenuState;
  routeState: RouteState;
  isTransitioningRef: React.MutableRefObject<boolean>;
  queuedPathRef: React.MutableRefObject<string | null>;
  navbarExpandedRef: React.MutableRefObject<HTMLDivElement | null>;

  commitNavigation: (nextPage: string) => void;
  setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
  setRouteState: React.Dispatch<React.SetStateAction<RouteState>>;
  createTransition: (args: CreateTransitionArgs) => gsap.core.Timeline;
};

export type Page = (typeof PAGES)[number];

export type RouteState = {
  active: string;
  transitioning: { path: string; scrollY: number } | null;
};

export type MenuState = "open" | "opening" | "closing" | "closed" | "hijacked";

export type CreateTransitionArgs = {
  exiting: Element;
  entering: Element;
  options?: {
    skipEntering?: boolean;
  };
};

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
