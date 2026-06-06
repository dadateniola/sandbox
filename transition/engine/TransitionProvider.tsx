"use client";

import { useMemo, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import { TransitionContext } from "./TransitionContext";
import { createInitialTransitionState, transitionReducer } from "./transition-reducer";
import type { TransitionEvent } from "./transition-events";

export const TransitionProvider = ({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(
    transitionReducer,
    pathname,
    createInitialTransitionState,
  );

  const actions = useMemo(
    () => ({
      requestNavigation: (to: string, source: "url" | "ui" | "system" = "ui") => {
        dispatch({
          type: "NAVIGATE_REQUEST",
          to,
          source,
          scrollY: typeof window !== "undefined" ? window.scrollY : 0,
        });
      },
      requestMenuOpen: () => {
        dispatch({
          type: "MENU_OPEN_REQUEST",
          source: "ui",
          scrollY: typeof window !== "undefined" ? window.scrollY : 0,
        });
      },
      requestMenuClose: () => {
        dispatch({
          type: "MENU_CLOSE_REQUEST",
          source: "ui",
          scrollY: typeof window !== "undefined" ? window.scrollY : 0,
        });
      },
      requestLoaderComplete: () => {
        dispatch({ type: "LOADER_COMPLETE_REQUEST", source: "system" });
      },
    }),
    [],
  );

  const api = useMemo(
    () => ({ state, dispatch: dispatch as Dispatch<TransitionEvent>, actions }),
    [state, actions],
  );

  return (
    <TransitionContext.Provider value={api}>{children}</TransitionContext.Provider>
  );
};
