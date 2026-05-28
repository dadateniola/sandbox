/**
 * Determines if a route is currently active based on the pathname.
 *
 * A route is considered active if:
 * - The pathname exactly matches the href, OR
 * - The pathname starts with the href followed by a slash (indicating a nested route)
 *
 * @param params - Route matching parameters.
 * @param params.href - The target route path to check against.
 * @param params.pathname - The current pathname from the router.
 * @returns `true` if the route is active, `false` otherwise.
 *
 * @example
 * ```ts
 * isActiveRoute({ href: "/users", pathname: "/users" })
 * // => true
 *
 * isActiveRoute({ href: "/users", pathname: "/users/123" })
 * // => true
 *
 * isActiveRoute({ href: "/users", pathname: "/settings" })
 * // => false
 * ```
 */
export const isActiveRoute = ({
  href,
  pathname,
}: {
  href: string;
  pathname: string;
}) => {
  return pathname === href || pathname.startsWith(href + "/");
};
