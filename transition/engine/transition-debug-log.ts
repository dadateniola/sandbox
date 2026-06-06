import type { DebugLogEntry, TransitionPhase } from "./transition-types";

const MAX_LOG_ENTRIES = 200;

export const createLogEntry = ({
  id,
  event,
  phase,
  message,
}: {
  id: number;
  event: string;
  phase: TransitionPhase;
  message: string;
}): DebugLogEntry => ({
  id,
  at: Date.now(),
  event,
  phase,
  message,
});

export const pushLog = (
  current: DebugLogEntry[],
  entry: DebugLogEntry,
): DebugLogEntry[] => {
  const next = [...current, entry];
  if (next.length <= MAX_LOG_ENTRIES) return next;
  return next.slice(next.length - MAX_LOG_ENTRIES);
};
