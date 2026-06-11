import { Dispatch } from "react";

// Types
import type { TransitionEvent } from "../engine/events";
import type { TransitionRequest, TransitionState } from "../engine/types";

export type TransitionRuntime = {
  request: TransitionRequest;
  state: TransitionState;
  dispatch: Dispatch<TransitionEvent>;
};

export type TransitionRecipe = {
  key: TransitionRequest["type"];
  description: string;
  run: (runtime: TransitionRuntime) => Promise<void>;
};
