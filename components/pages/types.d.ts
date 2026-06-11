export type PageStageState =
  | "active"
  | "entering"
  | "exiting"
  | "inactive"
  | "fixed";

export interface PageStateProps {
  children: React.ReactNode;
  stageState: PageStageState;
}
