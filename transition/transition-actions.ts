import type { Dispatch, MutableRefObject, SetStateAction } from "react";

import type { RouteState, ViewportState } from "./transition-state";

type CommitNavigationArgs = {
  nextPage: string;
  queuedPathRef: MutableRefObject<string | null>;
  isTransitioningRef: MutableRefObject<boolean>;
  setRouteState: Dispatch<SetStateAction<RouteState>>;
};

type HandlePathnameChangeArgs = {
  pathname: string;
  activePath: string;
  transitioningPath: string | null;
  queuedPathRef: MutableRefObject<string | null>;
  isTransitioningRef: MutableRefObject<boolean>;
  setRouteState: Dispatch<SetStateAction<RouteState>>;
  setViewportState: Dispatch<SetStateAction<ViewportState>>;
};

export const commitNavigation = ({
  nextPage,
  queuedPathRef,
  isTransitioningRef,
  setRouteState,
}: CommitNavigationArgs) => {
  setRouteState(() => {
    if (queuedPathRef.current) {
      const queuedPath = queuedPathRef.current;
      queuedPathRef.current = null;
      isTransitioningRef.current = true;

      return {
        active: nextPage,
        transitioning: queuedPath,
      };
    }

    isTransitioningRef.current = false;
    return { active: nextPage, transitioning: null };
  });
};

export const handlePathnameChange = ({
  pathname,
  activePath,
  transitioningPath,
  queuedPathRef,
  isTransitioningRef,
  setRouteState,
  setViewportState,
}: HandlePathnameChangeArgs) => {
  if (pathname === activePath || transitioningPath === pathname) return;

  if (isTransitioningRef.current) {
    queuedPathRef.current = pathname;
    return;
  }

  isTransitioningRef.current = true;
  setViewportState({ mode: "fixed", scrollY: window.scrollY });
  setRouteState((prev) => ({
    active: prev.active,
    transitioning: pathname,
  }));
};
