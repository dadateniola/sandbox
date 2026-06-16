# Architecture Documentation

This document provides a comprehensive overview of the current codebase architecture (V3). It explains what exists today, why it exists, and how all systems interact—without proposing changes or optimizations.

---

## Project Overview

This is a portfolio website for Jacob Grønberg (photographer and visual artist) built with Next.js, React, and GSAP. The distinctive feature is not the content or styling, but the **transition-driven architecture**: navigation and menu interactions are orchestrated through a formal state machine and registry-based animation system, rather than relying on browser routing or typical component-based transitions.

**What it does:**
- Renders a set of static pages (/home, /projects, /exhibitions, /about, /contact) with animations
- Provides a full-screen menu panel with its own animation lifecycle
- Shows an intro loader on first load with staggered text animations
- Enforces a "no mobile" experience (returns a desktop-only message on viewports < 1024px wide)
- Manages viewport mode (fixed/static scroll position) during transitions to prevent jarring scroll restoration

**What problem it solves:**
The architecture decouples **navigation intent** (expressed as transition requests) from **page rendering** (expressed as component selection). This allows custom animation choreography during page transitions without relying on Next.js Link behavior or native browser routing to drive animation timelines. The transition engine can orchestrate multiple systems (page exit, page enter, menu animations, loader animations) as a single atomic operation.

**Why this architecture exists:**
V3 represents intentional architectural decisions made after exploring earlier iterations. The current design favors:
1. **Explicit state flow**: All navigation intent flows through a formal reducer with explicit phase transitions
2. **Animation primacy**: Transitions are first-class citizens, not side effects of routing
3. **Composable recipes**: Default animations are registered as pluggable "transition recipes" in a registry
4. **Clean separation of concerns**: DOM adaptation (querying, mutation) is isolated from business logic through adapters

---

## Architecture Philosophy

### V3 vs V1 vs V2

**V1** was a page transition experiment: animations were coupled directly to route changes.

**V2** explored a comprehensive architecture inspired by transition engines, reducers, state machines, registries, and adapters—likely over-engineered for the actual requirements.

**V3** is a pragmatic synthesis:
- **Kept from V1**: Direct coupling of animations to navigation (simplicity, predictability)
- **Adopted from V2**: Formal reducer + state machine for explicit event handling, and a registry system for animation recipes
- **Removed from V2**: Complex orchestration layers and abstract state machines that didn't add value
- **New in V3**: DOM adapters that translate animation recipes into actual GSAP timelines and DOM targets

### Architectural Goals

1. **Explicit event flow**: Every state change is the result of an explicit dispatch, not an implicit side effect
2. **Single source of truth**: Transition state lives in one reducer, consulted by all consumers
3. **Type safety**: Events, state, and recipes are all strictly typed
4. **Animation choreography**: Multiple UI elements can animate together as part of one logical transition
5. **No hidden magic**: GSAP timelines are built declaratively using primitives that can be read and understood without running the app

### Key Tradeoffs

- **Tradeoff: Flexibility vs Simplicity**  
  The system requires explicit state shapes for each interaction. Adding new transition types requires modifying the reducer, events, and recipes. This is intentional—the system favors predictability over ease of extension.

- **Tradeoff: Custom Routing vs Next.js Conventions**  
  Page selection is driven by transition state, not Next.js route matching. This means no dynamic route params, query strings, or standard route-based data loading. The catch-all route `[[...slug]]` is just a delivery mechanism; real routing is in the app state.

- **Tradeoff: Animation Latency vs Automatic Scroll Handling**  
  The system takes control of viewport scroll position during transitions to ensure smooth animations. This prevents janky scroll restoration and enables fixed-position overlays, but means scroll position is reset to 0 after each transition.

---

## High-Level Architecture

### Flow Diagram

```
User Action (Link Click or Menu Button)
    ↓
Next.js Router updates pathname / Dispatch explicit action
    ↓
TransitionReducer validates event & creates new state
    ↓
State includes: phase="animating", request={type, ...}, cleanup={...}
    ↓
TransitionOrchestrator observes phase="animating"
    ↓
getTransition(request.type) retrieves recipe from registry
    ↓
Recipe.run({ state, request, dispatch }) executes
    ↓
DOM Adapters query elements by data-transition-role attributes
    ↓
Timeline Primitives build GSAP timeline with custom easing
    ↓
GSAP Adapter runs timeline to completion
    ↓
Orchestrator dispatches CLEANUP event
    ↓
Reducer applies cleanup state, sets phase="idle"
    ↓
Queued navigation (if any) is triggered
    ↓
All consumers (PageHost, PageState, Navbar, etc.) re-render based on new state
```

### Component Rendering Model

Unlike traditional Next.js apps, page selection is **not** determined by the URL. Instead:

1. **URL Change** → Next.js router updates `pathname` → `AppShell` dispatches `NAVIGATE` event
2. **Reducer** → Sets `activePath` and `pendingPath` based on state phase
3. **Selectors** → `selectRenderedPaths(state)` returns `[activePath, pendingPath]` (filtered to remove nulls)
4. **PageHost** → Iterates over rendered paths, looks up component in `PAGE_DATA[path]`
5. **PageState** → Wraps each component, applies `data-stage-state` attribute ("active", "entering", "exiting", "inactive")
6. **Animations** → DOM adapters query by `data-transition-role` and `data-stage-state` to find targets

This means the DOM can contain multiple pages simultaneously at different animation phases.

---

## Folder Structure

### `app/`
**Root layout and route group for the application.**

