// Types
import type { StageTargets } from "./types";

// Utils
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

export const getProjectTargets = (slug?: string | null) => {
  if (!slug) {
    return { heroImage: null, cardImage: null };
  }

  const heroImage = document.querySelector(
    `[data-transition-role="project-hero-image"][data-project-slug="${slug}"]`,
  ) as HTMLElement | null;

  const cardImage = document.querySelector(
    `[data-transition-role="project-card-image"][data-project-slug="${slug}"]`,
  ) as HTMLElement | null;

  return { heroImage, cardImage };
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
    return { content: null, overlay: null, scrollContainer: null };
  }

  return {
    content: element.querySelector(
      '[data-transition-role="content"]',
    ) as HTMLElement | null,
    overlay: element.querySelector(
      '[data-transition-role="overlay"]',
    ) as HTMLElement | null,
    scrollContainer: element.querySelector(
      '[data-transition-role="scroll-container"]',
    ) as HTMLElement | null,
  };
};
