export type RouteKey =
  | "/"
  | "/projects"
  | "/projects/:projectId"
  | "/exhibitions"
  | "/about"
  | "/contact";

export type RouteDefinition = {
  path: RouteKey;
  label: string;
  content: (params?: Record<string, string>) => JSX.Element;
};

export interface CTAProps {
  size: number;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
