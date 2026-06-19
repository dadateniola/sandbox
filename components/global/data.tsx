// Types
import type { RouteDefinition } from "./types";

// Pages
import Home from "../home/home";
import About from "../about/about";
import Contact from "../contact/contact";
import Projects from "../projects/projects";
import Exhibitions from "../exhibitions/exhibitions";
import ProjectDetail from "../projects/project-detail";

// Constants
export const ROUTES: RouteDefinition[] = [
  { path: "/", label: "Home", content: () => <Home /> },
  { path: "/projects", label: "Projects", content: () => <Projects /> },
  {
    path: "/projects/:projectId",
    label: "Project Details",
    content: (params) => <ProjectDetail projectId={params?.projectId} />,
  },
  {
    path: "/exhibitions",
    label: "Exhibitions",
    content: () => <Exhibitions />,
  },
  { path: "/about", label: "About", content: () => <About /> },
  { path: "/contact", label: "Contact", content: () => <Contact /> },
];

// Helpers
export const resolveRoute = (
  path: string,
): { route: RouteDefinition; params: Record<string, string> } | undefined => {
  const normalizedPath = path.split("?")[0].split("#")[0];

  const pathSegments = normalizedPath.split("/").filter(Boolean);

  for (const route of ROUTES) {
    const routeSegments = route.path.split("/").filter(Boolean);

    if (routeSegments.length !== pathSegments.length) {
      continue;
    }

    const params: Record<string, string> = {};
    let isMatch = true;

    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i];
      const pathSegment = pathSegments[i];

      if (routeSegment.startsWith(":")) {
        const paramName = routeSegment.slice(1);
        params[paramName] = pathSegment;
        continue;
      }

      if (routeSegment !== pathSegment) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      return { route, params };
    }
  }

  return undefined;
};
