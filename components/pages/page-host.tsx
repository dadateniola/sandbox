"use client";

// Imports
import PageState from "./page-state";
import { PAGE_DATA } from "../global/data";
import NotFound from "../not-found/not-found";
import { useTransitionEngine } from "@/transition/engine/TransitionContext";

import {
  selectStageState,
  selectRenderedPaths,
} from "@/transition/engine/transition-selectors";

const PageHost = () => {
  // Hooks
  const { state } = useTransitionEngine();

  // Render
  const renderedPaths = selectRenderedPaths(state);

  return (
    <>
      {renderedPaths.map((path) => {
        const Component = PAGE_DATA[path].content ?? NotFound;

        return (
          <PageState key={path} stageState={selectStageState(state, path)}>
            <Component />
          </PageState>
        );
      })}
    </>
  );
};

export default PageHost;