- **`layout.tsx`**: Root layout. Sets metadata, imports global CSS, renders children.
- **`globals.css`**: Global Tailwind configuration, custom utilities, and theme variables.
- **`(pages)/`**: Route group. Wraps the catch-all with `TransitionProvider` and `AppShell`.
  - **`layout.tsx`**: Mounts the transition engine and main application shell.
  - **`[[...slug]]/page.tsx`**: Catch-all route. Intentionally empty; real page selection is in reducer state.

**Responsibility**: React tree setup, CSS, and route group nesting. The actual content rendering happens in components, not here.

---

### `components/`
**UI components organized by domain.**

#### `components/global/`
**Global page registry and shared UI components.**

- **`data.tsx`**: Exports `PAGES` (array of route strings) and `PAGE_DATA` (map of route → component).  
  This is the single source of truth for "what pages exist" and "what component renders at each route."
- **`components.tsx`**: Exports `CTA` component (circular call-to-action button used throughout the site).
- **`types.d.ts`**: Exports `Page` type (union of all valid page routes).

**Responsibility**: Define the application's page taxonomy and provide foundational shared components.

---

#### `components/shell/`
**Core application shell and initialization.**

- **`app-shell.tsx`**: Main application component. Coordinates:
  - Mounts `TransitionOrchestrator` (the effect that runs animations)
  - Renders `IntroLoader`, `Navbar`, `NavbarMenuPanel`, `PageHost`, and `MobileGate`
  - Handles pathname changes via Next.js `usePathname()`
  - Registers default transitions on mount
  - Dispatches `NAVIGATE` events to the reducer on pathname change
  - Dispatches `SET_MOBILE_VIEWPORT` based on media query hook
  - Synchronizes window scroll position with transition state
- **`intro-loader.tsx`**: Full-screen loader overlay shown on initial load.
  - Uses GSAP timeline to stagger-animate "Jacob" and "Grønberg" text
  - Dispatches `HIDE_LOADER` event to begin the show
- **`mobile-gate.tsx`**: Displays "desktop only" message if `isMobileViewport` is true. Otherwise renders children.
- **`types.d.ts`**: Exports `MobileGateProps` interface.

**Responsibility**: Orchestrate the application's startup, link Next.js routing to transition events, and gate mobile users.

---

#### `components/pages/`
**Page rendering and state management.**

- **`page-host.tsx`**: Renders all currently-relevant pages (usually 2: the active page and the incoming page).
  - Consumes `state.activePath` and `state.pendingPath` from transition engine
  - Uses `selectRenderedPaths()` to determine which pages to render
  - Looks up component in `PAGE_DATA` for each path
  - Falls back to `NotFound` if a path has no registered component
  - Wraps each page in `PageState` with the appropriate `stageState`
- **`page-state.tsx`**: Wrapper component that adds transition DOM attributes and viewport handling.
  - Applies `data-transition-role="page-stage"` and `data-stage-state="{active|entering|exiting|inactive}"`
  - Handles fixed/static viewport positioning based on `viewport.mode`
  - Applies scroll offset during transitions to prevent jank
  - Contains an invisible overlay element (used by GSAP animations to cover the active page during transitions)
- **`types.d.ts`**: Exports `PageStageState` ("active", "entering", "exiting", "inactive", "fixed") and `PageStateProps`.

**Responsibility**: Select pages based on transition state, render them with proper animation attributes, and manage viewport behavior.

---

#### `components/navbar/`
**Navigation bar and menu.**

- **`navbar.tsx`**: Fixed header with site name and menu toggle button.
  - Dispatches `MENU_OPEN`/`MENU_CLOSE` events
  - Reads `menuState` from transition engine to animate button state
  - Links to "/not-found" on desktop (since menu will be the primary nav) or static text on mobile
- **`navbar-menu-panel.tsx`**: Full-screen menu panel (conditionally rendered when not closed).
  - Wrapped in `PageState` with `stageState="fixed"`
  - Renders all pages from `PAGES` as navigation links
  - Highlights active route using `isActiveRoute()` utility
  - Shows footer text with designer/developer credits

**Responsibility**: Provide persistent site navigation and menu UI.

---

#### `components/home/`
**Home page and its sub-components.**

- **`home.tsx`**: Main page. Renders hero, services, latest projects, exhibitions, and contact sections.
  - Imports `HOME_PROJECTS_GRID` (subset of projects for homepage)
  - Imports `EXHIBITIONS` (first 3 only) from exhibitions module
  - Uses `CTA` component for calls-to-action
  - Uses `HomeSection` wrapper and various cards
- **`components.tsx`**: Exports `HomeSection` wrapper (rendered section with title, view-all link, and children).
- **`data.ts`**: Exports `SERVICES` array and `HOME_PROJECTS_GRID` layout (mixed array of project data and grid gaps).
- **`types.d.ts`**: Exports `HomeSectionProps` interface.

**Responsibility**: Render home page content and define homepage-specific layouts.

---

#### `components/projects/`
**Projects page and project cards.**

- **`projects.tsx`**: Main page. Renders hero section and `PROJECTS_GRID` layout.
- **`components.tsx`**: Exports `ProjectCard` (individual project card with title, image, and metadata).
- **`data.ts`**: Exports:
  - `PROJECTS` (const array of project slug strings)
  - `PROJECTS_DATA` (map of slug → `ProjectCardProps`)
  - `PROJECTS_GRID` (layout array for projects page, mixing cards and gaps)
- **`types.d.ts`**: Exports `Project` union type and `ProjectCardProps` interface.

**Responsibility**: Render projects page with masonry-style grid layout.

---

