import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import type gsap from "gsap";

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

export type TransitionContextType = {
  menuState: MenuState;
  routeState: RouteState;
  viewportState: ViewportState;
  isTransitioningRef: MutableRefObject<boolean>;
  queuedPathRef: MutableRefObject<string | null>;
  navbarExpandedRef: MutableRefObject<HTMLDivElement | null>;
  commitNavigation: (nextPage: string) => void;
  setMenuState: Dispatch<SetStateAction<MenuState>>;
  setRouteState: Dispatch<SetStateAction<RouteState>>;
  createTransition: (args: CreateTransitionArgs) => gsap.core.Timeline;
  setViewportState: Dispatch<SetStateAction<ViewportState>>;
};

export const createInitialRouteState = (pathname: string): RouteState => ({
  active: pathname,
  transitioning: null,
});

export const createInitialViewportState = (): ViewportState => ({
  mode: "static",
  scrollY: 0,
});
