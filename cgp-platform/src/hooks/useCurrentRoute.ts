import { RouteMatch, useMatches } from "@tanstack/react-router";

export function useCurrentRoute() {
  const routes = useMatches() as RouteMatch[];
  const route: RouteMatch = routes[routes.length - 1];

  return route;
}