#### `components/exhibitions/`
**Exhibitions page and exhibition cards.**

- **`exhibitions.tsx`**: Main page. Renders hero and full `EXHIBITIONS` list.
- **`components.tsx`**: Exports `ExhibitionCard` (title, date, image, description, ticket link).
- **`data.ts`**: Exports `EXHIBITIONS` array of exhibition data.
- **`types.d.ts`**: Exports `ExhibitionCardProps` interface.

**Responsibility**: Render exhibitions page with event details.

---

#### `components/about/`, `components/contact/`, `components/not-found/`
**Standalone pages.**

- **`about.tsx`**: About page with hero image and bio text.
- **`contact.tsx`**: Contact page with hero, images, and WhatsApp CTA.
- **`not-found.tsx`**: 404 page. Renders when a requested path is not in `PAGE_DATA`.

**Responsibility**: Render their respective page content.

---

#### `components/svg/`
**SVG icon components.**

- **`svg.tsx`**: Exports arrow icons used throughout the site: `ArrowDown`, `ArrowDownLong`, `ArrowTopRight`, `ArrowRight`.
- **`types.d.ts`**: Exports `SVGProps` interface (size, color, className).

**Responsibility**: Centralize reusable SVG assets.

---

### `transition/`
**The transition engine and animation system.**

#### `transition/engine/`
**Core state machine and orchestration.**

- **`TransitionContext.tsx`**: React context that provides `useTransitionEngine()` hook.
  - Exports `TransitionContext` and the hook.
- **`TransitionProvider.tsx`**: Context provider component.
  - Initializes the reducer with `createInitialTransitionState(pathname)`
  - Provides `state` and `dispatch` to all children
- **`transition-reducer.ts`**: Implements the state machine:
  - `createInitialTransitionState(pathname)`: Returns initial state (phase="idle", activePath=pathname, etc.)
  - `transitionReducer(state, event)`: Returns new state based on event and machine rules
  - Handles events: `NAVIGATE`, `MENU_OPEN`, `MENU_CLOSE`, `HIDE_LOADER`, `SET_MOBILE_VIEWPORT`, `CLEANUP`
- **`transition-machine.ts`**: Implements `canProcessEvent(state, event)` guard function.
  - Determines if an event should be processed based on current state
  - E.g., `NAVIGATE` events are ignored if already transitioning (unless going to a different path—then queued)
- **`transition-orchestrator.tsx`**: Effect component that orchestrates animation execution.
  - Watches for `phase="animating"`
  - Fetches animation recipe from registry
  - Awaits recipe execution
  - Dispatches `CLEANUP` to apply post-animation state changes
  - Handles queued navigation when phase returns to "idle"
- **`transition-selectors.ts`**: Pure functions for deriving UI state from transition state.
  - `selectRenderedPaths(state)`: Returns pages currently being rendered
  - `selectStageState(state, path)`: Returns stage state for a given path ("active", "entering", "exiting", "inactive")
- **`types.d.ts`**: Exports core types:
  - `TransitionPhase` ("idle" | "animating")
  - `ViewportMode` ("static" | "fixed")
  - `MenuState` ("closed" | "opening" | "open" | "closing")
  - `TransitionState` (complete app state shape)
  - `TransitionContextType`
- **`events.d.ts`**: Exports `TransitionEvent` (discriminated union of all event types) and `TransitionEventType`.

**Responsibility**: Manage navigation state machine, provide context to all transition consumers, orchestrate animation execution.

---

#### `transition/registry/`
**Transition recipe registry and default animations.**

- **`transition-registry.ts`**: In-memory map of animation recipes.
  - `registerTransition(recipe)`: Adds a recipe to the map
  - `getTransition(key)`: Retrieves a recipe by key (or throws)
  - `hasTransition(key)`, `listTransitions()`: Query utilities
- **`register-default-transitions.ts`**: Implements default animations for all built-in transition types.
  - Called once on app shell mount
  - Registers recipes for: `NAVIGATE`, `MENU_OPEN`, `MENU_CLOSE`, `HIDE_LOADER`
  - Each recipe:
    - Queries DOM targets using adapters
    - Builds GSAP timeline using primitives
    - Runs timeline via GSAP adapter
- **`types.d.ts`**: Exports `TransitionRecipe` (key, description, run function) and `TransitionRuntime` (context passed to recipe.run).

**Responsibility**: Store animation recipes and register defaults.

---

#### `transition/adapters/`
**DOM querying and animation execution adapters.**

- **`dom-targets.ts`**: Queries the DOM for animation targets using semantic `data-transition-role` attributes.
  - `getStageTargets()`: Finds active/entering/exiting page stages
  - `getMenuPanelTarget()`: Finds the menu panel element
  - `getLoaderTarget()`: Finds the loader overlay
  - `getTargetParts(element)`: Finds content and overlay sub-elements within a stage
- **`gsap-adapter.ts`**: Simple wrapper around GSAP timeline execution.
  - `runTimeline(timeline)`: Returns a Promise that resolves when the timeline completes
- **`types.d.ts`**: Exports `StageTargets` interface.

**Responsibility**: Isolate DOM coupling and animation library coupling behind adapter interfaces.

---

#### `transition/primitives/`
**Reusable animation building blocks.**

- **`timeline-primitives.ts`**: GSAP timeline utilities.
  - `createBaseTimeline()`: Returns a paused timeline with default duration (1s) and custom easing
  - `applyExit(timeline, element)`: Adds exit animation (content down, overlay in, clip path close)
  - `applyEnter(timeline, element)`: Adds enter animation (content up from below, scale/rotate)
  - `CLIP_PATHS`: Polygon constants for SVG clip-path animation
  - `DEFAULT_EASE`: Custom easing curve optimized for page transitions

