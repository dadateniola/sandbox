"use client";

import { useEffect } from "react";
import { useTransitionEngine } from "../engine/useTransitionEngine";
import { getTransition } from "../registry/transition-registry";

/**
 * Menu orchestrator isolates menu transitions from route transitions.
 */
export const MenuOrchestrator = () => {
  const { state, dispatch } = useTransitionEngine();

  useEffect(() => {
    if (state.phase !== "preparing") return;
    if (!state.request) return;
    if (state.request.kind !== "menu-open" && state.request.kind !== "menu-close") {
      return;
    }

    const request = state.request;

    let cancelled = false;

    const run = async () => {
      try {
        dispatch({
          type: "PHASE_CHANGED",
          phase: "exiting",
          message: "Menu transition started",
        });

        const transition = getTransition(request.type);
        await transition.run({ request, state, dispatch });
        if (cancelled) return;

        dispatch({
          type: "PHASE_CHANGED",
          phase: "completed",
          message: "Menu transition completed",
        });

        dispatch({
          type: "TRANSITION_COMPLETE",
          message: "Menu lifecycle closed",
        });
      } catch (error) {
        dispatch({
          type: "TRANSITION_FAILED",
          error: error instanceof Error ? error.message : "Unknown menu transition error",
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
