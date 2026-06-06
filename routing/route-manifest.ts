import type { ComponentType } from "react";

import Home from "@/components/home/home";
import About from "@/components/about/about";
import Contact from "@/components/contact/contact";
import Projects from "@/components/projects/projects";
import Exhibitions from "@/components/exhibitions/exhibitions";
import NotFound from "@/components/not-found/not-found";

export type RouteKey = "/" | "/projects" | "/exhibitions" | "/about" | "/contact";

export type RouteDefinition = {
  path: RouteKey;
  label: string;
  component: ComponentType;
};

export const ROUTES: RouteDefinition[] = [
  { path: "/", label: "Home", component: Home },
  { path: "/projects", label: "Projects", component: Projects },
  { path: "/exhibitions", label: "Exhibitions", component: Exhibitions },
  { path: "/about", label: "About", component: About },
  { path: "/contact", label: "Contact", component: Contact },
];

export const ROUTE_LABELS = Object.fromEntries(
  ROUTES.map((route) => [route.path, route.label]),
) as Record<RouteKey, string>;

export const resolveRouteComponent = (path: string): ComponentType => {
  const route = ROUTES.find((entry) => entry.path === path);
  return route ? route.component : NotFound;
};
