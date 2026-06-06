/**
 * DOM target adapter.
 *
 * Why this file exists:
 * - All selector knowledge lives in one place.
 * - Orchestrators and registries can stay focused on behavior, not DOM structure.
 *
 * What this file should never do:
 * - It should never dispatch reducer events.
 * - It should never define transition business rules.
 */

export type StageTargets = {
  exiting: HTMLElement | null;
  entering: HTMLElement | null;
  active: HTMLElement | null;
};

export const getStageTargets = (): StageTargets => {
  const exiting = document.querySelector(
    '[data-transition-role="page-stage"][data-stage-state="exiting"]',
  ) as HTMLElement | null;

  const entering = document.querySelector(
    '[data-transition-role="page-stage"][data-stage-state="entering"]',
  ) as HTMLElement | null;

  const active = document.querySelector(
    '[data-transition-role="page-stage"][data-stage-state="active"]',
  ) as HTMLElement | null;

  return { exiting, entering, active };
};

export const getMenuPanelTarget = (): HTMLElement | null => {
  return document.querySelector(
    '[data-transition-role="menu-panel"]',
  ) as HTMLElement | null;
};

export const getLoaderTarget = (): HTMLElement | null => {
  return document.querySelector(
    '[data-transition-role="loader"]',
  ) as HTMLElement | null;
};

export const getTargetParts = (element: HTMLElement | null) => {
  if (!element) {
    return { content: null, overlay: null };
  }

  return {
    content: element.querySelector('[data-transition-role="content"]') as HTMLElement | null,
    overlay: element.querySelector('[data-transition-role="overlay"]') as HTMLElement | null,
  };
};
