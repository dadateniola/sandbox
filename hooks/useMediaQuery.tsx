"use client";

import { useEffect, useState } from "react";

/**
 * Watches a CSS media query and returns whether it currently matches.
 *
 * @param query CSS media query string, for example `"(max-width: 768px)"`.
 * @returns `true` or `false` after evaluation, or `undefined` before initial client-side check.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const media = window.matchMedia(query);

    const updateMatch = () => {
      setMatches(media.matches);
    };

    updateMatch();

    media.addEventListener("change", updateMatch);

    return () => {
      media.removeEventListener("change", updateMatch);
    };
  }, [query]);

  return matches;
}