**Responsibility**: Provide reusable, declarative animation patterns.

---

### `hooks/`
**Custom React hooks.**

- **`useMediaQuery.tsx`**: Watches a CSS media query and returns boolean.
  - Returns `undefined` until first client-side evaluation
  - Used to detect mobile viewport and switch behavior

---

### `utils/`
**Utility functions.**

- **`cn.ts`**: Combines class names using `clsx` and `tailwind-merge`. Used throughout for conditional Tailwind styling.
- **`isActiveRoute.ts`**: Compares href to pathname to determine if a link is "active" (current page or parent of current page).

---

---

## Core Concepts

### Transition State

The entire application state is represented by `TransitionState`:

```typescript
type TransitionState = {
  phase: "idle" | "animating";
  activePath: string;
  pendingPath: string | null;
  queuedPath: string | null;
  menuState: "closed" | "opening" | "open" | "closing";
  viewport: { mode: "static" | "fixed"; scrollY: number };
  request: { type: TransitionEventType } | null;
  cleanup: Partial<TransitionState> | null;
  isLoaderVisible: boolean;
  isMobileViewport: boolean;
};
```

**Key properties:**
- `phase`: Whether the system is idle or running an animation
- `activePath`: The currently displayed page
- `pendingPath`: The page being animated to (null if not transitioning)
- `queuedPath`: A navigation request that arrived while animating (will be processed after cleanup)
- `menuState`: Whether the menu is closed, opening, open, or closing
- `viewport`: Scroll position is frozen during animations, restored afterward
- `request`: The current animation recipe key and any additional data
- `cleanup`: State changes to apply after the animation completes
- `isLoaderVisible`: Whether the intro loader overlay is shown
- `isMobileViewport`: Whether the viewport is < 1024px wide

### Transition Event

Events are the language of state changes. All events are type-safe:

```typescript
type TransitionEvent =
  | { type: "NAVIGATE"; to: string; scrollY: number }
  | { type: "MENU_OPEN"; scrollY: number }
  | { type: "MENU_CLOSE"; scrollY: number }
  | { type: "HIDE_LOADER" }
  | { type: "SET_MOBILE_VIEWPORT"; isMobile: boolean }
  | { type: "CLEANUP"; state: Partial<TransitionState> | null };
```

Every state change flows through the reducer and is produced by an explicit dispatch call.

### Transition Reducer

The reducer is the state machine that governs:
1. Which events are valid in which states (via `canProcessEvent`)
2. How each event transforms the state
3. What cleanup state should be applied post-animation

Example: During `NAVIGATE`:
- If phase is "idle", transition to "animating" and set activePath → pendingPath
- If phase is "animating", the event is queued (stored in queuedPath) for later
- After the animation completes, `CLEANUP` is dispatched to apply the queued path transitions

### Transition Recipe

A recipe is an async function that runs an animation sequence. The registry stores recipes keyed by event type:

```typescript
type TransitionRecipe = {
  key: "NAVIGATE" | "MENU_OPEN" | "MENU_CLOSE" | "HIDE_LOADER";
  description: string;
  run: (runtime: TransitionRuntime) => Promise<void>;
};
```

