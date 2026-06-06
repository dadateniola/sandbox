"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { commitNavigation as commitNavigationAction, handlePathnameChange } from "./transition-actions";
import { createTransition } from "./create-transition";
import {
  createInitialRouteState,
  createInitialViewportState,
  type MenuState,
  type TransitionContextType,
} from "./transition-state";

const GlobalContext = createContext<TransitionContextType | null>(null);

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const [routeState, setRouteState] = useState(() => createInitialRouteState(pathname));
  const [menuState, setMenuState] = useState<MenuState>("closed");
  const [viewportState, setViewportState] = useState(createInitialViewportState);

  const activePath = routeState.active;
  const transitioningPath = routeState.transitioning;

  const isTransitioningRef = useRef(false);
  const queuedPathRef = useRef<string | null>(null);
  const navbarExpandedRef = useRef<HTMLDivElement>(null);

  const commitNavigation = (nextPage: string) => {
    commitNavigationAction({
      nextPage,
      queuedPathRef,
      isTransitioningRef,
      setRouteState,
    });
  };

  useEffect(() => {
    handlePathnameChange({
      pathname,
      activePath,
      transitioningPath,
      queuedPathRef,
      isTransitioningRef,
      setRouteState,
      setViewportState,
    });
  }, [pathname, activePath, transitioningPath]);

  useLayoutEffect(() => {
    if (viewportState.mode === "static") {
      window.scrollTo(0, viewportState.scrollY);
    }
  }, [viewportState]);

  return (
    <GlobalContext.Provider
      value={{
        menuState,
        routeState,
        queuedPathRef,
        viewportState,
        navbarExpandedRef,
        isTransitioningRef,
        setMenuState,
        setRouteState,
        commitNavigation,
        createTransition,
        setViewportState,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export { GlobalContext };
