"use client";

import { useMemo, useState } from "react";
import { useTransitionEngine } from "@/transition/engine/useTransitionEngine";

export const TransitionDebugPanel = () => {
  const [open, setOpen] = useState(false);
  const { state } = useTransitionEngine();

  const logTail = useMemo(() => state.log.slice(-12).reverse(), [state.log]);

  return (
    <div className="fixed bottom-4 right-4 z-20 max-w-[420px]">
      <button
        className="px-3 py-2 rounded bg-black text-white text-sm"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Hide" : "Show"} Transition Debug
      </button>

      {open && (
        <div className="mt-2 rounded border border-border-default bg-white/95 p-3 text-xs max-h-[45vh] overflow-auto">
          <p className="font-semibold">Phase: {state.phase}</p>
          <p>Active: {state.activePath}</p>
          <p>Pending: {state.pendingPath ?? "none"}</p>
          <p>Queued: {state.queuedPath ?? "none"}</p>
          <p>Menu: {state.menuState}</p>
          <p>Viewport: {state.viewport.mode}</p>
          <p>Error: {state.lastError ?? "none"}</p>

          <hr className="my-2" />

          <div className="custom-flex-col gap-1.5">
            {logTail.map((entry) => (
              <div key={`${entry.at}-${entry.event}`} className="border-b border-border-default pb-1">
                <p className="font-semibold">
                  #{entry.id} {entry.event} [{entry.phase}]
                </p>
                <p>{entry.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
