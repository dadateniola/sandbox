export type PageStageState =
  | "active"
  | "entering"
  | "exiting"
  | "inactive"
  | "fixed";

export interface PageStateProps {
  role: string;
  className?: string;
  children: React.ReactNode;
  stageState: PageStageState;
}
