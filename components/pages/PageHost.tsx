"use client";

import { resolveRouteComponent } from "@/routing/route-manifest";
import { useTransitionEngine } from "@/transition/engine/useTransitionEngine";
import {
  selectRenderedPaths,
  selectStageState,
} from "@/transition/engine/transition-selectors";
import { PageStage } from "./PageStage";

/**
 * Page host owns route-to-component rendering and stage layering.
 *
 * Why this file exists:
 * - It is the only place where transition state is translated into page stage UI.
 * - It isolates component lookup from orchestration and adapters.
 */
export const PageHost = () => {
  const { state } = useTransitionEngine();

  const renderedPaths = selectRenderedPaths(state);

  return (
    <>
      {renderedPaths.map((path) => {
        const Component = resolveRouteComponent(path);

        return (
          <PageStage key={path} stageState={selectStageState(state, path)}>
            <Component />
          </PageStage>
        );
      })}
    </>
  );
};
