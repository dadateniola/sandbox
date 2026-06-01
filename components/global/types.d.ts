// Imports
import { PAGES } from "./data";

export type GlobalContextType = {
  menuState: MenuState;
  routeState: RouteState;
  viewportState: ViewportState;
  isTransitioningRef: React.MutableRefObject<boolean>;
  queuedPathRef: React.MutableRefObject<string | null>;
  navbarExpandedRef: React.MutableRefObject<HTMLDivElement | null>;

  commitNavigation: (nextPage: string) => void;
  setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
  setRouteState: React.Dispatch<React.SetStateAction<RouteState>>;
  createTransition: (args: CreateTransitionArgs) => gsap.core.Timeline;
  setViewportState: React.Dispatch<React.SetStateAction<ViewportState>>;
};

export type Page = (typeof PAGES)[number];

export type RouteState = {
  active: string;
  transitioning: string | null;
};

export type MenuState = "open" | "opening" | "closing" | "closed" | "hijacked";

export type ViewportState = {
  mode: "static" | "fixed";
  scrollY: number;
};

export type CreateTransitionArgs = {
  exiting: Element;
  entering: Element;
  options?: {
    skipEntering?: boolean;
  };
};

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
