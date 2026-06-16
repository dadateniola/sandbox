"use client";

// Imports
import { useEffect } from "react";
import { useTransitionEngine } from "./TransitionContext";
import { getTransition } from "../registry/transition-registry";

const TransitionOrchestrator = () => {
  // Hooks
  const { state, dispatch } = useTransitionEngine();

  // Effects
  useEffect(() => {
    if (state.phase !== "preparing") return;

    const request = state.request;

    const run = async () => {
      if (!request?.type) return;

      const transition = getTransition(request.type);
      await transition.run({ state, request, dispatch });

      dispatch({ type: "CLEANUP", state: state.cleanup });
    };

    run();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== "idle" || !state.queuedPath) return;

    dispatch({
      type: "NAVIGATE",
      to: state.queuedPath,
      scrollY: window.scrollY,
    });
  }, [state.phase, state.queuedPath, dispatch]);

  return null;
};

export default TransitionOrchestrator;
