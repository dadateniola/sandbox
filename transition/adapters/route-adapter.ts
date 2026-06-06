export const normalizeRoute = (pathname: string): string => {
  if (!pathname) return "/";
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
};

export const shouldRequestNavigation = ({
  pathname,
  activePath,
  pendingPath,
}: {
  pathname: string;
  activePath: string;
  pendingPath: string | null;
}): boolean => {
  const normalizedPathname = normalizeRoute(pathname);
  const normalizedActive = normalizeRoute(activePath);
  const normalizedPending = pendingPath ? normalizeRoute(pendingPath) : null;

  if (normalizedPathname === normalizedActive) return false;
  if (normalizedPending && normalizedPathname === normalizedPending) return false;
  return true;
};
