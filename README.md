# Overview
This project is a desktop-first portfolio site built with Next.js, React, and GSAP. It renders a small set of content pages such as Home, Projects, Exhibitions, About, and Contact, and uses a custom transition engine to control page changes, the full-screen menu, and the intro loader.

The engine sits between routing and rendering. Instead of letting the route file decide the visible page directly, the app stores transition state in a reducer, renders pages from that state, and runs registered GSAP recipes before cleanup commits the next screen.

# Core Concepts
## Transition state
One reducer holds the global transition state. It tracks:
- `phase`: `idle` or `animating`
- `activePath`, `pendingPath`, and `queuedPath`
- `menuState`: `closed`, `opening`, `open`, or `closing`
- `viewport.mode` and `viewport.scrollY`
- `request` and `cleanup`
- `isLoaderVisible`
- `isMobileViewport`

## Events
The engine responds to a small set of events:
- `NAVIGATE`
- `MENU_OPEN`
- `MENU_CLOSE`
- `HIDE_LOADER`
- `SET_MOBILE_VIEWPORT`
- `CLEANUP`

The reducer turns each event into state changes plus a transition request. The orchestrator turns that request into animation work.

## State-driven rendering
The catch-all route exists so Next.js can mount the app, but it does not decide which content page is shown. `PageHost` reads reducer state, decides which paths should be mounted, and can render both the outgoing page and incoming page at the same time.

Each mounted surface receives a stage state such as `active`, `entering`, `exiting`, or `fixed`. Those stage states are the contract the animation layer uses to find the right DOM nodes.

## Transition recipes
Animations live in a registry. Each recipe is keyed by an event type and exposes `run()`. When the engine enters `animating`, the orchestrator looks up the matching recipe, runs it, waits for the GSAP timeline to finish, then dispatches cleanup.

## DOM roles
The animation layer finds elements through `data-transition-role` attributes rather than through direct component references. The main roles are:
- `page-stage`
- `menu-panel`
- `loader`
- `content`
- `overlay`

## Fixed viewport mode
During transitions, the reducer switches the viewport into `fixed` mode and stores the current scroll position. `PageState` uses that value to offset content so the screen stays visually stable while animated layers move.

# Architecture Overview
The app has three main layers:
1. Next.js mounting and shell composition
2. Transition state and orchestration
3. Content pages and animation-ready wrappers

`app/(pages)/layout.tsx` mounts `TransitionProvider` and `AppShell`. `TransitionProvider` owns the reducer and exposes `state` and `dispatch` through context.

`AppShell` is the runtime bridge between external inputs and the engine. It:
- reads the current pathname with `usePathname()`
- watches desktop vs mobile with `useMediaQuery()`
- registers the default transition recipes
- dispatches `NAVIGATE` and `SET_MOBILE_VIEWPORT`
- restores scroll when the viewport returns to static mode

The shell then renders the shared runtime pieces:
- `TransitionOrchestrator`
- `IntroLoader`
- `Navbar`
- `NavbarMenuPanel`
- `MobileGate`
- `PageHost`

`PageHost` renders pages from reducer state, not from the catch-all route component. It uses selectors to mount the active page and, during transitions, the pending page as well. Each mounted page is wrapped in `PageState`, which provides the shared DOM structure used by the animation layer.

The transition layer is intentionally split into reducer, orchestrator, registry, adapters, and primitives. The reducer decides what should happen. The orchestrator decides when to run it. The registry chooses the recipe. The adapters find DOM surfaces and run timelines. The primitives define the shared motion patterns.

# Folder Structure
Only the main architectural files are listed here.

```text
app/
  (pages)/
    layout.tsx
    [[...slug]]/page.tsx
  layout.tsx
  globals.css

components/
  global/
    data.tsx
    types.d.ts
  shell/
    app-shell.tsx
    intro-loader.tsx
    mobile-gate.tsx
  pages/
    page-host.tsx
    page-state.tsx
    types.d.ts
  navbar/
    navbar.tsx
    navbar-menu-panel.tsx
  home/home.tsx
  projects/projects.tsx
  exhibitions/exhibitions.tsx
  about/about.tsx
  contact/contact.tsx
  not-found/not-found.tsx

transition/
  engine/
    TransitionProvider.tsx
    TransitionContext.tsx
    transition-reducer.ts
    transition-machine.ts
    transition-orchestrator.tsx
    transition-selectors.ts
    events.d.ts
    types.d.ts
  registry/
    register-default-transitions.ts
    transition-registry.ts
    types.d.ts
  adapters/
    dom-targets.ts
    gsap-adapter.ts
  primitives/
    timeline-primitives.ts

hooks/
  useMediaQuery.tsx

utils/
  isActiveRoute.ts
  cn.ts
```