Recipes have access to:
- Current `state`
- The triggering `request`
- The `dispatch` function (though they typically don't dispatch—they run animations and let orchestrator cleanup)

### Transition Orchestrator

The orchestrator is an effect component that:
1. Watches `phase` transitions
2. When phase becomes "animating", fetches the recipe from the registry
3. Awaits the recipe's animation
4. Dispatches `CLEANUP` with the pre-computed cleanup state
5. Handles queued navigation when phase returns to "idle"

### Adapters

**DOM Adapters** (`dom-targets.ts`): Translate animation intent into DOM queries. The recipe says "animate the exiting page stage"; the adapter queries for `[data-transition-role="page-stage"][data-stage-state="exiting"]`.

**GSAP Adapter** (`gsap-adapter.ts`): Wraps GSAP timeline execution in a Promise.

This isolation allows recipes to be written declaratively without tight coupling to GSAP or specific DOM structures.

### Timeline Primitives

Reusable animation blocks like `applyExit()` and `applyEnter()` that build GSAP timelines. They handle:
- Querying sub-elements (content, overlay)
- Setting initial properties
- Animating content, overlay, and clip-path in sync
- Using a custom easing curve

---

## File-by-File Breakdown

### App Layer

| File | Purpose | Dependencies | Exports |
|------|---------|-------------|---------|
| `app/layout.tsx` | Root layout | next/font | HTML tree, metadata |
| `app/globals.css` | Global CSS + Tailwind | @tailwindcss/postcss | CSS custom properties |
| `app/(pages)/layout.tsx` | Route group layout | TransitionProvider, AppShell | TransitionProvider tree |
| `app/(pages)/[[...slug]]/page.tsx` | Catch-all route | (nothing) | Empty page |

### Shell & Navigation

| File | Purpose | Dependencies | Key Exports |
|------|---------|-------------|-------------|
| `components/shell/app-shell.tsx` | Main app orchestrator | TransitionProvider, all shell components, useTransitionEngine, registerDefaultTransitions | Renders full app |
| `components/shell/intro-loader.tsx` | Loader overlay | useTransitionEngine, GSAP, PageState | Staggered text animation |
| `components/shell/mobile-gate.tsx` | Desktop-only gate | useTransitionEngine, PageState | Conditional render |
| `components/navbar/navbar.tsx` | Header + menu button | useTransitionEngine, cn | Fixed navbar |
| `components/navbar/navbar-menu-panel.tsx` | Full-screen menu | useTransitionEngine, PAGE_DATA, PAGES, isActiveRoute, PageState | Menu overlay |

### Page Selection & Rendering

| File | Purpose | Dependencies | Key Exports |
|------|---------|-------------|-------------|
| `components/global/data.tsx` | Page registry | All page components | PAGE_DATA, PAGES |
| `components/global/components.tsx` | Shared UI | cn | CTA button |
| `components/pages/page-host.tsx` | Page selection & rendering | useTransitionEngine, PAGE_DATA, selectRenderedPaths, selectStageState | Renders pages |
| `components/pages/page-state.tsx` | Page stage wrapper | useTransitionEngine, cn | Transition attributes & styling |

### Content Pages

| File | Purpose | Dependencies | Exports |
|------|---------|-------------|---------|
| `components/home/home.tsx` | Home page | HOME_PROJECTS_GRID, EXHIBITIONS, ProjectCard, ExhibitionCard, CTA | Page content |
| `components/projects/projects.tsx` | Projects page | PROJECTS_GRID, ProjectCard, CTA | Page content |
| `components/exhibitions/exhibitions.tsx` | Exhibitions page | EXHIBITIONS, ExhibitionCard | Page content |
| `components/about/about.tsx` | About page | (images) | Page content |
| `components/contact/contact.tsx` | Contact page | (images), CTA | Page content |
| `components/not-found/not-found.tsx` | 404 page | (images), CTA | Page content |

### Transition Engine

| File | Purpose | Dependencies | Key Exports |
|------|---------|-------------|-------------|
| `transition/engine/TransitionContext.tsx` | Context definition | React | useTransitionEngine hook |
| `transition/engine/TransitionProvider.tsx` | Context provider | useReducer, transitionReducer | Provider component |
| `transition/engine/transition-reducer.ts` | State machine | canProcessEvent, types | transitionReducer, createInitialTransitionState |
| `transition/engine/transition-machine.ts` | Event guards | types | canProcessEvent |
| `transition/engine/transition-orchestrator.tsx` | Animation orchestrator | useTransitionEngine, getTransition | Effect component |
| `transition/engine/transition-selectors.ts` | State selectors | types | selectRenderedPaths, selectStageState |
| `transition/engine/types.d.ts` | Type definitions | (types) | TransitionState, TransitionContextType, etc. |
| `transition/engine/events.d.ts` | Event types | types | TransitionEvent, TransitionEventType |

### Registry & Animation

| File | Purpose | Dependencies | Key Exports |
|------|---------|-------------|-------------|
| `transition/registry/transition-registry.ts` | Recipe storage | types | registerTransition, getTransition, hasTransition |
| `transition/registry/register-default-transitions.ts` | Default animations | registerTransition, DOM adapters, timeline primitives, GSAP adapter | registerDefaultTransitions() |
| `transition/registry/types.d.ts` | Recipe types | types | TransitionRecipe, TransitionRuntime |
| `transition/adapters/dom-targets.ts` | DOM querying | types | getStageTargets, getMenuPanelTarget, getLoaderTarget, getTargetParts |
| `transition/adapters/gsap-adapter.ts` | GSAP execution | gsap | runTimeline |
| `transition/adapters/types.d.ts` | Adapter types | (types) | StageTargets |
| `transition/primitives/timeline-primitives.ts` | Animation blocks | gsap, DOM adapters | createBaseTimeline, applyExit, applyEnter, CLIP_PATHS |

### Utilities

| File | Purpose | Exports |
|------|---------|---------|
| `utils/cn.ts` | Class merge utility | cn function |
| `utils/isActiveRoute.ts` | Route matching | isActiveRoute function |
| `hooks/useMediaQuery.tsx` | Media query hook | useMediaQuery hook |

---

## Lifecycle Walkthroughs

### Initial Application Load

1. **Browser loads `/`** (or any valid route)
2. **Next.js renders root layout** (`app/layout.tsx`)
3. **Route group layout** (`app/(pages)/layout.tsx`) mounts:
   - `TransitionProvider` (initializes reducer with pathname = "/")
   - `AppShell` (main app)
4. **AppShell mounts**:
   - Calls `registerDefaultTransitions()` to populate the transition registry
   - Sets up media query listener and dispatches `SET_MOBILE_VIEWPORT`
   - Dispatches initial `NAVIGATE` event (pathname is already "/", so this is a no-op unless page changed)
5. **AppShell renders**:
   - `TransitionOrchestrator` (watches for animations)
   - `IntroLoader` (shows staggered text, dispatches `HIDE_LOADER` after animation)
   - `Navbar` + `NavbarMenuPanel`
   - `MobileGate` (shows message if mobile, or:)
   - `PageHost` (renders pages)
6. **Initial state**:
   - `phase: "idle"`
   - `activePath: "/"`
   - `isLoaderVisible: true`
7. **IntroLoader animation runs**:
   - GSAP timeline stagger-animates text in
   - On complete, dispatches `HIDE_LOADER`
8. **Reducer processes `HIDE_LOADER`**:
   - Sets `phase: "animating"`, `request: {type: "HIDE_LOADER"}`, and cleanup state
9. **Orchestrator runs `HIDE_LOADER` recipe**:
   - Queries loader element, active page stage
   - Animates loader exit, page enter
   - Awaits timeline completion
10. **Orchestrator dispatches `CLEANUP`**:
    - Sets `isLoaderVisible: false`, `phase: "idle"`
11. **App settles**: Loader is gone, home page is visible and interactive

### Standard Navigation (Link Click)

1. **User clicks a link** (e.g., `/projects`)
2. **Next.js Link behavior** updates pathname
3. **AppShell watches pathname change** via `usePathname()`
4. **AppShell dispatches `NAVIGATE` event**:
   ```javascript
   dispatch({
     type: "NAVIGATE",
     to: "/projects",
     scrollY: window.scrollY,
   });
   ```
5. **Reducer processes `NAVIGATE`**:
   - Validates the event (checks `canProcessEvent`)
   - Sets `phase: "animating"`, `pendingPath: "/projects"`, `request: {type: "NAVIGATE"}`
   - Pre-computes cleanup state:
     ```javascript
     cleanup: {
       activePath: "/projects",
       pendingPath: null,
       menuState: "closed",
       viewport: { mode: "static", scrollY: 0 },
     }
     ```
   - Fixes viewport: `viewport: { mode: "fixed", scrollY: currentScrollY }`
6. **PageHost re-renders**:
   - `selectRenderedPaths(state)` returns `["/", "/projects"]`
   - Renders both pages wrapped in `PageState`
   - "/" has `stageState="exiting"`, "/projects" has `stageState="entering"`
7. **DOM adapters query targets**:
   - `getStageTargets()` finds exiting and entering page stages
8. **Orchestrator runs `NAVIGATE` recipe**:
   - Builds timeline with `applyExit(exiting)` + `applyEnter(entering)`
   - Runs timeline
9. **Orchestrator dispatches `CLEANUP`**:
   - Sets `activePath: "/projects"`, `pendingPath: null`, `phase: "idle"`
   - Resets scroll: `viewport: { mode: "static", scrollY: 0 }`
10. **PageHost re-renders**:
    - `selectRenderedPaths()` returns `["/projects"]` (previous page removed)
    - Only "/projects" is rendered, with `stageState="active"`
11. **App settles**: Projects page is visible and interactive

### Menu Open/Close

1. **User clicks menu button** in navbar
2. **Navbar dispatches `MENU_OPEN`**:
   ```javascript
   dispatch({
     type: "MENU_OPEN",
     scrollY: window.scrollY,
   });
   ```
3. **Reducer processes `MENU_OPEN`**:
   - Sets `phase: "animating"`, `menuState: "opening"`
   - Fixes viewport
   - Pre-computes cleanup: `menuState: "open"`
4. **NavbarMenuPanel re-renders**:
   - Becomes visible (was `display: none` when menuState === "closed")
   - Gets `data-menu-state="opening"`
5. **Orchestrator runs `MENU_OPEN` recipe**:
   - Queries menu panel, active page stage
   - Builds timeline:
     - Menu content transforms from up/rotate/scale to normal position
     - Menu overlay fades in
     - Menu clip-path opens
     - Active page stage moves down and scales up (parallax)
6. **Orchestrator dispatches `CLEANUP`**:
   - Sets `menuState: "open"`, `phase: "idle"`
7. **App settles**: Menu is open, user can click links

8. **User clicks `MENU_CLOSE`** (either by clicking a link or the menu button again)
9. **Navbar dispatches `MENU_CLOSE`**:
   ```javascript
   dispatch({
     type: "MENU_CLOSE",
     scrollY: window.scrollY,
   });
   ```
10. **Similar flow**: Reverses animation, ends with `menuState: "closed"` and `NavbarMenuPanel` not rendered

### Queued Navigation

If user clicks a link **while an animation is running**:

1. **Reducer receives `NAVIGATE` event during `phase: "animating"`**
2. **`canProcessEvent` returns false** if same path, but **true if different path**
3. **Reducer queues the path**: `queuedPath: "/new-route"`
4. **Animation completes**, `CLEANUP` is dispatched, `phase` returns to "idle"
5. **Orchestrator effect re-runs** (phase changed to idle, queuedPath is not null)
6. **Orchestrator dispatches the queued navigation**:
   ```javascript
   dispatch({
     type: "NAVIGATE",
     to: state.queuedPath,
     scrollY: window.scrollY,
   });
   ```
7. **New animation begins**

---

## State Flow

### State Object Shape

```typescript
{
  // Phase machine
  phase: "idle" | "animating",
  
  // Page routing
  activePath: string,                    // Currently displayed page
  pendingPath: string | null,            // Page being animated to
  queuedPath: string | null,             // Next navigation if one arrived mid-animation
  
  // Menu state machine
  menuState: "closed" | "opening" | "open" | "closing",
  
  // Viewport control
  viewport: {
    mode: "static" | "fixed",            // fixed prevents scroll during animations
    scrollY: number,                      // Captured at transition start
  },
  
  // Animation metadata
  request: { type: TransitionEventType } | null,  // Current animation recipe key
  cleanup: Partial<TransitionState> | null,       // State to apply after animation
  
  // UI flags
  isLoaderVisible: boolean,
  isMobileViewport: boolean,
}
```

### Ownership

- **Reducer** owns the authoritative state; no other file modifies it directly
- **All components read** via `useTransitionEngine()` hook
- **All components dispatch** via the hook's dispatch function
- **Selectors** (`selectRenderedPaths`, `selectStageState`) derive UI state from the base state

### Key Invariants

1. **Only one animation runs at a time**: `phase` is always "idle" or "animating", never both
2. **Viewport is locked during animations**: `viewport.mode` is "fixed" during animation, "static" after
3. **Pages are atomic**: A page is never "half-way" between active and exiting; its state is one of {"active", "entering", "exiting", "inactive"}
4. **Cleanup is pre-computed**: When an animation is requested, cleanup state is calculated immediately and applied after animation completes, not during

---

## Event Flow

### Event Types & Handlers

| Event | Triggered By | State Changes | Recipe Executed |
|-------|-------------|---------------|-----------------|
| `NAVIGATE` | AppShell watching pathname | phase→"animating", pendingPath set, cleanup pre-computed | "NAVIGATE" recipe |
| `MENU_OPEN` | Navbar button click | phase→"animating", menuState→"opening" | "MENU_OPEN" recipe |
| `MENU_CLOSE` | Navbar button or menu link | phase→"animating", menuState→"closing" | "MENU_CLOSE" recipe |
| `HIDE_LOADER` | IntroLoader GSAP timeline | phase→"animating", cleanup: isLoaderVisible=false | "HIDE_LOADER" recipe |
| `SET_MOBILE_VIEWPORT` | useMediaQuery hook | isMobileViewport set (no animation) | (none) |
| `CLEANUP` | TransitionOrchestrator | Applies cleanup state, phase→"idle" | (none) |

### Event Validation

The `canProcessEvent()` function gates events:

- **NAVIGATE**: Ignored if same as current/pending path. Queued if animating and different path.
- **MENU_OPEN**: Ignored if menu already opening/open or phase is animating.
- **MENU_CLOSE**: Ignored if menu already closing/closed or phase is animating.
- **Others**: Generally allowed.

---

## Animation Architecture

### How Animations Are Defined

Animations are **declaratively registered as recipes** at runtime:

```typescript
registerTransition({
  key: "NAVIGATE",
  description: "Default page-to-page transition",
  run: async ({ state: { menuState } }) => {
    // Query targets
    const { exiting, entering } = getStageTargets();
    
    // Build timeline
    const tl = createBaseTimeline();
    applyExit(tl, exiting);
    applyEnter(tl, entering);
    
    // Run
    await runTimeline(tl);
  },
});
```

### How Animations Are Triggered

1. **State change** → `phase: "animating"` + `request: {type: "NAVIGATE"}`
2. **Orchestrator observes** phase change
3. **Orchestrator fetches recipe** from registry: `getTransition("NAVIGATE")`
4. **Orchestrator runs recipe** async
5. **On completion**, orchestrator dispatches `CLEANUP`

### How Animations Are Composed

Recipes use **timeline primitives** that build GSAP timelines declaratively:

```typescript
const tl = createBaseTimeline();  // Paused, 1s duration, custom easing
applyExit(tl, exiting);          // Adds 3 tweens: content down, overlay in, clip-path close
applyEnter(tl, entering);        // Adds 1 tween: content from bottom
```

This keeps recipes readable without getting into GSAP internals.

### How Animations Interact with Navigation

- **Before animation**: Both old and new pages are in the DOM (created by `selectRenderedPaths`)
- **During animation**: GSAP tweens animate their properties
- **After animation**: Old page is removed from the DOM (redux cleanup), only new page remains

The viewport is locked (`mode: "fixed"`) so scroll doesn't jump during animation.

### Custom Easing

All animations use a custom `CustomEase` curve defined in `timeline-primitives.ts`:

```
M0,0 C0.173,0 0.242,0.036 0.322,0.13 0.401,0.223 0.412,0.373 0.465,0.512 
0.508,0.628 0.515,0.833 0.621,0.925 0.694,0.989 0.869,1 1,1
```

This creates a snappy, slightly overshoot-y ease optimized for page transitions.

---

## Dependency Map

### Critical Files (Core Architecture)

These files form the backbone; changing them affects everything:

1. **`transition/engine/types.d.ts`** — Defines TransitionState shape
2. **`transition/engine/transition-reducer.ts`** — State machine logic
3. **`transition/engine/transition-orchestrator.tsx`** — Animation orchestration
4. **`transition/registry/transition-registry.ts`** — Recipe registry
5. **`transition/registry/register-default-transitions.ts`** — Built-in animations
6. **`components/pages/page-host.tsx`** — Page selection and rendering
7. **`components/global/data.tsx`** — Page registry (what pages exist)

### High Coupling Areas

**Navigation + Menu State:**
- `AppShell` → triggers NAVIGATE events
- `Navbar` → triggers MENU_OPEN/MENU_CLOSE events
- `NavbarMenuPanel` → observes menuState, closes on link click
- Recipe implementations → must know how to animate both pages and menu simultaneously

**Page Rendering:**
- `PageHost` → depends on PAGE_DATA and selectors
- Multiple features components — depend on being registered in PAGE_DATA
- Any addition of a new page requires entry in `PAGE_DATA` and a PAGES route

**Transition Context:**
- 8 files directly import `useTransitionEngine`:
  - `AppShell`, `IntroLoader`, `MobileGate`, `Navbar`, `NavbarMenuPanel`, `PageHost`, `PageState`, `TransitionOrchestrator`

### Architectural Boundaries

| Boundary | Consumer Side | Provider Side | How It Works |
|----------|---|---|---|
| **Context** | All UI components | TransitionProvider | React context hook |
| **Registry** | Orchestrator | Register-default-transitions | In-memory map, looked up by key |
| **DOM Adapters** | Recipes | dom-targets.ts | Query by `data-transition-role` attributes |
| **Timeline Primitives** | Recipes | timeline-primitives.ts | Build GSAP timelines declaratively |
| **Page Registry** | PageHost, NavbarMenuPanel | global/data.tsx | Map of path → component |
| **Selectors** | PageHost, PageState | transition-selectors.ts | Pure functions from state to UI props |

### Low-Coupling Patterns

- **Recipes don't import UI components**: They work with DOM queries, not React components
- **Recipes don't dispatch events**: They run sequentially, then orchestrator handles cleanup
- **Features are isolated**: Projects page doesn't know about exhibitions; both are just registered components
- **Utilities are generic**: `cn()` and `isActiveRoute()` are framework-agnostic

---

## V3 Architecture Summary

### Pattern Classification

**This architecture most closely resembles a hybrid of:**

1. **State Machine Pattern** (reducer + explicit phases)
2. **Registry Pattern** (animation recipes registered and looked up by key)
3. **Adapter Pattern** (DOM and GSAP adapters isolate third-party concerns)
4. **Observer Pattern** (Orchestrator watches phase, triggers effects)

**Not a traditional MVC/MVVM**: Page routing is state-driven, not route-driven.

**Not Redux-like**: Single reducer, no middleware, no time-travel debugging (though the structure supports it).

### Architectural Strengths

1. **Type Safety**: All state transitions and events are strictly typed, preventing invalid states at compile time
2. **Explicitness**: Every state change is visible in the reducer; no hidden side effects
3. **Animation Composability**: Recipes can be written, tested, and modified independently
4. **Single Source of Truth**: All navigation state lives in one reducer
5. **Predictability**: Given a state and event, the outcome is deterministic
6. **Extensibility**: New animations can be added by registering recipes without modifying the engine
7. **Testability**: Reducer logic, selectors, and recipes can be tested in isolation

### Architectural Compromises

1. **No Dynamic Routes**: All pages are static. No route params, query strings, or route-based data loading
2. **No Lazy Loading**: All page components are imported upfront in global/data.tsx
3. **Limited Browser History**: Back/forward buttons work (Next.js routing), but browser history doesn't control animations—only the reducer does
4. **Animation Blocking**: While animating, most interactions are gated (can't open menu, can't navigate to same path, etc.)
5. **Fixed Pattern**: All pages animate in the same way (clip-path + transform). Customizing per-page animations would require conditional logic in recipes
6. **Viewport Lock**: Scroll position is reset to 0 after transitions, preventing returning users from seeing where they left off

### What Makes V3 Different

**vs V1 (Simple Direct Animation):**
- V3 adds formal state machine and event validation
- V3 separates animation recipes from trigger logic
- V3 prevents invalid state transitions that V1 might have allowed

**vs V2 (Over-engineered):**
- V3 removes abstract orchestration layers
- V3 simplifies reducer to handle only events that actually occur
- V3 uses simple in-memory registry instead of complex dependency graphs
- V3 is more pragmatic: only as much structure as the feature set requires

**Key Design Decision:**
V3 chose **animation-centric state management** over **routing-centric state management**. This means:
- Navigation is an animation request, not a route change
- State shape is optimized for animation phases, not URL structure
- The reducer's job is to orchestrate animations, not to manage data dependencies

---

## Getting Started for New Developers

### Mental Model

1. **The app is not route-driven**; it's state-driven
2. **State lives in one reducer**; read it with `useTransitionEngine()`
3. **Every change is an event**; dispatch them explicitly
4. **Animations are recipes**; add new ones by calling `registerTransition()`
5. **Pages are just components**; add new ones by editing `PAGE_DATA`

### Adding a New Page

1. Create a component in `components/my-feature/my-feature.tsx`
2. Add it to `PAGE_DATA` in `components/global/data.tsx`:
   ```typescript
   import MyFeature from "../my-feature/my-feature";
   
   export const PAGE_DATA: Record<Page, { label: string; content: () => JSX.Element }> = {
     // ...
     "/my-feature": { label: "My Feature", content: MyFeature },
   };
   ```
3. Add the route to `PAGES`:
   ```typescript
   export const PAGES = ["/", "/projects", "/my-feature", /* ... */];
   ```
4. Link to it with `<Link href="/my-feature">Go to My Feature</Link>`

The transition animation will automatically include your page.

### Adding a Custom Animation

1. Write a recipe function:
   ```typescript
   registerTransition({
     key: "MY_CUSTOM_EVENT",
     description: "My custom animation",
     run: async ({ state, request, dispatch }) => {
       const tl = createBaseTimeline();
       // ... build timeline
       await runTimeline(tl);
     },
   });
   ```
2. Dispatch it from a component:
   ```typescript
   dispatch({
     type: "MY_CUSTOM_EVENT",
     scrollY: window.scrollY,
   });
   ```
3. Add the event type to `TransitionEvent` union in `transition/engine/events.d.ts`
4. Handle it in the reducer (add a case in `transitionReducer`)

### Debugging

- **State inspection**: Add `console.log(state)` in components to see current state
- **Event logging**: Add `console.log(event)` in the reducer before state updates
- **Animation inspection**: Check DOM `data-transition-role` and `data-stage-state` attributes during animations in DevTools
- **Timeline inspection**: GSAP timelines can be inspected in the browser console; try `window.gsap`

---

## Build & Deployment

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Lint code
```

The app builds to a static site; all pages are pre-rendered at build time. No server-side logic is needed.

---

## Conclusion

V3 is an **intentional, pragmatic architecture** that uses formal state management, animation recipes, and DOM adapters to create a predictable, extensible page transition system. It trades some flexibility (dynamic routes, lazy loading) for clarity, type safety, and animation control.

The system works because:
1. Pages are finite and known upfront
2. Animations follow a consistent pattern
3. State is centralized and deterministic
4. All interactions flow through explicit events

Six months from now, return to this README and the architecture should still be clear.
