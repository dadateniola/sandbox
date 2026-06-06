import { canProcessEvent } from "./transition-machine";
import type { TransitionEvent } from "./transition-events";
import type { TransitionRequest, TransitionState } from "./transition-types";
import { createLogEntry, pushLog } from "./transition-debug-log";

const createInitialRequest = (
  state: TransitionState,
  request: Omit<TransitionRequest, "id">,
): TransitionRequest => ({
  ...request,
  id: state.nextRequestId,
});

export const createInitialTransitionState = (
  pathname: string,
): TransitionState => ({
  phase: "idle",
  activePath: pathname,
  pendingPath: null,
  queuedPath: null,
  menuState: "closed",
  viewport: {
    mode: "static",
    scrollY: 0,
  },
  request: null,
  nextRequestId: 1,
  isLoaderVisible: true,
  isMobileViewport: false,
  log: [],
  lastError: null,
});

export const transitionReducer = (
  state: TransitionState,
  event: TransitionEvent,
): TransitionState => {
  if (!canProcessEvent(state, event)) {
    return {
      ...state,
      log: pushLog(
        state.log,
        createLogEntry({
          id: state.request?.id ?? 0,
          event: event.type,
          phase: state.phase,
          message: "Ignored by state machine guard",
        }),
      ),
    };
  }

  switch (event.type) {
    case "SET_MOBILE_VIEWPORT": {
      return {
        ...state,
        isMobileViewport: event.isMobile,
      };
    }

    case "NAVIGATE_REQUEST": {
      if (event.to === state.activePath && state.phase === "idle") {
        return state;
      }

      if (state.phase !== "idle" && state.phase !== "failed") {
        return {
          ...state,
          queuedPath: event.to,
          log: pushLog(
            state.log,
            createLogEntry({
              id: state.request?.id ?? 0,
              event: event.type,
              phase: state.phase,
              message: `Queued navigation to ${event.to}`,
            }),
          ),
        };
      }

      const request = createInitialRequest(state, {
        kind: "navigate",
        type: event.transitionType ?? "page-default",
        source: event.source,
        metadata: { to: event.to },
      });

      return {
        ...state,
        phase: "preparing",
        pendingPath: event.to,
        viewport: {
          mode: "fixed",
          scrollY: event.scrollY,
        },
        request,
        nextRequestId: state.nextRequestId + 1,
        lastError: null,
        log: pushLog(
          state.log,
          createLogEntry({
            id: request.id,
            event: event.type,
            phase: "preparing",
            message: `Preparing navigation to ${event.to}`,
          }),
        ),
      };
    }

    case "MENU_OPEN_REQUEST": {
      const request = createInitialRequest(state, {
        kind: "menu-open",
        type: "menu-open",
        source: event.source,
      });

      return {
        ...state,
        phase: "preparing",
        request,
        menuState: "opening",
        viewport: {
          mode: "fixed",
          scrollY: event.scrollY,
        },
        nextRequestId: state.nextRequestId + 1,
        log: pushLog(
          state.log,
          createLogEntry({
            id: request.id,
            event: event.type,
            phase: "preparing",
            message: "Preparing menu open transition",
          }),
        ),
      };
    }

    case "MENU_CLOSE_REQUEST": {
      const request = createInitialRequest(state, {
        kind: "menu-close",
        type: "menu-close",
        source: event.source,
      });

      return {
        ...state,
        phase: "preparing",
        request,
        menuState: "closing",
        viewport: {
          mode: "fixed",
          scrollY: event.scrollY,
        },
        nextRequestId: state.nextRequestId + 1,
        log: pushLog(
          state.log,
          createLogEntry({
            id: request.id,
            event: event.type,
            phase: "preparing",
            message: "Preparing menu close transition",
          }),
        ),
      };
    }

    case "LOADER_COMPLETE_REQUEST": {
      const request = createInitialRequest(state, {
        kind: "loader-complete",
        type: "loader-to-page",
        source: event.source,
      });

      return {
        ...state,
        phase: "preparing",
        request,
        nextRequestId: state.nextRequestId + 1,
        viewport: {
          mode: "fixed",
          scrollY: 0,
        },
        log: pushLog(
          state.log,
          createLogEntry({
            id: request.id,
            event: event.type,
            phase: "preparing",
            message: "Preparing loader completion transition",
          }),
        ),
      };
    }

    case "PHASE_CHANGED": {
      return {
        ...state,
        phase: event.phase,
        activePath:
          event.phase === "switching" && state.pendingPath
            ? state.pendingPath
            : state.activePath,
        log: pushLog(
          state.log,
          createLogEntry({
            id: state.request?.id ?? 0,
            event: event.type,
            phase: event.phase,
            message: event.message,
          }),
        ),
      };
    }

    case "SET_MENU_STATE": {
      return {
        ...state,
        menuState: event.menuState,
        log: pushLog(
          state.log,
          createLogEntry({
            id: state.request?.id ?? 0,
            event: event.type,
            phase: state.phase,
            message: event.message,
          }),
        ),
      };
    }

    case "TRANSITION_COMPLETE": {
      const queuedPath = state.queuedPath;
      const shouldRestartNavigation = Boolean(queuedPath);

      if (shouldRestartNavigation) {
        const request = createInitialRequest(state, {
          kind: "navigate",
          type: "page-default",
          source: "system",
          metadata: { to: queuedPath as string },
        });

        return {
          ...state,
          phase: "preparing",
          pendingPath: queuedPath,
          queuedPath: null,
          request,
          nextRequestId: state.nextRequestId + 1,
          viewport: {
            mode: "fixed",
            scrollY: state.viewport.scrollY,
          },
          log: pushLog(
            state.log,
            createLogEntry({
              id: request.id,
              event: event.type,
              phase: "preparing",
              message: `Auto-restarting queued navigation to ${queuedPath}`,
            }),
          ),
        };
      }

      const isLoaderRequest = state.request?.kind === "loader-complete";
      const isMenuOpenRequest = state.request?.kind === "menu-open";
      const isMenuCloseRequest = state.request?.kind === "menu-close";

      return {
        ...state,
        phase: "idle",
        request: null,
        pendingPath: null,
        viewport: {
          ...state.viewport,
          mode: "static",
        },
        isLoaderVisible: isLoaderRequest ? false : state.isLoaderVisible,
        menuState: isMenuOpenRequest
          ? "open"
          : isMenuCloseRequest
            ? "closed"
            : state.menuState,
        log: pushLog(
          state.log,
          createLogEntry({
            id: state.request?.id ?? 0,
            event: event.type,
            phase: "idle",
            message: event.message,
          }),
        ),
      };
    }

    case "TRANSITION_FAILED": {
      return {
        ...state,
        phase: "idle",
        request: null,
        pendingPath: null,
        viewport: {
          ...state.viewport,
          mode: "static",
        },
        lastError: event.error,
        log: pushLog(
          state.log,
          createLogEntry({
            id: state.request?.id ?? 0,
            event: event.type,
            phase: "failed",
            message: event.error,
          }),
        ),
      };
    }

    default:
      return state;
  }
};