## Important files
### `app/(pages)/layout.tsx`
Purpose: Mount the transition system for the page route group.
Responsibility: Wrap the app in `TransitionProvider` and render `AppShell`.

### `app/(pages)/[[...slug]]/page.tsx`
Purpose: Provide the catch-all route file.
Responsibility: Let the route group resolve while actual page rendering happens in the shell.

### `components/shell/app-shell.tsx`
Purpose: Compose the runtime shell.
Responsibility: Register transitions, dispatch pathname and viewport events, restore scroll, and mount the orchestrator, loader, menu, gate, and page host.

### `components/global/data.tsx`
Purpose: Define which pages exist.
Responsibility: Export the page path list and the map from path to label and page component.

### `components/pages/page-host.tsx`
Purpose: Render the pages implied by transition state.
Responsibility: Choose active and pending paths, derive stage state, and wrap each mounted page in `PageState`.

### `components/pages/page-state.tsx`
Purpose: Provide the shared animation wrapper.
Responsibility: Apply transition roles, viewport positioning, overlay markup, z-index layering, and scroll offset behavior.

### `components/navbar/navbar.tsx`
Purpose: Render the fixed header.
Responsibility: Show the site title, reflect menu state, and dispatch `MENU_OPEN` or `MENU_CLOSE`.

### `components/navbar/navbar-menu-panel.tsx`
Purpose: Render the full-screen navigation panel.
Responsibility: Show page links from the page registry inside a `PageState` wrapper so the menu uses the same transition system.

### `components/shell/intro-loader.tsx`
Purpose: Render the startup overlay.
Responsibility: Run the local text reveal and dispatch `HIDE_LOADER` when it finishes.

### `components/shell/mobile-gate.tsx`
Purpose: Enforce the desktop-only experience.
Responsibility: Replace page content with a full-screen message on narrow viewports.

### `transition/engine/transition-reducer.ts`
Purpose: Define the transition state machine.
Responsibility: Turn events into new state, transition requests, queued navigation, viewport locking, and cleanup payloads.

### `transition/engine/transition-machine.ts`
Purpose: Guard event processing.
Responsibility: Reject redundant or invalid events based on the current phase and menu state.

### `transition/engine/transition-orchestrator.tsx`
Purpose: Execute transition requests.
Responsibility: Run the matching recipe, dispatch cleanup, and replay queued navigation after the system returns to idle.

### `transition/engine/transition-selectors.ts`
Purpose: Derive render-time state.
Responsibility: Decide which paths should be mounted and which stage state each path should receive.

### `transition/registry/register-default-transitions.ts`
Purpose: Define the built-in recipes.
Responsibility: Register the `NAVIGATE`, `MENU_OPEN`, `MENU_CLOSE`, and `HIDE_LOADER` animations.

### `transition/registry/transition-registry.ts`
Purpose: Store transition recipes.
Responsibility: Register, fetch, and list recipes by request key.

### `transition/adapters/dom-targets.ts`
Purpose: Bridge animation code to the rendered DOM.
Responsibility: Query the active, entering, exiting, menu, loader, content, and overlay elements using shared data attributes.

### `transition/adapters/gsap-adapter.ts`
Purpose: Normalize timeline playback.
Responsibility: Play a GSAP timeline and resolve a promise when it completes.

### `transition/primitives/timeline-primitives.ts`
Purpose: Provide reusable motion building blocks.
Responsibility: Create base timelines, define shared easing and clip paths, and apply the standard enter and exit motions.

# Transition Lifecycle
This is the usual page-to-page flow after the app has mounted.

1. A user activates a `Link`, usually from the menu panel.
2. Next.js updates the pathname.
3. `AppShell` sees the new pathname and dispatches `NAVIGATE` with the destination path and current `window.scrollY`.
4. `transition-machine.ts` decides whether the event can be processed immediately. If another transition is running, the destination may be stored as `queuedPath`.
5. `transition-reducer.ts` switches the engine to `animating`, stores the destination as `pendingPath`, locks the viewport, creates a `request`, and prepares the `cleanup` state that should be applied later.
6. `PageHost` now mounts both the old page and the incoming page.
7. `transition-selectors.ts` marks the old page as `exiting` and the new page as `entering`.
8. `TransitionOrchestrator` notices `phase === "animating"`, looks up the `NAVIGATE` recipe, and runs it.
9. The recipe queries the DOM targets, builds a GSAP timeline from shared primitives, and passes it to `runTimeline()`.
10. When the timeline finishes, the orchestrator dispatches `CLEANUP`.
11. The reducer applies cleanup, promotes `pendingPath` to `activePath`, clears temporary transition data, restores static viewport mode, and returns to `idle`.
12. If `queuedPath` exists, the orchestrator immediately dispatches another `NAVIGATE` event and repeats the cycle.

