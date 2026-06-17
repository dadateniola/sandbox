# Page Transition Engine

This project uses a small, explicit transition engine to coordinate page changes, menu animations, and loader dismissal. The goal is to keep navigation visuals consistent without scattering animation logic across many UI components.

At a high level, the engine combines:

- A centralized state model (`TransitionState`) and event reducer.
- An orchestrator that runs animation recipes when state enters an animating phase.
- A transition registry that maps event types to executable recipes.
- A DOM adapter layer that resolves animation targets by semantic `data-transition-role` markers.
- Timeline primitives that define reusable animation building blocks.

The result is an architecture that behaves like a lightweight state machine plus command registry: components emit events, the reducer computes the next transition request, and the orchestrator executes the corresponding animation command.

## Architecture Overview

The transition system is mounted in the `(pages)` layout via `TransitionProvider`, and consumed by the app shell.

1. **State and events (engine layer)**
	- `TransitionState` tracks:
	  - lifecycle phase (`idle` or `animating`)
	  - route staging (`activePath`, `pendingPath`, `queuedPath`)
	  - menu status (`closed`, `opening`, `open`, `closing`)
	  - viewport lock mode and scroll position
	  - current request and cleanup payload
	  - loader and mobile flags
	- The reducer accepts transition events (`NAVIGATE`, `MENU_OPEN`, `MENU_CLOSE`, `HIDE_LOADER`, etc.) and computes the next state atomically.

2. **Orchestration (engine layer)**
	- `TransitionOrchestrator` listens for `phase === "animating"`.
	- It reads the current request type, resolves a recipe from the registry, runs it, then dispatches `CLEANUP` to finalize state.
	- A second effect drains queued navigation after the engine returns to `idle`.

3. **Recipes (registry layer)**
	- The registry maps each request type to a `TransitionRecipe` (`run(runtime) => Promise<void>`).
	- Recipes currently exist for:
	  - `NAVIGATE`
	  - `MENU_OPEN`
	  - `MENU_CLOSE`
	  - `HIDE_LOADER`
	- Recipes define animation intent, not state transitions.

4. **Adapters and primitives**
	- DOM adapters find animation targets (`active`, `entering`, `exiting` stages, menu panel, loader) through `data-transition-role` / `data-stage-state` selectors.
	- Timeline primitives build reusable GSAP motion patterns (`createBaseTimeline`, `applyExit`, `applyEnter`, clip-path states).
	- A GSAP adapter (`runTimeline`) provides a Promise boundary so recipes compose naturally with async orchestrator flow.

5. **Rendering and staging (UI integration)**
	- `PageHost` renders one or two page stages based on selector output:
	  - only active page while idle
	  - active + pending page during navigation
	- `PageState` applies consistent structural wrappers and emits targetable role/state attributes used by adapters.
	- `AppShell` is the main integration point that dispatches route and viewport-related events.

## Request Lifecycle Overview

### Navigation request (`NAVIGATE`) from start to finish

1. A route change updates `pathname` in `AppShell`.
2. `AppShell` dispatches `NAVIGATE` with target path and current scroll offset.
3. The reducer decides whether to process immediately or queue:
	- If already animating, it stores a single `queuedPath` (latest requested destination).
	- If idle, it enters `animating`, sets `pendingPath`, fixes viewport, and prepares a `cleanup` payload.
4. `PageHost` now renders both stages:
	- `activePath` becomes the exiting stage.
	- `pendingPath` becomes the entering stage.
5. Orchestrator sees `phase: animating`, resolves `NAVIGATE` recipe, and runs timeline.
6. On completion, orchestrator dispatches `CLEANUP`:
	- promoted `activePath = pendingPath`
	- `pendingPath = null`
	- menu normalized to closed
	- viewport released to static mode
7. Engine returns to `idle`.
8. If `queuedPath` exists, orchestrator immediately dispatches a fresh `NAVIGATE` to process the queued request.

### Menu and loader lifecycle

- `MENU_OPEN` and `MENU_CLOSE` follow the same pattern: reducer enters animating phase, recipe runs panel/page motion, cleanup commits final menu state.
- `HIDE_LOADER` is triggered by the intro loader once its own text animation and mobile detection conditions are satisfied; recipe animates loader out and reveals active stage.

## How Animations Are Triggered and Executed

Animations are not called directly from buttons or links. UI components only dispatch semantic events.

Execution path is always:

1. Event dispatched to reducer.
2. Reducer creates `request` and transition-phase state.
3. Orchestrator resolves recipe from registry by `request.type`.
4. Recipe gathers DOM targets through adapters.
5. Recipe composes GSAP timeline from primitives.
6. GSAP adapter runs timeline and resolves on completion.
7. Cleanup event finalizes state.

This separation keeps transition behavior deterministic and makes it easier to evolve motion language without changing event producers.

## Important Concepts for Maintainers

- **State machine-like phase gating**: only one transition executes at a time (`idle` vs `animating`).
- **Single-slot queueing**: while animating, navigation requests collapse into one queued destination (`queuedPath`), so follow-up navigation runs after cleanup.
- **Staged rendering**: active/pending pages co-exist temporarily to enable enter/exit choreography.
- **Role-based DOM targeting**: adapters depend on stable `data-transition-role` and `data-stage-state` attributes; these are part of the engine contract.
- **Recipe registry pattern**: orchestration is open for extension by adding new recipe registrations keyed by event type.

## Adding a New Transition

If you need a new transition type, follow this architecture path:

1. Add a new event type to engine events.
2. Extend reducer handling to set `phase`, `request`, and `cleanup` semantics.
3. Register a matching recipe in the transition registry.
4. Use adapters/primitives (or add new ones) to keep DOM querying and timeline building reusable.
5. Dispatch the new event from UI integration points, not direct animation calls.

Rule of thumb: keep state decisions in the reducer, animation composition in recipes, and DOM querying in adapters. That boundary is what keeps the engine understandable as it grows.
