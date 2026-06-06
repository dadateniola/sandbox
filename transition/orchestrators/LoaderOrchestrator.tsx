"use client";

import { useEffect } from "react";
import { useTransitionEngine } from "../engine/useTransitionEngine";
import { getTransition } from "../registry/transition-registry";

/**
 * Loader orchestrator controls the boot transition only.
 */
export const LoaderOrchestrator = () => {
  const { state, dispatch } = useTransitionEngine();

  useEffect(() => {
    if (state.phase !== "preparing") return;
    if (!state.request || state.request.kind !== "loader-complete") return;

    const request = state.request;

    let cancelled = false;

    const run = async () => {
      try {
        dispatch({
          type: "PHASE_CHANGED",
          phase: "entering",
          message: "Loader transition started",
        });

        const transition = getTransition(request.type);
        await transition.run({ request, state, dispatch });
        if (cancelled) return;

        dispatch({
          type: "PHASE_CHANGED",
          phase: "completed",
          message: "Loader transition completed",
        });

        dispatch({
          type: "TRANSITION_COMPLETE",
          message: "Loader lifecycle closed",
        });
      } catch (error) {
        dispatch({
          type: "TRANSITION_FAILED",
          error:
            error instanceof Error ? error.message : "Unknown loader transition error",
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