The same shape is used for menu open, menu close, and loader hide. The request type changes, but the path through reducer, orchestrator, recipe, timeline, and cleanup stays the same.

# State Flow
State lives in one place: the reducer created by `TransitionProvider`.

## Where state starts
`createInitialTransitionState(pathname)` seeds the reducer with the current path, a closed menu, a visible loader, a fixed viewport at scroll `0`, and no active request.

## Who reads state
- `AppShell` reads viewport state to restore scroll
- `Navbar` reads `menuState` and `isMobileViewport`
- `NavbarMenuPanel` reads `menuState` and `isMobileViewport`
- `IntroLoader` reads `isLoaderVisible` and `isMobileViewport`
- `MobileGate` reads `isMobileViewport`
- `PageHost` reads transition state to choose pages
- `PageState` reads viewport state to control positioning and offset
- `TransitionOrchestrator` reads the full transition state to execute the current request

## Who changes state
- `AppShell` dispatches `NAVIGATE` and `SET_MOBILE_VIEWPORT`
- `Navbar` dispatches `MENU_OPEN` and `MENU_CLOSE`
- `IntroLoader` dispatches `HIDE_LOADER`
- `TransitionOrchestrator` dispatches `CLEANUP` and queued `NAVIGATE`

## Why cleanup exists
The reducer computes the post-animation state before animation starts. That future state is stored in `cleanup` and only committed after the recipe finishes, which keeps rendering and motion synchronized.

# Animation Flow
Animations move through a small pipeline:

1. An event produces a transition request in the reducer.
2. The orchestrator asks the registry for the recipe that matches the request key.
3. The recipe finds DOM nodes through `dom-targets.ts`.
4. The recipe builds a GSAP timeline using `createBaseTimeline()`, `applyExit()`, and `applyEnter()` or menu-specific steps.
5. `runTimeline()` plays the timeline and returns a promise.
6. When the promise resolves, cleanup is dispatched.

The shared primitives define the motion vocabulary used across the system: a custom easing curve, clip-path open and closed states, content exit movement, incoming stage entry movement, and overlay fades.

Because pages, the menu panel, and the loader all use the `PageState` structure, recipes can animate different surfaces through the same DOM contract.

# Navigation Flow
After a user clicks a navigation link:

1. The click goes through a Next.js `Link`.
2. The router updates the pathname.
3. `AppShell` converts that pathname change into a `NAVIGATE` event.
4. The reducer stores the outgoing page, incoming page, viewport lock, request, and cleanup plan.
5. `PageHost` mounts the relevant surfaces.
6. The orchestrator runs the `NAVIGATE` recipe.
7. Cleanup finalizes the new active page.

If the menu is open when navigation starts, the reducer marks the menu as closing and the navigation recipe animates the menu panel out alongside the page transition.

On mobile-sized viewports, the engine still tracks navigation state, but `MobileGate` replaces page content with the desktop-only message and the menu panel renders non-link elements instead of interactive links.

# Important Entry Points
For a first read-through, this order gives the clearest picture of the system.

1. `components/shell/app-shell.tsx` for the runtime shell and external inputs
2. `transition/engine/transition-reducer.ts` for the state model and event handling
3. `transition/engine/transition-orchestrator.tsx` for request execution
4. `transition/registry/register-default-transitions.ts` for the actual transition behaviors
5. `components/pages/page-host.tsx` for state-driven page rendering
6. `components/pages/page-state.tsx` for the shared animation wrapper
7. `transition/adapters/dom-targets.ts` for the DOM contract
8. `components/global/data.tsx` for the page registry
9. `components/navbar/navbar.tsx` and `components/navbar/navbar-menu-panel.tsx` for navigation entry points
10. `components/shell/intro-loader.tsx` for the startup flow

# Glossary
## Active path
The currently committed page path.

## Pending path
The destination path mounted during a transition but not yet committed.

## Queued path
A later navigation request stored while another transition is already running.

## Phase
The global transition status: `idle` or `animating`.

## Request
The reducer-generated instruction that tells the orchestrator which recipe to run.

## Cleanup
The precomputed post-animation state applied when a transition finishes.

## Stage state
The per-surface render state used by `PageHost` and `PageState`, such as `active`, `entering`, `exiting`, or `fixed`.

## Transition recipe
A registered animation implementation keyed by an event type.

## Transition orchestrator
The effect component that runs the active recipe and dispatches cleanup.

## DOM target role
A `data-transition-role` attribute used by adapters to find the right element in the rendered tree.

## Viewport mode
The reducer-controlled choice between `fixed` and `static` page positioning during and after transitions.
