export type TransitionPhase =
  | "idle"
  | "preparing"
  | "exiting"
  | "switching"
  | "entering"
  | "settling"
  | "completed"
  | "failed";

export type TransitionKind =
  | "navigate"
  | "menu-open"
  | "menu-close"
  | "loader-complete"
  | "custom";

export type ViewportMode = "static" | "fixed";

export type MenuState = "closed" | "opening" | "open" | "closing";

export type TransitionTypeKey =
  | "page-default"
  | "menu-open"
  | "menu-close"
  | "loader-to-page";

export type TransitionRequest = {
  id: number;
  kind: TransitionKind;
  type: TransitionTypeKey;
  source: "url" | "ui" | "system";
  metadata?: Record<string, string>;
};

export type DebugLogEntry = {
  id: number;
  at: number;
  phase: TransitionPhase;
  event: string;
  message: string;
};

export type TransitionState = {
  phase: TransitionPhase;
  activePath: string;
  pendingPath: string | null;
  queuedPath: string | null;
  menuState: MenuState;
  viewport: {
    mode: ViewportMode;
    scrollY: number;
  };
  request: TransitionRequest | null;
  nextRequestId: number;
  isLoaderVisible: boolean;
  isMobileViewport: boolean;
  log: DebugLogEntry[];
  lastError: string | null;
};
