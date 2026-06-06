"use client";

import { useEffect } from "react";
import { useTransitionEngine } from "../engine/useTransitionEngine";
import { getTransition } from "../registry/transition-registry";

/**
 * Navigation orchestrator owns only route transition execution.
 *
 * Why this file exists:
 * - It separates lifecycle coordination from render components.
 * - It is the main event-to-animation bridge for page navigation.
 */
export const NavigationOrchestrator = () => {
  const { state, dispatch } = useTransitionEngine();

  useEffect(() => {
    if (state.phase !== "preparing") return;
    if (!state.request || state.request.kind !== "navigate") return;

    const request = state.request;

    let cancelled = false;

    const run = async () => {
      try {
        dispatch({
          type: "PHASE_CHANGED",
          phase: "exiting",
          message: "Navigation transition exiting phase",
        });

        dispatch({
          type: "PHASE_CHANGED",
          phase: "switching",
          message: "Navigation committed to pending path",
        });

        dispatch({
          type: "PHASE_CHANGED",
          phase: "entering",
          message: "Navigation transition entering phase",
        });

        const transition = getTransition(request.type);
        await transition.run({ request, state, dispatch });
        if (cancelled) return;

        dispatch({
          type: "PHASE_CHANGED",
          phase: "settling",
          message: "Navigation transition settling",
        });

        dispatch({
          type: "PHASE_CHANGED",
          phase: "completed",
          message: "Navigation transition completed",
        });

        dispatch({
          type: "TRANSITION_COMPLETE",
          message: "Navigation lifecycle closed",
        });
      } catch (error) {
        dispatch({
          type: "TRANSITION_FAILED",
          error:
            error instanceof Error
              ? error.message
              : "Unknown navigation transition error",
        });
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [dispatch, state.phase, state.request?.id]);

  return null;
};
